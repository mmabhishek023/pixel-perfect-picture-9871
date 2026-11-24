"""
2-Phase MobileNetV2 Transfer Learning Pipeline for Component Identification
"""
import os
import numpy as np
from pathlib import Path

try:
    import tensorflow as tf
    from tensorflow.keras.applications import MobileNetV2
    from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
    from tensorflow.keras.models import Model
    from tensorflow.keras.optimizers import Adam
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False

CLASSES = ["battery", "ram", "ssd", "display", "motherboard", "port"]
NUM_CLASSES = len(CLASSES)
IMG_SIZE = (224, 224)

def build_transfer_model():
    if not TF_AVAILABLE:
        print("TensorFlow not installed. Skipping model build.")
        return None

    # Base MobileNetV2 pretrained on ImageNet
    base_model = MobileNetV2(weights="imagenet", include_top=False, input_shape=(224, 224, 3))
    
    # Phase 1: Freeze base model
    base_model.trainable = False

    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation="relu")(x)
    x = Dropout(0.3)(x)
    predictions = Dense(NUM_CLASSES, activation="softmax")(x)

    model = Model(inputs=base_model.input, outputs=predictions)
    model.compile(optimizer=Adam(learning_rate=1e-3),
                  loss="categorical_crossentropy",
                  metrics=["accuracy"])
    return model, base_model

def fine_tune_phase2(model, base_model):
    if not TF_AVAILABLE or model is None:
        return model

    # Unfreeze top layers of base model (e.g. from layer 100 onwards)
    base_model.trainable = True
    fine_tune_at = 100
    for layer in base_model.layers[:fine_tune_at]:
        layer.trainable = False

    model.compile(optimizer=Adam(learning_rate=1e-5),
                  loss="categorical_crossentropy",
                  metrics=["accuracy"])
    return model

if __name__ == "__main__":
    print("MobileNetV2 2-Phase Transfer Learning Script initialized.")
    if TF_AVAILABLE:
        model, base = build_transfer_model()
        model = fine_tune_phase2(model, base)
        out_dir = Path("models")
        out_dir.mkdir(parents=True, exist_ok=True)
        out_path = out_dir / "component_mobilenetv2.keras"
        model.save(str(out_path))
        print(f"Model architecture saved to {out_path}")
