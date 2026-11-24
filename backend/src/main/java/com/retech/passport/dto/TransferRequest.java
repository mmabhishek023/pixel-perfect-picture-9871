package com.retech.passport.dto;
import jakarta.validation.constraints.*;
import lombok.*;
@Data @NoArgsConstructor @AllArgsConstructor
public class TransferRequest { @NotBlank @Email private String recipientEmail; }