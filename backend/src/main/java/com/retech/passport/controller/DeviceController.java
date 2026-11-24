package com.retech.passport.controller;
import com.retech.passport.dto.*;
import com.retech.passport.model.User;
import com.retech.passport.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/devices") @RequiredArgsConstructor
public class DeviceController {
    private final DeviceService deviceService;
    private final ComponentService componentService;
    private final RepairService repairService;
    @GetMapping public ResponseEntity<List<DeviceDto>> getDevices(Authentication auth) { User user=(User)auth.getPrincipal(); return ResponseEntity.ok(deviceService.getUserDevices(user)); }
    @PostMapping public ResponseEntity<DeviceDto> register(@Valid @RequestBody DeviceRequest req, Authentication auth) { User user=(User)auth.getPrincipal(); return ResponseEntity.status(HttpStatus.CREATED).body(deviceService.registerDevice(req,user)); }
    @GetMapping("/{id}") public ResponseEntity<DeviceDto> getDevice(@PathVariable Long id, Authentication auth) { User user=(User)auth.getPrincipal(); return ResponseEntity.ok(deviceService.getDevice(id,user)); }
    @PutMapping("/{id}") public ResponseEntity<DeviceDto> update(@PathVariable Long id, @RequestBody DeviceRequest req, Authentication auth) { User user=(User)auth.getPrincipal(); return ResponseEntity.ok(deviceService.updateDevice(id,req,user)); }
    @PostMapping("/{id}/transfer") public ResponseEntity<DeviceDto> transfer(@PathVariable Long id, @Valid @RequestBody TransferRequest req, Authentication auth) { User user=(User)auth.getPrincipal(); return ResponseEntity.ok(deviceService.transferDevice(id,req,user)); }
    @GetMapping("/{id}/qr") public ResponseEntity<byte[]> getQr(@PathVariable Long id, Authentication auth) { User user=(User)auth.getPrincipal(); return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(deviceService.getQrImage(id,user)); }
    @GetMapping("/{id}/repairs") public ResponseEntity<List<RepairDto>> getRepairs(@PathVariable Long id, Authentication auth) { User user=(User)auth.getPrincipal(); return ResponseEntity.ok(repairService.getRepairs(id,user)); }
    @PostMapping("/{id}/repairs") public ResponseEntity<RepairDto> createRepair(@PathVariable Long id, @Valid @RequestBody RepairRequest req, Authentication auth) { User user=(User)auth.getPrincipal(); return ResponseEntity.status(HttpStatus.CREATED).body(repairService.createRepair(id,req,user)); }
    @PostMapping("/{id}/components") public ResponseEntity<ComponentDto> addComponent(@PathVariable Long id, @Valid @RequestBody ComponentRequest req, Authentication auth) { User user=(User)auth.getPrincipal(); return ResponseEntity.status(HttpStatus.CREATED).body(componentService.addComponent(id,req,user)); }
}