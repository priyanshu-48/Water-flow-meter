package com.harsha.waterflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.harsha.waterflow.entity.FlowMeasurement;

public interface FlowMeasurementRepository extends JpaRepository<FlowMeasurement, Long> {}
