package com.weather.controller;

import com.weather.model.Location;
import com.weather.service.GeocodingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/location")
@CrossOrigin(origins = "*")
public class LocationController {

    @Autowired
    private GeocodingService geocodingService;

    @GetMapping("/search")
    public ResponseEntity<?> searchLocation(@RequestParam String query) {
        try {
            if (query == null || query.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Query parameter is required");
                return ResponseEntity.badRequest().body(error);
            }

            List<Location> locations = geocodingService.searchLocation(query);
            return ResponseEntity.ok(locations);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to search location");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/reverse")
    public ResponseEntity<?> reverseGeocode(
            @RequestParam double lat,
            @RequestParam double lon) {
        try {
            Location location = geocodingService.reverseGeocode(lat, lon);
            if (location == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Location not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
            return ResponseEntity.ok(location);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to reverse geocode");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/coordinates")
    public ResponseEntity<?> getCoordinates(@RequestParam String city) {
        try {
            List<Location> locations = geocodingService.searchLocation(city);
            if (locations.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "City not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
            return ResponseEntity.ok(locations.get(0));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to get coordinates");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
