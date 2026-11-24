package com.retech.passport.dto;
import com.retech.passport.model.*;
import jakarta.validation.constraints.*;
import lombok.*;
@Data @NoArgsConstructor @AllArgsConstructor
public class RegisterRequest {
    @NotBlank @Size(max=100) private String name;
    @NotBlank @Email @Size(max=150) private String email;
    @NotBlank @Size(min=8, max=100) private String password;
    @NotNull private UserRole role;
    private String organization;
}