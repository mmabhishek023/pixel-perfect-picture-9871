package com.retech.passport.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Entity @Table(name="components") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Component {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="component_id") private Long componentId;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="device_id") private Device device;
    @Enumerated(EnumType.STRING) @Column(name="component_type") private ComponentType componentType;
    @Column(name="brand_model") private String brandModel;
    @Column(name="capacity_spec") private String capacitySpec;
    @Column(name="installed_on") private LocalDate installedOn;
    @Column(name="ended_on") private LocalDate endedOn;
    @Column(name="is_active") private Boolean isActive;
    @Enumerated(EnumType.STRING) private ComponentOrigin origin;
    @Enumerated(EnumType.STRING) private ComponentCondition condition;
    @Column(name="battery_health") private Short batteryHealth;
    @PrePersist public void prePersist() { if(isActive==null) isActive=true; if(origin==null) origin=ComponentOrigin.ORIGINAL; if(installedOn==null) installedOn=LocalDate.now(); }
}