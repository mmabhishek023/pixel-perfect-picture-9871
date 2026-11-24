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
public class AdminService {
    private final UserRepository userRepository;
    private final DeviceRepository deviceRepository;
    private final RepairRecordRepository repairRecordRepository;
    private final HealthAssessmentRepository healthAssessmentRepository;
    private final AuditLogRepository auditLogRepository;
    private final NotificationService notificationService;
    public AdminStatsDto getStats() {
        long pendingTechnicians = userRepository.findAll().stream().filter(u->u.getRole()==UserRole.TECHNICIAN&&u.getStatus()==UserStatus.PENDING).count();
        List<HealthAssessment> assessments = healthAssessmentRepository.findAll();
        Map<String,Long> gradeDist = assessments.stream().collect(Collectors.groupingBy(a->String.valueOf(a.getGrade()),Collectors.counting()));
        Map<String,Long> recDist = assessments.stream().filter(a->a.getRecommendation()!=null).collect(Collectors.groupingBy(HealthAssessment::getRecommendation,Collectors.counting()));
        return AdminStatsDto.builder().totalUsers(userRepository.count()).totalDevices(deviceRepository.count())
                .totalRepairs(repairRecordRepository.count()).pendingTechnicians(pendingTechnicians)
                .gradeDistribution(gradeDist).recommendationDistribution(recDist).build();
    }
    public List<UserDto> getAllUsers() { return userRepository.findAll().stream().map(UserDto::from).collect(Collectors.toList()); }
    @Transactional
    public UserDto approveTechnician(Long technicianId, String action, User admin) {
        User technician = userRepository.findById(technicianId).orElseThrow(()->new NotFoundException("User not found: "+technicianId));
        if(technician.getRole()!=UserRole.TECHNICIAN) throw new ForbiddenException("User is not a technician");
        boolean approved = "approve".equalsIgnoreCase(action);
        technician.setStatus(approved?UserStatus.ACTIVE:UserStatus.BLOCKED);
        technician = userRepository.save(technician);
        auditLogRepository.save(AuditLog.builder().entity("USER").entityId(technicianId).changeSummary("Technician "+action+"d by admin").changedBy(admin).build());
        notificationService.sendTechnicianApprovalNotification(technician,approved);
        return UserDto.from(technician);
    }
}