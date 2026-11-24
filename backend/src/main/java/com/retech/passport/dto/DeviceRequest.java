package com.retech.passport.dto;
import com.retech.passport.model.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
@Data @NoArgsConstructor @AllArgsConstructor
public class DeviceRequest {
    private DeviceType deviceType; @Size(max=60) private String brand; @Size(max=60) private String model;
    @Size(max=40) private String serialImei; private LocalDate purchaseDate;
    private String osName; private Integer ramGb; private Integer storageGb; private String processor;
    private DeviceStatus status;
    private Integer previousOwnersCount; private String knownDamages; private String damageNotes; private String priorHistory;
    private String internalStatus; private String payoutStatus; private Double payoutAmount;
    private String ownerPhotos; private String listingPhotos; private String activeDamages; private String resolvedDamages;
    private Boolean isListedForSale; private Double listingPrice; private String listingCondition; private String listingNotes;
}