package com.retech.passport.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity @Table(name="users") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="user_id") private Long userId;
    private String name;
    @Column(unique=true) private String email;
    @Column(name="password_hash") private String passwordHash;
    @Enumerated(EnumType.STRING) private UserRole role;
    @Enumerated(EnumType.STRING) private UserStatus status;
    @Column(name="created_at") private LocalDateTime createdAt;
    @PrePersist public void prePersist() { if(createdAt==null) createdAt=LocalDateTime.now(); if(status==null) status=UserStatus.ACTIVE; }
}