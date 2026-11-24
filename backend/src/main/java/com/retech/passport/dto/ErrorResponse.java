package com.retech.passport.dto;
import lombok.*;
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ErrorResponse { private String code; private String message; }