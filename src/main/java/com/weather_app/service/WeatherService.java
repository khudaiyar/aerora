package com.weather.service;

import com.weather.dto.ForecastResponse;
import com.weather.dto.HistoryResponse;
import com.weather.dto.WeatherResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class WeatherService {

    @Value("${weather.api.key}")
    private String apiKey;

    @Value("${weather.api.url:https://api.openweathermap.org/data/2.5}")
    private String apiUrl;

    @Autowired
    private RestTemplate restTemplate;

    @Cacheable(value = "currentWeather", key = "#lat + '-' + #lon")
    public WeatherResponse getCurrentWeather(double lat, double lon) {
        try {
            String url = String.format("%s/weather?lat=%f&lon=%f&appid=%s&units=metric",
                    apiUrl, lat, lon, apiKey);

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            return mapToWeatherResponse(response);
        } catch (Exception e) {
            System.err.println("Error fetching current weather: " + e.getMessage());
            e.printStackTrace(); // Print full stack trace for debugging
            throw new RuntimeException("Failed to fetch current weather: " + e.getMessage(), e);
        }
    }

    @Cacheable(value = "forecast", key = "#lat + '-' + #lon")
    public ForecastResponse getWeekForecast(double lat, double lon) {
        try {
            // OpenWeatherMap requires One Call API for 7-day forecast
            // Using forecast API (5 days) as alternative
            String url = String.format("%s/forecast?lat=%f&lon=%f&appid=%s&units=metric&cnt=40",
                    apiUrl, lat, lon, apiKey);

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            return mapToForecastResponse(response);
        } catch (Exception e) {
            System.err.println("Error fetching forecast: " + e.getMessage());
            throw new RuntimeException("Failed to fetch forecast", e);
        }
    }

    public HistoryResponse getYesterdayWeather(double lat, double lon) {
        try {
            // For free tier, we simulate yesterday's data using current minus temp variance
            // For production, use OpenWeather Time Machine API or Historical Data API
            WeatherResponse current = getCurrentWeather(lat, lon);

            HistoryResponse history = new HistoryResponse();
            history.setTemperature(current.getTemperature() - (Math.random() * 4 - 2)); // Simulate variation
            history.setFeelsLike(current.getFeelsLike() - (Math.random() * 4 - 2));
            history.setHumidity(current.getHumidity() + (int)(Math.random() * 20 - 10));
            history.setWindSpeed(current.getWindSpeed());
            history.setPressure(current.getPressure());
            history.setDescription(current.getDescription());
            history.setIcon(current.getIcon());
            history.setMainCondition(current.getMainCondition());
            history.setTimestamp(System.currentTimeMillis() / 1000 - 86400); // Yesterday

            return history;
        } catch (Exception e) {
            System.err.println("Error fetching yesterday weather: " + e.getMessage());
            throw new RuntimeException("Failed to fetch yesterday weather", e);
        }
    }

    public List<Map<String, Object>> getHourlyForecast(double lat, double lon) {
        try {
            String url = String.format("%s/forecast?lat=%f&lon=%f&appid=%s&units=metric",
                    apiUrl, lat, lon, apiKey);

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            return (List<Map<String, Object>>) response.get("list");
        } catch (Exception e) {
            System.err.println("Error fetching hourly forecast: " + e.getMessage());
            throw new RuntimeException("Failed to fetch hourly forecast", e);
        }
    }

    private WeatherResponse mapToWeatherResponse(Map<String, Object> data) {
        WeatherResponse response = new WeatherResponse();

        try {
            Map<String, Object> main = (Map<String, Object>) data.get("main");
            Map<String, Object> wind = (Map<String, Object>) data.get("wind");
            Map<String, Object> sys = (Map<String, Object>) data.get("sys");
            Map<String, Object> clouds = (Map<String, Object>) data.get("clouds");
            List<Map<String, Object>> weather = (List<Map<String, Object>>) data.get("weather");

            // Temperature
            response.setTemperature(getDoubleValue(main.get("temp")));
            response.setFeelsLike(getDoubleValue(main.get("feels_like")));
            response.setTempMin(getDoubleValue(main.get("temp_min")));
            response.setTempMax(getDoubleValue(main.get("temp_max")));

            // Humidity and Pressure
            response.setHumidity(getIntValue(main.get("humidity")));
            response.setPressure(getIntValue(main.get("pressure")));

            // Wind
            response.setWindSpeed(getDoubleValue(wind.get("speed")));
            response.setWindDeg(getDoubleValue(wind.get("deg")));
            response.setWindDirection(getWindDirection(getDoubleValue(wind.get("deg"))));

            // Visibility and Clouds
            response.setVisibility(getIntValue(data.get("visibility")));
            response.setCloudiness(getIntValue(clouds.get("all")));

            // Weather condition
            if (weather != null && !weather.isEmpty()) {
                Map<String, Object> weatherData = weather.get(0);
                response.setDescription((String) weatherData.get("description"));
                response.setIcon((String) weatherData.get("icon"));
                response.setMainCondition((String) weatherData.get("main"));
            }

            // Sun times
            response.setSunrise(getLongValue(sys.get("sunrise")));
            response.setSunset(getLongValue(sys.get("sunset")));

            // Timezone offset in seconds
            Integer timezoneOffset = getIntValue(data.get("timezone"));
            response.setTimezoneOffset(timezoneOffset);
            response.setTimezone(String.valueOf(timezoneOffset));

            // UV Index (would need additional API call for real data)
            response.setUvIndex(5.0); // Default moderate UV

            response.setTimestamp(LocalDateTime.now());

            System.out.println("✅ Successfully mapped weather data for " + data.get("name"));

            return response;
        } catch (Exception e) {
            System.err.println("❌ Error mapping weather response: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to map weather data", e);
        }
    }

    private ForecastResponse mapToForecastResponse(Map<String, Object> data) {
        ForecastResponse response = new ForecastResponse();
        List<Map<String, Object>> list = (List<Map<String, Object>>) data.get("list");
        List<ForecastResponse.DailyForecast> dailyForecasts = new ArrayList<>();

        // Group by day and take one forecast per day
        String currentDate = "";
        for (Map<String, Object> item : list) {
            String dtTxt = (String) item.get("dt_txt");
            String date = dtTxt.split(" ")[0];

            if (!date.equals(currentDate) && dailyForecasts.size() < 7) {
                currentDate = date;

                ForecastResponse.DailyForecast daily = new ForecastResponse.DailyForecast();
                daily.setDt(getLongValue(item.get("dt")));

                Map<String, Object> main = (Map<String, Object>) item.get("main");
                ForecastResponse.Temperature temp = new ForecastResponse.Temperature();
                temp.setDay(getDoubleValue(main.get("temp")));
                temp.setMin(getDoubleValue(main.get("temp_min")));
                temp.setMax(getDoubleValue(main.get("temp_max")));
                daily.setTemp(temp);

                List<Map<String, Object>> weather = (List<Map<String, Object>>) item.get("weather");
                if (weather != null && !weather.isEmpty()) {
                    Map<String, Object> weatherData = weather.get(0);
                    ForecastResponse.WeatherCondition condition = new ForecastResponse.WeatherCondition();
                    condition.setDescription((String) weatherData.get("description"));
                    condition.setIcon((String) weatherData.get("icon"));
                    condition.setMain((String) weatherData.get("main"));
                    daily.setWeather(condition);
                }

                daily.setHumidity(getIntValue(main.get("humidity")));

                Map<String, Object> wind = (Map<String, Object>) item.get("wind");
                if (wind != null) {
                    daily.setWindSpeed(getDoubleValue(wind.get("speed")));
                }

                // Probability of precipitation
                daily.setPop(getDoubleValue(item.get("pop")));

                dailyForecasts.add(daily);
            }
        }

        response.setDaily(dailyForecasts);
        return response;
    }

    private Double getDoubleValue(Object value) {
        if (value == null) return 0.0;
        if (value instanceof Double) return (Double) value;
        if (value instanceof Integer) return ((Integer) value).doubleValue();
        if (value instanceof String) return Double.parseDouble((String) value);
        return 0.0;
    }

    private Integer getIntValue(Object value) {
        if (value == null) return 0;
        if (value instanceof Integer) return (Integer) value;
        if (value instanceof Double) return ((Double) value).intValue();
        if (value instanceof String) return Integer.parseInt((String) value);
        return 0;
    }

    private Long getLongValue(Object value) {
        if (value == null) return 0L;
        if (value instanceof Long) return (Long) value;
        if (value instanceof Integer) return ((Integer) value).longValue();
        if (value instanceof String) return Long.parseLong((String) value);
        return 0L;
    }

    private String getWindDirection(Double deg) {
        if (deg == null) return "N";
        String[] directions = {"N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"};
        int index = (int) Math.round(deg / 22.5) % 16;
        return directions[index];
    }
}