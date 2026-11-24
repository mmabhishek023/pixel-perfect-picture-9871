package com.retech.passport.service;
import com.retech.passport.dto.*;
import com.retech.passport.exception.*;
import com.retech.passport.model.*;
import com.retech.passport.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
@Service @RequiredArgsConstructor
public class ComponentService {
    private final ComponentRepository componentRepository;
    private final DeviceRepository deviceRepository;
    private final AuditLogRepository auditLogRepository;
    private final HealthScoreService healthScoreService;
    @Transactional
    public ComponentDto addComponent(Long deviceId, ComponentRequest req, User requestor) {
        Device device = deviceRepository.findById(deviceId).orElseThrow(()->new NotFoundException("Device not found: "+deviceId));
        if(device.getStatus()==DeviceStatus.RECYCLED) throw new ForbiddenException("RECYCLED devices are read-only");
        Component comp = Component.builder().device(device).componentType(req.getComponentType())
                .brandModel(req.getBrandModel()).capacitySpec(req.getCapacitySpec())
                .installedOn(req.getInstalledOn()!=null?req.getInstalledOn():LocalDate.now())
                .condition(req.getCondition()).origin(req.getOrigin()!=null?req.getOrigin():ComponentOrigin.ORIGINAL)
                .batteryHealth(req.getBatteryHealth()).isActive(true).build();
        comp = componentRepository.save(comp);
        auditLogRepository.save(AuditLog.builder().entity("COMPONENT").entityId(comp.getComponentId())
                .changeSummary("Component added: "+req.getComponentType()).changedBy(requestor).build());
        healthScoreService.computeAndSave(device);
        return ComponentDto.from(comp);
    }
    @Transactional
    public ComponentDto updateComponent(Long componentId, ComponentRequest req, User requestor) {
        Component comp = componentRepository.findById(componentId).orElseThrow(()->new NotFoundException("Component not found: "+componentId));
        if(comp.getDevice().getStatus()==DeviceStatus.RECYCLED) throw new ForbiddenException("RECYCLED devices are read-only");
        if(req.getCondition()!=null) comp.setCondition(req.getCondition());
        if(req.getBatteryHealth()!=null) comp.setBatteryHealth(req.getBatteryHealth());
        if(req.getBrandModel()!=null) comp.setBrandModel(req.getBrandModel());
        comp = componentRepository.save(comp);
        healthScoreService.computeAndSave(comp.getDevice());
        return ComponentDto.from(comp);
    }
}