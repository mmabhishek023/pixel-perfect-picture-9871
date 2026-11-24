package com.retech.passport.controller;
import com.retech.passport.dto.PublicPassportDto;
import com.retech.passport.service.DeviceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/passport/public") @RequiredArgsConstructor
public class PassportController {
    private final DeviceService deviceService;
    @GetMapping("/{token}") public ResponseEntity<PublicPassportDto> getPublic(@PathVariable String token) { return ResponseEntity.ok(deviceService.getPublicPassport(token)); }
}