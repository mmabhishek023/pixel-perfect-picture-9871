package com.retech.passport.controller;
import com.retech.passport.exception.UnsupportedMediaTypeException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.time.Instant;
import java.util.Map;
@RestController @RequestMapping("/api/ai") @Slf4j
public class AiController {
    @Value("${retech.ai-service-url}") private String aiServiceUrl;
    @Value("${retech.storage.upload-dir}") private String uploadDir;
    @PostMapping("/identify-component")
    public ResponseEntity<Map<String,Object>> identify(@RequestParam("file") MultipartFile file) throws IOException {
        String ct=file.getContentType();
        if(ct==null||(!ct.equals("image/jpeg")&&!ct.equals("image/png"))) throw new UnsupportedMediaTypeException("Only JPEG and PNG images are supported");
        if(file.getSize()>5*1024*1024) throw new UnsupportedMediaTypeException("File exceeds 5MB limit");
        Path dir=Paths.get(uploadDir); Files.createDirectories(dir);
        String ext=ct.equals("image/png")?".png":".jpg";
        String filename="upload_"+Instant.now().toEpochMilli()+ext;
        file.transferTo(dir.resolve(filename));
        try {
            RestTemplate rt=new RestTemplate();
            MultiValueMap<String,Object> body=new LinkedMultiValueMap<>();
            byte[] bytes=file.getBytes();
            body.add("file",new ByteArrayResource(bytes){@Override public String getFilename(){return file.getOriginalFilename();}});
            HttpHeaders headers=new HttpHeaders(); headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            ResponseEntity<Map> response=rt.postForEntity(aiServiceUrl+"/identify",new HttpEntity<>(body,headers),Map.class);
            @SuppressWarnings("unchecked") Map<String,Object> result=response.getBody();
            if(result!=null) result.put("advisory","AI result is advisory; confirm before saving.");
            return ResponseEntity.ok(result!=null?result:Map.of("label","unknown","confidence",0));
        } catch(ResourceAccessException e){
            log.warn("AI service unavailable: {}",e.getMessage());
            return ResponseEntity.ok(Map.of("available",false,"label","unknown","confidence",0,"advisory","AI service unavailable; please select component manually."));
        }
    }
}