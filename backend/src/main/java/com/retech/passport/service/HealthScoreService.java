package com.retech.passport.service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.retech.passport.model.*;
import com.retech.passport.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
@Service @RequiredArgsConstructor
public class HealthScoreService {
    private final ComponentRepository componentRepository;
    private final RepairRecordRepository repairRecordRepository;
    private final HealthAssessmentRepository healthAssessmentRepository;
    private final RecommendationService recommendationService;
    private final ObjectMapper objectMapper;
    public HealthAssessment computeAndSave(Device device) {
        List<Component> activeComponents = componentRepository.findByDeviceAndIsActiveTrue(device);
        long repairCount = repairRecordRepository.countByDevice(device);
        long fullYears = ChronoUnit.YEARS.between(device.getPurchaseDate(), LocalDate.now());
        double dAge = Math.min(30.0, 5.0 * fullYears);
        double dRep = Math.min(20.0, 4.0 * repairCount);
        Component activeBattery = activeComponents.stream().filter(c -> c.getComponentType()==ComponentType.BATTERY && c.getBatteryHealth()!=null).findFirst().orElse(null);
        double dBat = 0.0;
        if (activeBattery != null && activeBattery.getBatteryHealth() < 80) dBat = Math.min(20.0, 0.5*(80-activeBattery.getBatteryHealth()));
        long countPoor = activeComponents.stream().filter(c->c.getCondition()==ComponentCondition.POOR).count();
        long countFair = activeComponents.stream().filter(c->c.getCondition()==ComponentCondition.FAIR).count();
        double dCmp = Math.min(20.0, 5.0*countPoor + 2.0*countFair);
        List<Component> allComponents = componentRepository.findByDevice(device);
        long countReplaced = allComponents.stream().filter(c->c.getOrigin()==ComponentOrigin.REPLACED && (c.getComponentType()==ComponentType.MOTHERBOARD || c.getComponentType()==ComponentType.DISPLAY)).count();
        double dCrit = Math.min(10.0, 5.0*countReplaced);
        double totalDeductions = dAge+dRep+dBat+dCmp+dCrit;
        int score = (int)Math.max(0, Math.round(100-totalDeductions));
        char grade = score>=80?'A':score>=60?'B':score>=40?'C':'D';
        // Top-3 reasons
        Map<String,Double> deductions = new LinkedHashMap<>();
        if(dAge>0) deductions.put(String.format("Device age %d years (%.0f pt deduction)",fullYears,dAge),dAge);
        if(dRep>0) deductions.put(String.format("%d repair records (%.0f pt deduction)",repairCount,dRep),dRep);
        if(dBat>0 && activeBattery!=null) deductions.put(String.format("Battery at %d%% health (%.1f pt deduction)",(int)(short)activeBattery.getBatteryHealth(),dBat),dBat);
        if(dCmp>0) deductions.put(String.format("%d poor + %d fair components (%.0f pt deduction)",countPoor,countFair,dCmp),dCmp);
        if(dCrit>0) deductions.put(String.format("%d critical replacements (%.0f pt deduction)",countReplaced,dCrit),dCrit);
        List<String> top3 = deductions.entrySet().stream().sorted(Map.Entry.<String,Double>comparingByValue().reversed()).limit(3).map(Map.Entry::getKey).toList();
        String recommendation = recommendationService.recommend(device.getDeviceType(),grade,fullYears,(int)countPoor,(int)countReplaced,activeComponents);
        Map<String,Double> factors = Map.of("dAge",dAge,"dRep",dRep,"dBat",dBat,"dCmp",dCmp,"dCrit",dCrit);
        try {
            HealthAssessment assessment = HealthAssessment.builder().device(device).score((short)score).grade(grade)
                    .factors(objectMapper.writeValueAsString(factors)).recommendation(recommendation)
                    .reasons(objectMapper.writeValueAsString(top3)).build();
            return healthAssessmentRepository.save(assessment);
        } catch(Exception e) { throw new RuntimeException("Failed to serialize health assessment",e); }
    }
}