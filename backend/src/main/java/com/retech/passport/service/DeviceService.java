package com.retech.passport.service;
import com.google.zxing.*;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.retech.passport.dto.*;
import com.retech.passport.exception.*;
import com.retech.passport.model.*;
import com.retech.passport.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.nio.file.*;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.*;
@Service @RequiredArgsConstructor @Slf4j
public class DeviceService {
    private final DeviceRepository deviceRepository;
    private final ComponentRepository componentRepository;
    private final RepairRecordRepository repairRecordRepository;
    private final HealthAssessmentRepository healthAssessmentRepository;
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    private final HealthScoreService healthScoreService;
    private final NotificationService notificationService;
    @Value("${retech.base-url}") private String retechBaseUrl;
    @Value("${retech.storage.qr-dir}") private String qrDir;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final AtomicInteger SEQUENCE = new AtomicInteger((int)(Math.random()*900000)+100000);
    @Transactional
    public DeviceDto registerDevice(DeviceRequest req, User owner) {
        if(deviceRepository.existsBySerialImei(req.getSerialImei())) throw new ConflictException("Device with serial/IMEI already registered: "+req.getSerialImei());
        String passportId = generatePassportId();
        String qrToken = generateQrToken();
        Device device = Device.builder().passportId(passportId).owner(owner).deviceType(req.getDeviceType())
                .brand(req.getBrand()).model(req.getModel()).serialImei(req.getSerialImei())
                .purchaseDate(req.getPurchaseDate()).osName(req.getOsName()).ramGb(req.getRamGb())
                .storageGb(req.getStorageGb()).processor(req.getProcessor())
                .status(req.getStatus()!=null?req.getStatus():DeviceStatus.REGISTERED).qrToken(qrToken)
                .previousOwnersCount(req.getPreviousOwnersCount()!=null?req.getPreviousOwnersCount():0)
                .knownDamages(req.getKnownDamages()).damageNotes(req.getDamageNotes())
                .priorHistory(req.getPriorHistory()).build();
        device = deviceRepository.save(device);
        String qrPath = generateQrPng(qrToken, device.getDeviceId());
        device.setQrImagePath(qrPath);
        device = deviceRepository.save(device);
        auditLogRepository.save(AuditLog.builder().entity("DEVICE").entityId(device.getDeviceId()).changeSummary("Device registered: "+passportId).changedBy(owner).build());
        healthScoreService.computeAndSave(device);
        return buildDeviceDto(device);
    }
    public DeviceDto getDevice(Long deviceId, User requestor) {
        Device device = deviceRepository.findById(deviceId).orElseThrow(()->new NotFoundException("Device not found: "+deviceId));
        checkAccess(device,requestor);
        return buildDeviceDto(device);
    }
    @Transactional
    public DeviceDto updateDevice(Long deviceId, DeviceRequest req, User requestor) {
        Device device = deviceRepository.findById(deviceId).orElseThrow(()->new NotFoundException("Device not found: "+deviceId));
        checkOwnerOrAdmin(device,requestor);
        if(device.getStatus()==DeviceStatus.RECYCLED) throw new ForbiddenException("RECYCLED devices are read-only");
        if(req.getBrand()!=null) device.setBrand(req.getBrand());
        if(req.getModel()!=null) device.setModel(req.getModel());
        if(req.getOsName()!=null) device.setOsName(req.getOsName());
        if(req.getRamGb()!=null) device.setRamGb(req.getRamGb());
        if(req.getStorageGb()!=null) device.setStorageGb(req.getStorageGb());
        if(req.getProcessor()!=null) device.setProcessor(req.getProcessor());
        if(req.getStatus()!=null) device.setStatus(req.getStatus());
        device = deviceRepository.save(device);
        auditLogRepository.save(AuditLog.builder().entity("DEVICE").entityId(deviceId).changeSummary("Device updated").changedBy(requestor).build());
        healthScoreService.computeAndSave(device);
        return buildDeviceDto(device);
    }
    @Transactional
    public DeviceDto transferDevice(Long deviceId, TransferRequest req, User requestor) {
        Device device = deviceRepository.findById(deviceId).orElseThrow(()->new NotFoundException("Device not found: "+deviceId));
        if(!device.getOwner().getUserId().equals(requestor.getUserId())&&requestor.getRole()!=UserRole.ADMIN) throw new ForbiddenException("Only device owner can transfer");
        User newOwner = userRepository.findByEmail(req.getRecipientEmail().toLowerCase()).orElseThrow(()->new NotFoundException("Recipient user not found: "+req.getRecipientEmail()));
        User oldOwner = device.getOwner();
        device.setOwner(newOwner);
        String newQrToken = generateQrToken();
        device.setQrToken(newQrToken);
        String qrPath = generateQrPng(newQrToken, device.getDeviceId());
        device.setQrImagePath(qrPath);
        device = deviceRepository.save(device);
        auditLogRepository.save(AuditLog.builder().entity("DEVICE").entityId(deviceId).changeSummary("Device transferred from "+oldOwner.getEmail()+" to "+newOwner.getEmail()).changedBy(requestor).build());
        notificationService.sendTransferNotification(oldOwner,newOwner,device);
        return buildDeviceDto(device);
    }
    public PublicPassportDto getPublicPassport(String token) {
        Device device = deviceRepository.findByQrToken(token).orElseThrow(()->new NotFoundException("Invalid or revoked QR token"));
        HealthAssessment assessment = healthAssessmentRepository.findTopByDeviceOrderByGeneratedAtDesc(device).orElse(null);
        return PublicPassportDto.builder().passportId(device.getPassportId()).deviceType(device.getDeviceType())
                .brand(device.getBrand()).model(device.getModel()).grade(assessment!=null?assessment.getGrade():null)
                .recommendation(assessment!=null?assessment.getRecommendation():null).status(device.getStatus()).build();
    }
    public List<DeviceDto> getUserDevices(User user) {
        return deviceRepository.findByOwner(user).stream().map(this::buildDeviceDto).collect(Collectors.toList());
    }
    public byte[] getQrImage(Long deviceId, User requestor) {
        Device device = deviceRepository.findById(deviceId).orElseThrow(()->new NotFoundException("Device not found: "+deviceId));
        checkAccess(device,requestor);
        if(device.getQrImagePath()==null) throw new NotFoundException("QR image not found");
        try { return Files.readAllBytes(Paths.get(device.getQrImagePath())); }
        catch(Exception e) { throw new RuntimeException("Failed to read QR image",e); }
    }
    private DeviceDto buildDeviceDto(Device device) {
        List<Component> allComponents = componentRepository.findByDevice(device);
        List<RepairRecord> repairs = repairRecordRepository.findByDeviceOrderByRepairDateDesc(device);
        HealthAssessment assessment = healthAssessmentRepository.findTopByDeviceOrderByGeneratedAtDesc(device).orElse(null);
        DeviceDto dto = DeviceDto.from(device);
        dto.setComponents(allComponents.stream().map(ComponentDto::from).collect(Collectors.toList()));
        dto.setRepairs(repairs.stream().map(r->{
            RepairDto rd=RepairDto.from(r);
            if(r.getAmendments()!=null) rd.setAmendments(r.getAmendments().stream().map(AmendmentDto::from).collect(Collectors.toList()));
            return rd;
        }).collect(Collectors.toList()));
        dto.setHealth(HealthDto.from(assessment));
        return dto;
    }
    private void checkAccess(Device device, User requestor) {
        if(requestor.getRole()==UserRole.ADMIN||requestor.getRole()==UserRole.VIEWER) return;
        if(requestor.getRole()==UserRole.OWNER&&!device.getOwner().getUserId().equals(requestor.getUserId())) throw new ForbiddenException("Access denied");
    }
    private void checkOwnerOrAdmin(Device device, User requestor) {
        if(requestor.getRole()==UserRole.ADMIN) return;
        if(!device.getOwner().getUserId().equals(requestor.getUserId())) throw new ForbiddenException("Access denied: only owner or admin can modify this device");
    }
    private String generatePassportId() {
        int year=LocalDate.now().getYear(); int seq=SEQUENCE.incrementAndGet()%1000000;
        return String.format("RTP-%d-%06d",year,seq);
    }
    private String generateQrToken() {
        byte[] bytes=new byte[48]; SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes).substring(0,64);
    }
    private String generateQrPng(String qrToken, Long deviceId) {
        try {
            String qrContent=retechBaseUrl+"/p/"+qrToken;
            Path dir=Paths.get(qrDir); Files.createDirectories(dir);
            String filename="qr_"+deviceId+"_"+System.currentTimeMillis()+".png";
            Path filePath=dir.resolve(filename);
            Map<EncodeHintType,Object> hints=new EnumMap<>(EncodeHintType.class);
            hints.put(EncodeHintType.ERROR_CORRECTION,ErrorCorrectionLevel.M);
            hints.put(EncodeHintType.MARGIN,2);
            BitMatrix matrix=new MultiFormatWriter().encode(qrContent,BarcodeFormat.QR_CODE,400,400,hints);
            MatrixToImageWriter.writeToPath(matrix,"PNG",filePath);
            return filePath.toString();
        } catch(Exception e){ log.warn("Failed to generate QR PNG: {}",e.getMessage()); return null; }
    }
}