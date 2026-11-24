package com.retech.passport.dto;
import com.retech.passport.model.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
@Data @NoArgsConstructor @AllArgsConstructor
public class ComponentRequest {
    private ComponentType componentType; private String brandModel; private String capacitySpec;
    private LocalDate installedOn; private ComponentCondition condition; private ComponentOrigin origin;
    @Min(0) @Max(100) private Short batteryHealth;
}