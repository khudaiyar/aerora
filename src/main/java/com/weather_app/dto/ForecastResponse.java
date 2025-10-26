package com.weather.dto;

import java.time.LocalDate;
import java.util.List;

public class ForecastResponse {
    private List<DailyForecast> daily;

    public ForecastResponse() {}

    public ForecastResponse(List<DailyForecast> daily) {
        this.daily = daily;
    }

    public List<DailyForecast> getDaily() {
        return daily;
    }

    public void setDaily(List<DailyForecast> daily) {
        this.daily = daily;
    }

    @Override
    public String toString() {
        return "ForecastResponse{daily=" + (daily != null ? daily.size() : 0) + " days}";
    }

    // Inner class for Daily Forecast
    public static class DailyForecast {
        private Long dt;
        private LocalDate date;
        private Temperature temp;
        private WeatherCondition weather;
        private Integer humidity;
        private Double windSpeed;
        private Double windDeg;
        private Integer pressure;
        private Integer cloudiness;
        private Double pop; // Probability of precipitation (0-1)
        private Double rain; // Rain volume in mm
        private Double snow; // Snow volume in mm
        private Double uvIndex;

        public DailyForecast() {}

        // Getters and Setters
        public Long getDt() {
            return dt;
        }

        public void setDt(Long dt) {
            this.dt = dt;
        }

        public LocalDate getDate() {
            return date;
        }

        public void setDate(LocalDate date) {
            this.date = date;
        }

        public Temperature getTemp() {
            return temp;
        }

        public void setTemp(Temperature temp) {
            this.temp = temp;
        }

        public WeatherCondition getWeather() {
            return weather;
        }

        public void setWeather(WeatherCondition weather) {
            this.weather = weather;
        }

        public Integer getHumidity() {
            return humidity;
        }

        public void setHumidity(Integer humidity) {
            this.humidity = humidity;
        }

        public Double getWindSpeed() {
            return windSpeed;
        }

        public void setWindSpeed(Double windSpeed) {
            this.windSpeed = windSpeed;
        }

        public Double getWindDeg() {
            return windDeg;
        }

        public void setWindDeg(Double windDeg) {
            this.windDeg = windDeg;
        }

        public Integer getPressure() {
            return pressure;
        }

        public void setPressure(Integer pressure) {
            this.pressure = pressure;
        }

        public Integer getCloudiness() {
            return cloudiness;
        }

        public void setCloudiness(Integer cloudiness) {
            this.cloudiness = cloudiness;
        }

        public Double getPop() {
            return pop;
        }

        public void setPop(Double pop) {
            this.pop = pop;
        }

        public Double getRain() {
            return rain;
        }

        public void setRain(Double rain) {
            this.rain = rain;
        }

        public Double getSnow() {
            return snow;
        }

        public void setSnow(Double snow) {
            this.snow = snow;
        }

        public Double getUvIndex() {
            return uvIndex;
        }

        public void setUvIndex(Double uvIndex) {
            this.uvIndex = uvIndex;
        }

        @Override
        public String toString() {
            return "DailyForecast{date=" + date + ", temp=" + temp + "}";
        }
    }

    // Inner class for Temperature
    public static class Temperature {
        private Double min;
        private Double max;
        private Double morning;
        private Double day;
        private Double evening;
        private Double night;

        public Temperature() {}

        public Temperature(Double min, Double max) {
            this.min = min;
            this.max = max;
        }

        // Getters and Setters
        public Double getMin() {
            return min;
        }

        public void setMin(Double min) {
            this.min = min;
        }

        public Double getMax() {
            return max;
        }

        public void setMax(Double max) {
            this.max = max;
        }

        public Double getMorning() {
            return morning;
        }

        public void setMorning(Double morning) {
            this.morning = morning;
        }

        public Double getDay() {
            return day;
        }

        public void setDay(Double day) {
            this.day = day;
        }

        public Double getEvening() {
            return evening;
        }

        public void setEvening(Double evening) {
            this.evening = evening;
        }

        public Double getNight() {
            return night;
        }

        public void setNight(Double night) {
            this.night = night;
        }

        @Override
        public String toString() {
            return "Temperature{min=" + min + ", max=" + max + "}";
        }
    }

    // Inner class for Weather Condition
    public static class WeatherCondition {
        private String description;
        private String icon;
        private String main;

        public WeatherCondition() {}

        public WeatherCondition(String description, String icon, String main) {
            this.description = description;
            this.icon = icon;
            this.main = main;
        }

        // Getters and Setters
        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getIcon() {
            return icon;
        }

        public void setIcon(String icon) {
            this.icon = icon;
        }

        public String getMain() {
            return main;
        }

        public void setMain(String main) {
            this.main = main;
        }

        @Override
        public String toString() {
            return "WeatherCondition{main=" + main + ", description=" + description + "}";
        }
    }
}