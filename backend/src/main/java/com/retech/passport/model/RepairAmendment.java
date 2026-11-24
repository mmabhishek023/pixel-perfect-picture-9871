package com.retech.passport.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity @Table(name="repair_amendments") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class RepairAmendment {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="amendment_id") private Long amendmentId;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="repair_id") private RepairRecord repair;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="author_id") private User author;
    private String note;
    @Column(name="created_at") private LocalDateTime createdAt;
    @PrePersist public void prePersist() { if(createdAt==null) createdAt=LocalDateTime.now(); }
}