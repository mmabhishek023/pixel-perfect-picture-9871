package com.retech.passport.repository;
import com.retech.passport.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.*;
public interface RepairRecordRepository extends JpaRepository<RepairRecord, Long> {
    List<RepairRecord> findByDeviceOrderByRepairDateDesc(Device device);
    long countByDevice(Device device);
    @Query("SELECT r FROM RepairRecord r LEFT JOIN FETCH r.amendments WHERE r.device = :device ORDER BY r.repairDate DESC")
    List<RepairRecord> findByDeviceWithAmendments(Device device);
}