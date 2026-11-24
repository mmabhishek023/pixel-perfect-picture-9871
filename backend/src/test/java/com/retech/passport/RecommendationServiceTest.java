package com.retech.passport;
import com.retech.passport.model.*;
import com.retech.passport.service.RecommendationService;
import org.junit.jupiter.api.*;
import java.util.*;
import static org.assertj.core.api.Assertions.*;
class RecommendationServiceTest {
    RecommendationService service = new RecommendationService();
    private Component makeActive(ComponentType type, ComponentCondition cond) {
        Component c=new Component(); c.setComponentType(type); c.setCondition(cond); c.setIsActive(true); c.setOrigin(ComponentOrigin.ORIGINAL); return c;
    }
    @Test void rule1_gradeD_recycles() { assertThat(service.recommend(DeviceType.LAPTOP,'D',2,0,0,List.of())).isEqualTo("RECYCLE"); }
    @Test void rule1_laptopOver8Years_recycles() { assertThat(service.recommend(DeviceType.LAPTOP,'B',9,0,0,List.of())).isEqualTo("RECYCLE"); }
    @Test void rule1_smartphoneOver6Years_recycles() { assertThat(service.recommend(DeviceType.SMARTPHONE,'B',7,0,0,List.of())).isEqualTo("RECYCLE"); }
    @Test void rule1_twoOrMoreCriticalFailures_recycles() { assertThat(service.recommend(DeviceType.LAPTOP,'B',2,0,2,List.of())).isEqualTo("RECYCLE"); }
    @Test void rule2_gradeBNoPoor_reuses() { assertThat(service.recommend(DeviceType.LAPTOP,'B',2,0,0,List.of())).isEqualTo("REUSE"); }
    @Test void rule2_gradeANoPoor_reuses() { assertThat(service.recommend(DeviceType.SMARTPHONE,'A',1,0,0,List.of())).isEqualTo("REUSE"); }
    @Test void rule3_gradeBOnePoorBattery_repairs() {
        List<Component> comps=List.of(makeActive(ComponentType.BATTERY,ComponentCondition.POOR));
        assertThat(service.recommend(DeviceType.LAPTOP,'B',2,1,0,comps)).isEqualTo("REPAIR");
    }
    @Test void rule3_gradeCTwoPoorRepairables_repairs() {
        List<Component> comps=List.of(makeActive(ComponentType.BATTERY,ComponentCondition.POOR),makeActive(ComponentType.DISPLAY,ComponentCondition.POOR));
        assertThat(service.recommend(DeviceType.LAPTOP,'C',2,2,0,comps)).isEqualTo("REPAIR");
    }
    @Test void rule3_gradeBOnePoorMotherboard_refurbishes() {
        List<Component> comps=List.of(makeActive(ComponentType.MOTHERBOARD,ComponentCondition.POOR));
        assertThat(service.recommend(DeviceType.LAPTOP,'B',2,1,0,comps)).isEqualTo("REFURBISH");
    }
    @Test void rule4_gradeCThreePoor_refurbishes() {
        List<Component> comps=List.of(makeActive(ComponentType.BATTERY,ComponentCondition.POOR),makeActive(ComponentType.DISPLAY,ComponentCondition.POOR),makeActive(ComponentType.RAM,ComponentCondition.POOR));
        assertThat(service.recommend(DeviceType.LAPTOP,'C',2,3,0,comps)).isEqualTo("REFURBISH");
    }
    @Test void edgeCase_gradeBAge9Years_recycles() { assertThat(service.recommend(DeviceType.LAPTOP,'B',9,0,0,List.of())).isEqualTo("RECYCLE"); }
    @Test void exampleBook14_gradeCRepair() {
        List<Component> comps=List.of(makeActive(ComponentType.BATTERY,ComponentCondition.POOR),makeActive(ComponentType.PORT,ComponentCondition.FAIR));
        assertThat(service.recommend(DeviceType.LAPTOP,'C',4,1,1,comps)).isEqualTo("REPAIR");
    }
}