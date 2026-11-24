package com.retech.passport.dto;
import com.retech.passport.model.HealthAssessment;
import lombok.*;
import java.time.LocalDateTime;
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class HealthDto {
    private Integer score; private Character grade; private String recommendation;
    private String reasons; private Object factors; private LocalDateTime generatedAt;
    public static HealthDto from(HealthAssessment a) {
        if(a==null) return null;
        return HealthDto.builder().score((int)a.getScore()).grade(a.getGrade())
                .recommendation(a.getRecommendation()).reasons(a.getReasons())
                .generatedAt(a.getGeneratedAt()).build(); }
}