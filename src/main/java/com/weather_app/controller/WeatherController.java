package com.weather.controller;

import com.weather.dto.ForecastResponse;
import com.weather.dto.HistoryResponse;
import com.weather.dto.WeatherResponse;
import com.weather.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "*")
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentWeather(
            @RequestParam double lat,
            @RequestParam double lon) {
        try {
            WeatherResponse weather = weatherService.getCurrentWeather(lat, lon);
            return ResponseEntity.ok(weather);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch current weather");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/forecast")
    public ResponseEntity<?> getWeekForecast(
            @RequestParam double lat,
            @RequestParam double lon) {
        try {
            ForecastResponse forecast = weatherService.getWeekForecast(lat, lon);
            return ResponseEntity.ok(forecast);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch forecast");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/yesterday")
    public ResponseEntity<?> getYesterdayWeather(
            @RequestParam double lat,
            @RequestParam double lon) {
        try {
            HistoryResponse history = weatherService.getYesterdayWeather(lat, lon);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch yesterday weather");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/hourly")
    public ResponseEntity<?> getHourlyForecast(
            @RequestParam double lat,
            @RequestParam double lon) {
        try {
            List<Map<String, Object>> hourly = weatherService.getHourlyForecast(lat, lon);
            return ResponseEntity.ok(hourly);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch hourly forecast");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Weather API");
        return ResponseEntity.ok(response);
    }
}
