package com.retech.passport.repository;
import com.retech.passport.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByEntityAndEntityIdOrderByChangedAtDesc(String entity, Long entityId);
}