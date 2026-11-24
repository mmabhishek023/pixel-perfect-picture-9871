package com.retech.passport.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity @Table(name="health_assessments") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class HealthAssessment {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="assessment_id") private Long assessmentId;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="device_id") private Device device;
    private Short score;
    private Character grade;
    @Column(columnDefinition="text") private String factors;
    private String recommendation;
    @Column(columnDefinition="text") private String reasons;
    @Column(name="generated_at") private LocalDateTime generatedAt;
    @PrePersist public void prePersist() { if(generatedAt==null) generatedAt=LocalDateTime.now(); }
}