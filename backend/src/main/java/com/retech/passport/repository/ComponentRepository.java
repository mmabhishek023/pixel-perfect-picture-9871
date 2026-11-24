package com.retech.passport.repository;
import com.retech.passport.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface ComponentRepository extends JpaRepository<Component, Long> {
    List<Component> findByDeviceAndIsActiveTrue(Device device);
    List<Component> findByDevice(Device device);
    Optional<Component> findByDeviceAndComponentTypeAndIsActiveTrue(Device device, ComponentType type);
}