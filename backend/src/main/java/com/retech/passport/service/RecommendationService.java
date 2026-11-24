package com.retech.passport.service;
import com.retech.passport.model.*;
import org.springframework.stereotype.Service;
import java.util.*;
@Service
public class RecommendationService {
    private static final Set<ComponentType> REPAIRABLE = Set.of(ComponentType.BATTERY, ComponentType.DISPLAY, ComponentType.SSD, ComponentType.RAM);
    public String recommend(DeviceType deviceType, char grade, long ageYears, int countPoor, int countReplacedCritical, List<Component> activeComponents) {
        int ageLimit = (deviceType == DeviceType.LAPTOP) ? 8 : 6;
        // Rule 1: RECYCLE
        if (grade == 'D' || countReplacedCritical >= 2 || ageYears > ageLimit) return "RECYCLE";
        // Rule 2: REUSE
        if ((grade == 'A' || grade == 'B') && countPoor == 0) return "REUSE";
        // Rule 3: REPAIR
        List<Component> poorComponents = activeComponents.stream().filter(c -> c.getCondition() == ComponentCondition.POOR).toList();
        boolean allPoorRepairable = poorComponents.stream().allMatch(c -> REPAIRABLE.contains(c.getComponentType()));
        if ((grade == 'B' || grade == 'C') && poorComponents.size() >= 1 && poorComponents.size() <= 2 && allPoorRepairable) return "REPAIR";
        // Rule 4: REFURBISH
        return "REFURBISH";
    }
}