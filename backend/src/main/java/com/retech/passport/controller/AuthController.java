package com.retech.passport.controller;
import com.retech.passport.dto.*;
import com.retech.passport.model.User;
import com.retech.passport.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    @PostMapping("/register") public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) { return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(req)); }
    @PostMapping("/login") public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest req) { return ResponseEntity.ok(authService.login(req)); }
    @GetMapping("/me") public ResponseEntity<UserDto> me(Authentication auth) { User user=(User)auth.getPrincipal(); return ResponseEntity.ok(UserDto.from(user)); }
}