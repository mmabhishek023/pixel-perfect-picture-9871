package com.retech.passport.controller;
import com.retech.passport.dto.*;
import com.retech.passport.model.User;
import com.retech.passport.service.RepairService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/repairs") @RequiredArgsConstructor
public class RepairController {
    private final RepairService repairService;
    @PostMapping("/{id}/amend") public ResponseEntity<AmendmentDto> addAmendment(@PathVariable Long id, @RequestBody AmendmentRequest req, Authentication auth) { User user=(User)auth.getPrincipal(); return ResponseEntity.status(HttpStatus.CREATED).body(repairService.addAmendment(id,req,user)); }
}