package com.retech.passport.controller;
import com.retech.passport.dto.*;
import com.retech.passport.model.User;
import com.retech.passport.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/admin") @RequiredArgsConstructor @PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final AdminService adminService;
    @GetMapping("/stats") public ResponseEntity<AdminStatsDto> stats() { return ResponseEntity.ok(adminService.getStats()); }
    @GetMapping("/users") public ResponseEntity<List<UserDto>> users() { return ResponseEntity.ok(adminService.getAllUsers()); }
    @PutMapping("/technicians/{id}/approve") public ResponseEntity<UserDto> approveTechnician(@PathVariable Long id, @RequestParam String action, Authentication auth) { User admin=(User)auth.getPrincipal(); return ResponseEntity.ok(adminService.approveTechnician(id,action,admin)); }
}