package com.retech.passport.service;
import com.retech.passport.dto.*;
import com.retech.passport.exception.*;
import com.retech.passport.model.*;
import com.retech.passport.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.*;
@Service @RequiredArgsConstructor
public class RepairService {
    private final RepairRecordRepository repairRecordRepository;
    private final RepairAmendmentRepository repairAmendmentRepository;
    private final DeviceRepository deviceRepository;
    private final AuditLogRepository auditLogRepository;
    private final HealthScoreService healthScoreService;
    public List<RepairDto> getRepairs(Long deviceId, User requestor) {
        Device device = deviceRepository.findById(deviceId).orElseThrow(()->new NotFoundException("Device not found: "+deviceId));
        return repairRecordRepository.findByDeviceOrderByRepairDateDesc(device).stream().map(r->{
            RepairDto dto=RepairDto.from(r);
            if(r.getAmendments()!=null) dto.setAmendments(r.getAmendments().stream().map(AmendmentDto::from).collect(Collectors.toList()));
            return dto;
        }).collect(Collectors.toList());
    }
    @Transactional
    public RepairDto createRepair(Long deviceId, RepairRequest req, User requestor) {
        Device device = deviceRepository.findById(deviceId).orElseThrow(()->new NotFoundException("Device not found: "+deviceId));
        if(device.getStatus()==DeviceStatus.RECYCLED) throw new ForbiddenException("RECYCLED devices are read-only");
        boolean verified = requestor.getRole()==UserRole.TECHNICIAN && requestor.getStatus()==UserStatus.ACTIVE;
        RepairRecord repair = RepairRecord.builder().device(device).technician(requestor)
                .repairDate(req.getRepairDate()).issue(req.getIssue()).actionTaken(req.getActionTaken())
                .cost(req.getCost()).verified(verified).notes(req.getNotes()).build();
        repair = repairRecordRepository.save(repair);
        auditLogRepository.save(AuditLog.builder().entity("REPAIR").entityId(repair.getRepairId())
                .changeSummary("Repair logged: "+req.getIssue()).changedBy(requestor).build());
        healthScoreService.computeAndSave(device);
        return RepairDto.from(repair);
    }
    @Transactional
    public AmendmentDto addAmendment(Long repairId, AmendmentRequest req, User requestor) {
        RepairRecord repair = repairRecordRepository.findById(repairId).orElseThrow(()->new NotFoundException("Repair not found: "+repairId));
        RepairAmendment amendment = RepairAmendment.builder().repair(repair).author(requestor).note(req.getNote()).build();
        amendment = repairAmendmentRepository.save(amendment);
        auditLogRepository.save(AuditLog.builder().entity("REPAIR_AMENDMENT").entityId(amendment.getAmendmentId())
                .changeSummary("Amendment added to repair "+repairId).changedBy(requestor).build());
        return AmendmentDto.from(amendment);
    }
}