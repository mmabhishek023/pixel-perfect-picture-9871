package com.retech.passport.dto;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data @NoArgsConstructor @AllArgsConstructor
public class RepairRequest {
    @NotNull private LocalDate repairDate; @NotBlank private String issue; @NotBlank private String actionTaken;
    private BigDecimal cost; private String notes;
}