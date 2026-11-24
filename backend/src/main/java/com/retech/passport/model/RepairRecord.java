package com.retech.passport.model;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
@Entity @Table(name="repair_records") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class RepairRecord {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="repair_id") private Long repairId;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="device_id") private Device device;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="technician_id") private User technician;
    @Column(name="repair_date") private LocalDate repairDate;
    private String issue;
    @Column(name="action_taken") private String actionTaken;
    private BigDecimal cost;
    private Boolean verified;
    private String notes;
    @Column(name="created_at") private LocalDateTime createdAt;
    @OneToMany(mappedBy="repair", cascade=CascadeType.ALL, fetch=FetchType.LAZY) private List<RepairAmendment> amendments;
    @PrePersist public void prePersist() { if(createdAt==null) createdAt=LocalDateTime.now(); if(verified==null) verified=false; }
}