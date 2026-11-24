package com.retech.passport.dto;
import jakarta.validation.constraints.*;
import lombok.*;
@Data @NoArgsConstructor @AllArgsConstructor
public class AmendmentRequest { @NotBlank @Size(max=2000) private String note; }