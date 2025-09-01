/*package com.harsha.waterflow.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.harsha.waterflow.entity.FlowMeasurement;
import com.harsha.waterflow.repository.FlowMeasurementRepository;

@RestController
@RequestMapping("/flow")
public class FlowMeasurementController {

    private final FlowMeasurementRepository repository;

    public FlowMeasurementController(FlowMeasurementRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public FlowMeasurement create(@RequestBody FlowMeasurement measurement) {
        return repository.save(measurement);
    }

    @GetMapping
    public List<FlowMeasurement> getAll() {
        return repository.findAll();
    }
}
*/
package com.harsha.waterflow.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.harsha.waterflow.entity.FlowMeasurement;
import com.harsha.waterflow.repository.FlowMeasurementRepository;

@RestController
@RequestMapping("/flow")
public class FlowMeasurementController {

    private final FlowMeasurementRepository repository;

    public FlowMeasurementController(FlowMeasurementRepository repository) {
        this.repository = repository;
    }

    // Endpoint to create a new flow measurement
    // POST http://localhost:8081/flow
    @PostMapping
    public FlowMeasurement create(@RequestBody FlowMeasurement measurement) {
        return repository.save(measurement);
    }

    // Endpoint to get all flow measurements
    // GET http://localhost:8081/flow
    @GetMapping
    public List<FlowMeasurement> getAll() {
        return repository.findAll();
    }

    // Endpoint to get a single flow measurement by ID
    // GET http://localhost:8081/flow/{id}
    @GetMapping("/{id}")
    public Optional<FlowMeasurement> getById(@PathVariable Long id) {
        return repository.findById(id);
    }

    // Endpoint to update an existing flow measurement
    // PUT http://localhost:8081/flow/{id}
    @PutMapping("/{id}")
    public FlowMeasurement update(@PathVariable Long id, @RequestBody FlowMeasurement updatedMeasurement) {
        return repository.findById(id)
            .map(measurement -> {
                // Update the existing entity with new data
                measurement.setFlowRate(updatedMeasurement.getFlowRate());
                measurement.setTimestamp(updatedMeasurement.getTimestamp());
                return repository.save(measurement);
            })
            .orElseGet(() -> {
                // If the entity doesn't exist, create it with the provided ID
                updatedMeasurement.setId(id);
                return repository.save(updatedMeasurement);
            });
    }

    // Endpoint to delete a flow measurement by ID
    // DELETE http://localhost:8081/flow/{id}
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}