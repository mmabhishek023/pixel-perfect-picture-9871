package com.retech.passport.dto;
import com.retech.passport.model.*;
import lombok.*;
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class PublicPassportDto {
    private String passportId; private DeviceType deviceType; private String brand; private String model;
    private Character grade; private String recommendation; private DeviceStatus status;
}