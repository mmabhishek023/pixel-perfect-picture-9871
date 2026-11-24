package com.retech.passport.repository;
import com.retech.passport.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface ImageUploadRepository extends JpaRepository<ImageUpload, Long> {
    List<ImageUpload> findByDevice(Device device);
}