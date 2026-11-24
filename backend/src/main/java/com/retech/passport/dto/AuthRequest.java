package com.retech.passport.dto;
import jakarta.validation.constraints.*;
import lombok.*;
@Data @NoArgsConstructor @AllArgsConstructor
public class AuthRequest { @NotBlank @Email private String email; @NotBlank @Size(min=8) private String password; }