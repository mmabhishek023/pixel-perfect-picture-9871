package com.retech.passport;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.retech.passport.model.*;
import com.retech.passport.repository.*;
import com.retech.passport.service.*;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDate;
import java.util.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
class HealthScoreServiceTest {
    @Mock ComponentRepository componentRepository;
    @Mock RepairRecordRepository repairRecordRepository;
    @Mock HealthAssessmentRepository healthAssessmentRepository;
    @Mock RecommendationService recommendationService;
    @InjectMocks HealthScoreService service;
    ObjectMapper objectMapper = new ObjectMapper();
    private Device makeDevice(int yearsOld) {
        Device d=new Device(); d.setDeviceId(1L); d.setPurchaseDate(LocalDate.now().minusYears(yearsOld)); d.setDeviceType(DeviceType.LAPTOP); return d;
    }
    private Component makeBattery(int health, ComponentCondition condition) {
        Component c=new Component(); c.setComponentType(ComponentType.BATTERY); c.setBatteryHealth((short)health); c.setCondition(condition); c.setIsActive(true); c.setOrigin(ComponentOrigin.ORIGINAL); return c;
    }
    private Component makeComp(ComponentCondition cond) {
        Component c=new Component(); c.setComponentType(ComponentType.RAM); c.setCondition(cond); c.setIsActive(true); c.setOrigin(ComponentOrigin.ORIGINAL); return c;
    }
    @BeforeEach void setup() throws Exception {
        var field=HealthScoreService.class.getDeclaredField("objectMapper"); field.setAccessible(true); field.set(service,objectMapper);
        when(recommendationService.recommend(any(),anyChar(),anyLong(),anyInt(),anyInt(),anyList())).thenReturn("REPAIR");
        when(healthAssessmentRepository.save(any())).thenAnswer(inv->inv.getArgument(0));
    }
    @Test void dAgeCapAt30() {
        Device d=makeDevice(10);
        when(componentRepository.findByDeviceAndIsActiveTrue(d)).thenReturn(List.of());
        when(componentRepository.findByDevice(d)).thenReturn(List.of());
        when(repairRecordRepository.countByDevice(d)).thenReturn(0L);
        HealthAssessment result=service.computeAndSave(d);
        assertThat(result.getScore()).isEqualTo((short)70);
        assertThat(result.getGrade()).isEqualTo('B');
    }
    @Test void batteryAt80PercentNoPenalty() {
        Device d=makeDevice(0);
        Component battery=makeBattery(80,ComponentCondition.GOOD);
        when(componentRepository.findByDeviceAndIsActiveTrue(d)).thenReturn(List.of(battery));
        when(componentRepository.findByDevice(d)).thenReturn(List.of(battery));
        when(repairRecordRepository.countByDevice(d)).thenReturn(0L);
        HealthAssessment result=service.computeAndSave(d);
        assertThat(result.getScore()).isEqualTo((short)100);
    }
    @Test void batteryAt40PercentCapAt20() {
        Device d=makeDevice(0);
        Component battery=makeBattery(40,ComponentCondition.POOR);
        when(componentRepository.findByDeviceAndIsActiveTrue(d)).thenReturn(List.of(battery));
        when(componentRepository.findByDevice(d)).thenReturn(List.of(battery));
        when(repairRecordRepository.countByDevice(d)).thenReturn(0L);
        HealthAssessment result=service.computeAndSave(d);
        assertThat(result.getScore()).isEqualTo((short)75); // dBat=20, dCmp=5(POOR), score=100-25=75
    }
    @Test void repairDeductionCapAt20() {
        Device d=makeDevice(0);
        when(componentRepository.findByDeviceAndIsActiveTrue(d)).thenReturn(List.of());
        when(componentRepository.findByDevice(d)).thenReturn(List.of());
        when(repairRecordRepository.countByDevice(d)).thenReturn(10L);
        HealthAssessment result=service.computeAndSave(d);
        assertThat(result.getScore()).isEqualTo((short)80);
    }
    @Test void criticalDeductionCapAt10() {
        Device d=makeDevice(0);
        List<Component> comps=new ArrayList<>();
        for(int i=0;i<3;i++){
            Component c=new Component(); c.setComponentType(ComponentType.DISPLAY); c.setOrigin(ComponentOrigin.REPLACED); c.setCondition(ComponentCondition.GOOD); c.setIsActive(i==2); comps.add(c);
        }
        when(componentRepository.findByDeviceAndIsActiveTrue(d)).thenReturn(List.of(comps.get(2)));
        when(componentRepository.findByDevice(d)).thenReturn(comps);
        when(repairRecordRepository.countByDevice(d)).thenReturn(0L);
        HealthAssessment result=service.computeAndSave(d);
        assertThat(result.getScore()).isEqualTo((short)90);
    }
    @Test void exampleBook14Score51GradeC() {
        Device d=makeDevice(4);
        Component battery=makeBattery(62,ComponentCondition.POOR);
        Component port=new Component(); port.setComponentType(ComponentType.PORT); port.setCondition(ComponentCondition.FAIR); port.setIsActive(true); port.setOrigin(ComponentOrigin.ORIGINAL);
        Component oldDisplay=new Component(); oldDisplay.setComponentType(ComponentType.DISPLAY); oldDisplay.setCondition(ComponentCondition.POOR); oldDisplay.setIsActive(false); oldDisplay.setOrigin(ComponentOrigin.ORIGINAL);
        Component newDisplay=new Component(); newDisplay.setComponentType(ComponentType.DISPLAY); newDisplay.setCondition(ComponentCondition.GOOD); newDisplay.setIsActive(true); newDisplay.setOrigin(ComponentOrigin.REPLACED);
        when(componentRepository.findByDeviceAndIsActiveTrue(d)).thenReturn(List.of(battery,port,newDisplay));
        when(componentRepository.findByDevice(d)).thenReturn(List.of(battery,port,oldDisplay,newDisplay));
        when(repairRecordRepository.countByDevice(d)).thenReturn(2L);
        HealthAssessment result=service.computeAndSave(d);
        assertThat(result.getScore()).isEqualTo((short)51);
        assertThat(result.getGrade()).isEqualTo('C');
    }
    @Test void gradeA80AndAbove() {
        Device d=makeDevice(0);
        when(componentRepository.findByDeviceAndIsActiveTrue(d)).thenReturn(List.of());
        when(componentRepository.findByDevice(d)).thenReturn(List.of());
        when(repairRecordRepository.countByDevice(d)).thenReturn(0L);
        HealthAssessment result=service.computeAndSave(d);
        assertThat(result.getScore()).isEqualTo((short)100);
        assertThat(result.getGrade()).isEqualTo('A');
    }
    @Test void grade39IsD() {
        Device d=makeDevice(6); // dAge=30
        List<Component> comps=new ArrayList<>();
        for(int i=0;i<4;i++) comps.add(makeComp(ComponentCondition.POOR));
        when(componentRepository.findByDeviceAndIsActiveTrue(d)).thenReturn(comps);
        when(componentRepository.findByDevice(d)).thenReturn(comps);
        when(repairRecordRepository.countByDevice(d)).thenReturn(5L); // dRep=20
        // total=30+20+20=70, score=30 (D)
        HealthAssessment result=service.computeAndSave(d);
        assertThat(result.getScore()).isEqualTo((short)30);
        assertThat(result.getGrade()).isEqualTo('D');
    }
}