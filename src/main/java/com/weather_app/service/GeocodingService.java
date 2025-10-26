package com.weather.service;

import com.weather.model.Location;
import com.weather.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class GeocodingService {

    @Value("${weather.api.key}")
    private String apiKey;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private LocationRepository locationRepository;

    @Cacheable(value = "location", key = "#query")
    public List<Location> searchLocation(String query) {
        try {
            String url = String.format("https://api.openweathermap.org/geo/1.0/direct?q=%s&limit=5&appid=%s",
                    query, apiKey);

            List<Map<String, Object>> response = restTemplate.getForObject(url, List.class);
            List<Location> locations = new ArrayList<>();

            if (response != null && !response.isEmpty()) {
                for (Map<String, Object> item : response) {
                    Location location = new Location();
                    location.setName((String) item.get("name"));
                    location.setCountry((String) item.get("country"));
                    location.setState(item.get("state") != null ? (String) item.get("state") : null);

                    // Handle lat/lon
                    Object latObj = item.get("lat");
                    Object lonObj = item.get("lon");

                    location.setLat(latObj instanceof Number ? ((Number) latObj).doubleValue() : 0.0);
                    location.setLon(lonObj instanceof Number ? ((Number) lonObj).doubleValue() : 0.0);

                    locations.add(location);

                    // Save to database
                    saveLocationToDb(location);
                }
            }

            return locations;
        } catch (Exception e) {
            System.err.println("Error searching location: " + e.getMessage());
            return locationRepository.searchByName(query);
        }
    }

    @Cacheable(value = "location", key = "#lat + '-' + #lon")
    public Location reverseGeocode(double lat, double lon) {
        try {
            String url = String.format("https://api.openweathermap.org/geo/1.0/reverse?lat=%f&lon=%f&limit=1&appid=%s",
                    lat, lon, apiKey);

            List<Map<String, Object>> response = restTemplate.getForObject(url, List.class);

            if (response != null && !response.isEmpty()) {
                Map<String, Object> data = response.get(0);

                Location location = new Location();
                location.setName((String) data.get("name"));
                location.setCountry((String) data.get("country"));
                location.setState(data.get("state") != null ? (String) data.get("state") : null);
                location.setLat(lat);
                location.setLon(lon);

                saveLocationToDb(location);

                return location;
            }

            return null;
        } catch (Exception e) {
            System.err.println("Error reverse geocoding: " + e.getMessage());
            return null;
        }
    }

    private void saveLocationToDb(Location location) {
        try {
            Optional<Location> existing = locationRepository.findByNameAndCountry(
                    location.getName(), location.getCountry());

            if (existing.isEmpty()) {
                locationRepository.save(location);
            }
        } catch (Exception e) {
            System.err.println("Error saving location to database: " + e.getMessage());
        }
    }
}
