package com.retech.passport.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Entity @Table(name="devices") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Device {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="device_id") private Long deviceId;
    @Column(name="passport_id", unique=true) private String passportId;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="owner_id") private User owner;
    @Enumerated(EnumType.STRING) @Column(name="device_type") private DeviceType deviceType;
    private String brand;
    private String model;
    @Column(name="serial_imei", unique=true) private String serialImei;
    @Column(name="purchase_date") private LocalDate purchaseDate;
    @Column(name="os_name") private String osName;
    @Column(name="ram_gb") private Integer ramGb;
    @Column(name="storage_gb") private Integer storageGb;
    private String processor;
    @Enumerated(EnumType.STRING) private DeviceStatus status;
    @Column(name="previous_owners_count") private Integer previousOwnersCount;
    @Column(name="known_damages") private String knownDamages;
    @Column(name="damage_notes") private String damageNotes;
    @Column(name="prior_history") private String priorHistory;
    @Column(name="internal_status") private String internalStatus;
    @Column(name="payout_status") private String payoutStatus;
    @Column(name="payout_amount") private Double payoutAmount;
    @Column(name="owner_photos", columnDefinition="TEXT") private String ownerPhotos;
    @Column(name="listing_photos", columnDefinition="TEXT") private String listingPhotos;
    @Column(name="active_damages", columnDefinition="TEXT") private String activeDamages;
    @Column(name="resolved_damages", columnDefinition="TEXT") private String resolvedDamages;
    @Column(name="is_listed_for_sale") private Boolean isListedForSale;
    @Column(name="listing_price") private Double listingPrice;
    @Column(name="listing_condition") private String listingCondition;
    @Column(name="listing_notes", columnDefinition="TEXT") private String listingNotes;
    @Column(name="qr_token", unique=true) private String qrToken;
    @Column(name="qr_image_path") private String qrImagePath;
}