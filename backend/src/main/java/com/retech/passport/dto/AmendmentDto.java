package com.retech.passport.dto;
import com.retech.passport.model.RepairAmendment;
import lombok.*;
import java.time.LocalDateTime;
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AmendmentDto {
    private Long id; private Long authorId; private String authorName; private String note; private LocalDateTime createdAt;
    public static AmendmentDto from(RepairAmendment a) {
        return AmendmentDto.builder().id(a.getAmendmentId())
                .authorId(a.getAuthor()!=null?a.getAuthor().getUserId():null)
                .authorName(a.getAuthor()!=null?a.getAuthor().getName():null)
                .note(a.getNote()).createdAt(a.getCreatedAt()).build(); }
}