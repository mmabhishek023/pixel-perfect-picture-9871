package com.retech.passport.controller;
import com.retech.passport.dto.*;
import com.retech.passport.model.User;
import com.retech.passport.service.ComponentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/components") @RequiredArgsConstructor
public class ComponentController {
    private final ComponentService componentService;
    @PutMapping("/{id}") public ResponseEntity<ComponentDto> update(@PathVariable Long id, @RequestBody ComponentRequest req, Authentication auth) { User user=(User)auth.getPrincipal(); return ResponseEntity.ok(componentService.updateComponent(id,req,user)); }
}