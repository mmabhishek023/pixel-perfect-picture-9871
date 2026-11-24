package com.retech.passport.dto;
import com.retech.passport.model.*;
import lombok.*;
import java.time.LocalDateTime;
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class UserDto {
    private Long id; private String name; private String email;
    private UserRole role; private UserStatus status; private LocalDateTime createdAt;
    public static UserDto from(User u) {
        return UserDto.builder().id(u.getUserId()).name(u.getName()).email(u.getEmail())
                .role(u.getRole()).status(u.getStatus()).createdAt(u.getCreatedAt()).build(); }
}