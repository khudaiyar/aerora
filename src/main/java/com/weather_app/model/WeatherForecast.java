package com.weather.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "weather_forecast", indexes = {
        @Index(name = "idx_forecast_location", columnList = "latitude,longitude,date")
})
public class WeatherForecast {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private LocalDate date;

    private Double tempMin;
    private Double tempMax;
    private Double tempMorning;
    private Double tempDay;
    private Double tempEvening;
    private Double tempNight;
    private Double feelsLikeMorning;
    private Double feelsLikeDay;
    private Double feelsLikeEvening;
    private Double feelsLikeNight;

    @Column(length = 500)
    private String description;

    private String icon;
    private String mainCondition;
    private Integer humidity;
    private Double windSpeed;
    private Double windDeg;
    private Integer pressure;
    private Integer cloudiness;
    private Double pop; // Probability of precipitation (0-1)
    private Double rain; // Rain volume in mm
    private Double snow; // Snow volume in mm
    private Double uvIndex;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public WeatherForecast() {
        this.createdAt = LocalDateTime.now();
    }

    public WeatherForecast(Double latitude, Double longitude, LocalDate date) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.date = date;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Double getTempMin() {
        return tempMin;
    }

    public void setTempMin(Double tempMin) {
        this.tempMin = tempMin;
    }

    public Double getTempMax() {
        return tempMax;
    }

    public void setTempMax(Double tempMax) {
        this.tempMax = tempMax;
    }

    public Double getTempMorning() {
        return tempMorning;
    }

    public void setTempMorning(Double tempMorning) {
        this.tempMorning = tempMorning;
    }

    public Double getTempDay() {
        return tempDay;
    }

    public void setTempDay(Double tempDay) {
        this.tempDay = tempDay;
    }

    public Double getTempEvening() {
        return tempEvening;
    }

    public void setTempEvening(Double tempEvening) {
        this.tempEvening = tempEvening;
    }

    public Double getTempNight() {
        return tempNight;
    }

    public void setTempNight(Double tempNight) {
        this.tempNight = tempNight;
    }

    public Double getFeelsLikeMorning() {
        return feelsLikeMorning;
    }

    public void setFeelsLikeMorning(Double feelsLikeMorning) {
        this.feelsLikeMorning = feelsLikeMorning;
    }

    public Double getFeelsLikeDay() {
        return feelsLikeDay;
    }

    public void setFeelsLikeDay(Double feelsLikeDay) {
        this.feelsLikeDay = feelsLikeDay;
    }

    public Double getFeelsLikeEvening() {
        return feelsLikeEvening;
    }

    public void setFeelsLikeEvening(Double feelsLikeEvening) {
        this.feelsLikeEvening = feelsLikeEvening;
    }

    public Double getFeelsLikeNight() {
        return feelsLikeNight;
    }

    public void setFeelsLikeNight(Double feelsLikeNight) {
        this.feelsLikeNight = feelsLikeNight;
    }

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

    public String getMainCondition() {
        return mainCondition;
    }

    public void setMainCondition(String mainCondition) {
        this.mainCondition = mainCondition;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "WeatherForecast{" +
                "id=" + id +
                ", date=" + date +
                ", tempMin=" + tempMin +
                ", tempMax=" + tempMax +
                ", mainCondition='" + mainCondition + '\'' +
                '}';
    }
}
