package com.retech.passport.dto;
import com.retech.passport.model.RepairRecord;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class RepairDto {
    private Long id; private Long technicianId; private String technicianName;
    private LocalDate repairDate; private String issue; private String actionTaken;
    private BigDecimal cost; private Boolean verified; private String notes;
    private LocalDateTime createdAt; private List<AmendmentDto> amendments;
    public static RepairDto from(RepairRecord r) {
        return RepairDto.builder().id(r.getRepairId())
                .technicianId(r.getTechnician()!=null?r.getTechnician().getUserId():null)
                .technicianName(r.getTechnician()!=null?r.getTechnician().getName():null)
                .repairDate(r.getRepairDate()).issue(r.getIssue()).actionTaken(r.getActionTaken())
                .cost(r.getCost()).verified(r.getVerified()).notes(r.getNotes()).createdAt(r.getCreatedAt()).build(); }
}