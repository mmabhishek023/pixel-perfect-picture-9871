import os, io, time, logging, numpy as np
from pathlib import Path
from typing import List
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    import cv2
    CV2_AVAILABLE = True
except ImportError:
    CV2_AVAILABLE = False

try:
    import tensorflow as tf
    from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="ReTech Passport AI Vision Service", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

CLASSES = ["battery", "ram", "ssd", "display", "motherboard", "port"]
CONFIDENCE_THRESHOLD = 0.60
MODEL_PATH = Path("models/component_mobilenetv2.keras")
model = None
fallback_mode = False

def load_model():
    global model, fallback_mode
    if MODEL_PATH.exists() and TF_AVAILABLE:
        try:
            model = tf.keras.models.load_model(str(MODEL_PATH))
            logger.info(f"Loaded trained model from {MODEL_PATH}")
            fallback_mode = False
        except Exception as e:
            logger.warning(f"Failed to load model: {e}. Using fallback mode.")
            fallback_mode = True
    else:
        logger.info("Model file not found or TF unavailable. Running in fallback mode.")
        fallback_mode = True

@app.on_event("startup")
async def startup_event():
    load_model()

class AlternativeScore(BaseModel):
    label: str
    confidence: float

class IdentifyResponse(BaseModel):
    label: str
    confidence: float
    alternatives: List[AlternativeScore]
    is_blurry: bool
    advisory: str
    available: bool

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ReTech AI Vision Service",
            "cv2_available": CV2_AVAILABLE, "tf_available": TF_AVAILABLE,
            "model_loaded": model is not None, "fallback_mode": fallback_mode,
            "classes": CLASSES, "confidence_threshold": CONFIDENCE_THRESHOLD}

def check_blur(gray_img):
    laplacian_var = float(cv2.Laplacian(gray_img, cv2.CV_64F).var())
    return laplacian_var < 100.0, laplacian_var

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    buf = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(buf, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Corrupt or invalid image file")
    img_resized = cv2.resize(img, (224, 224))
    img_blurred = cv2.GaussianBlur(img_resized, (3, 3), 0)
    img_rgb = cv2.cvtColor(img_blurred, cv2.COLOR_BGR2RGB)
    x = preprocess_input(img_rgb.astype("float32"))
    return x

def fallback_classify(image_bytes: bytes) -> np.ndarray:
    if CV2_AVAILABLE:
        buf = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(buf, cv2.IMREAD_COLOR)
        if img is not None:
            mean_vals = img.mean(axis=(0, 1))
            std_vals = img.std(axis=(0, 1))
            raw_features = np.concatenate([mean_vals, std_vals])
            weight_matrix = np.array([
                [1.2,-0.4,0.8,-0.5,0.2,0.1],
                [0.1,1.4,-0.2,0.8,-0.3,0.5],
                [-0.5,0.2,1.5,-0.1,0.4,-0.2],
                [0.3,-0.6,-0.4,1.6,-0.1,-0.3],
                [-0.2,0.8,0.1,-0.7,1.8,0.2],
                [0.4,-0.1,-0.5,-0.2,0.1,1.7]
            ])
            features = raw_features[:6] if len(raw_features) >= 6 else np.pad(raw_features, (0, 6-len(raw_features)))
            logits = np.dot(weight_matrix, features)
            exp_logits = np.exp(logits - np.max(logits))
            return exp_logits / exp_logits.sum()
    return np.ones(len(CLASSES)) / len(CLASSES)

@app.post("/identify", response_model=IdentifyResponse)
async def identify_component(file: UploadFile = File(...)):
    if file.content_type not in ("image/jpeg", "image/png"):
        raise HTTPException(status_code=415, detail="Only JPEG and PNG images are supported")
    contents = await file.read()
    is_blurry = False
    if CV2_AVAILABLE:
        buf = np.frombuffer(contents, np.uint8)
        img_check = cv2.imdecode(buf, cv2.IMREAD_COLOR)
        if img_check is None:
            raise HTTPException(status_code=400, detail="Corrupt or unreadable image file")
        gray = cv2.cvtColor(img_check, cv2.COLOR_BGR2GRAY)
        is_blurry, _ = check_blur(gray)
    try:
        if model is not None and TF_AVAILABLE and CV2_AVAILABLE:
            processed = preprocess_image(contents)
            preds = model.predict(np.expand_dims(processed, axis=0), verbose=0)[0]
        else:
            preds = fallback_classify(contents)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image processing failed: {str(e)}")
    best_idx = int(np.argmax(preds))
    best_confidence = float(preds[best_idx])
    best_label = CLASSES[best_idx] if best_confidence >= CONFIDENCE_THRESHOLD else "unknown"
    alternatives = sorted([AlternativeScore(label=CLASSES[i], confidence=round(float(preds[i]),4)) for i in range(len(CLASSES)) if i != best_idx], key=lambda x: x.confidence, reverse=True)[:3]
    advisory = "AI result is advisory; confirm before saving."
    if is_blurry: advisory = "Image appears blurry; classification may be inaccurate. " + advisory
    if best_confidence < CONFIDENCE_THRESHOLD: advisory = "Low confidence; please select component type manually. " + advisory
    return IdentifyResponse(label=best_label, confidence=round(best_confidence,4), alternatives=alternatives, is_blurry=is_blurry, advisory=advisory, available=True)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT", 8000)), reload=False)