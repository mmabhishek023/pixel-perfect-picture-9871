package com.retech.passport.model;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity @Table(name="image_uploads") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ImageUpload {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="image_id") private Long imageId;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="device_id") private Device device;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="component_id") private Component component;
    @Column(name="file_path") private String filePath;
    @Column(name="ai_label") private String aiLabel;
    private BigDecimal confidence;
    @Column(name="confirmed_by_user") private Boolean confirmedByUser;
    @Column(name="uploaded_at") private LocalDateTime uploadedAt;
    @PrePersist public void prePersist() { if(uploadedAt==null) uploadedAt=LocalDateTime.now(); if(confirmedByUser==null) confirmedByUser=false; }
}