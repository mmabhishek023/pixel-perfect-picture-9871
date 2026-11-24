package com.retech.passport.repository;
import com.retech.passport.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface DeviceRepository extends JpaRepository<Device, Long> {
    List<Device> findByOwner(User owner);
    Optional<Device> findByPassportId(String passportId);
    Optional<Device> findByQrToken(String qrToken);
    Optional<Device> findBySerialImei(String serialImei);
    boolean existsBySerialImei(String serialImei);
}