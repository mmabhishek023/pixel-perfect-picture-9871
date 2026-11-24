package com.retech.passport.dto;
import com.retech.passport.model.*;
import lombok.*;
import java.time.LocalDate;
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ComponentDto {
    private Long id; private ComponentType componentType; private String brandModel;
    private String capacitySpec; private LocalDate installedOn; private LocalDate endedOn;
    private Boolean isActive; private ComponentOrigin origin; private ComponentCondition condition;
    private Short batteryHealth;
    public static ComponentDto from(Component c) {
        return ComponentDto.builder().id(c.getComponentId()).componentType(c.getComponentType())
                .brandModel(c.getBrandModel()).capacitySpec(c.getCapacitySpec()).installedOn(c.getInstalledOn())
                .endedOn(c.getEndedOn()).isActive(c.getIsActive()).origin(c.getOrigin())
                .condition(c.getCondition()).batteryHealth(c.getBatteryHealth()).build(); }
}