package com.retech.passport.repository;
import com.retech.passport.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface HealthAssessmentRepository extends JpaRepository<HealthAssessment, Long> {
    Optional<HealthAssessment> findTopByDeviceOrderByGeneratedAtDesc(Device device);
    List<HealthAssessment> findByDevice(Device device);
}