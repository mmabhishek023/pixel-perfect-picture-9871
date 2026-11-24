package com.retech.passport.dto;
import lombok.*;
import java.util.Map;
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AdminStatsDto {
    private long totalUsers; private long totalDevices; private long totalRepairs; private long pendingTechnicians;
    private Map<String,Long> gradeDistribution; private Map<String,Long> recommendationDistribution;
}