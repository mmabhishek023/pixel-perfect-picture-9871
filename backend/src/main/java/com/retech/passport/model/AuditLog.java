package com.retech.passport.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity @Table(name="audit_log") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="log_id") private Long logId;
    private String entity;
    @Column(name="entity_id") private Long entityId;
    @Column(name="change_summary") private String changeSummary;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="changed_by") private User changedBy;
    @Column(name="changed_at") private LocalDateTime changedAt;
    @PrePersist public void prePersist() { if(changedAt==null) changedAt=LocalDateTime.now(); }
}