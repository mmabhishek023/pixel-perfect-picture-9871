package com.retech.passport.dto;
import com.retech.passport.model.*;
import lombok.*;
import java.time.LocalDate;
import java.util.*;
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class DeviceDto {
    private Long id; private String passportId; private Long ownerId; private String ownerName;
    private DeviceType deviceType; private String brand; private String model; private String serialImei;
    private LocalDate purchaseDate; private String osName; private Integer ramGb; private Integer storageGb;
    private String processor; private DeviceStatus status; private String qrToken;
    private Integer previousOwnersCount; private String knownDamages; private String damageNotes; private String priorHistory;
    private String internalStatus; private String payoutStatus; private Double payoutAmount;
    private String ownerPhotos; private String listingPhotos; private String activeDamages; private String resolvedDamages;
    private Boolean isListedForSale; private Double listingPrice; private String listingCondition; private String listingNotes;
    private List<ComponentDto> components; private List<RepairDto> repairs; private HealthDto health;
    public static DeviceDto from(Device d) {
        return DeviceDto.builder().id(d.getDeviceId()).passportId(d.getPassportId())
                .ownerId(d.getOwner()!=null?d.getOwner().getUserId():null)
                .ownerName(d.getOwner()!=null?d.getOwner().getName():null)
                .deviceType(d.getDeviceType()).brand(d.getBrand()).model(d.getModel())
                .serialImei(d.getSerialImei()).purchaseDate(d.getPurchaseDate()).osName(d.getOsName())
                .ramGb(d.getRamGb()).storageGb(d.getStorageGb()).processor(d.getProcessor())
                .status(d.getStatus()).qrToken(d.getQrToken())
                .previousOwnersCount(d.getPreviousOwnersCount()).knownDamages(d.getKnownDamages())
                .damageNotes(d.getDamageNotes()).priorHistory(d.getPriorHistory())
                .internalStatus(d.getInternalStatus()).payoutStatus(d.getPayoutStatus())
                .payoutAmount(d.getPayoutAmount()).ownerPhotos(d.getOwnerPhotos())
                .listingPhotos(d.getListingPhotos()).activeDamages(d.getActiveDamages())
                .resolvedDamages(d.getResolvedDamages()).isListedForSale(d.getIsListedForSale())
                .listingPrice(d.getListingPrice()).listingCondition(d.getListingCondition())
                .listingNotes(d.getListingNotes()).build(); }
}