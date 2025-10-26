package com.weather.repository;

import com.weather.model.Weather;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WeatherRepository extends JpaRepository<Weather, Long> {

    /**
     * Find most recent weather data for a location within time threshold
     */
    @Query("SELECT w FROM Weather w WHERE w.latitude = :lat AND w.longitude = :lon " +
            "AND w.timestamp > :after ORDER BY w.timestamp DESC")
    Optional<Weather> findRecentWeather(
            @Param("lat") Double latitude,
            @Param("lon") Double longitude,
            @Param("after") LocalDateTime after
    );

    /**
     * Find all weather records for a location
     */
    @Query("SELECT w FROM Weather w WHERE w.latitude = :lat AND w.longitude = :lon " +
            "ORDER BY w.timestamp DESC")
    List<Weather> findByLocation(
            @Param("lat") Double latitude,
            @Param("lon") Double longitude
    );

    /**
     * Find weather data within a time range
     */
    @Query("SELECT w FROM Weather w WHERE w.timestamp BETWEEN :start AND :end " +
            "ORDER BY w.timestamp DESC")
    List<Weather> findByTimestampBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    /**
     * Find weather by location and time range
     */
    @Query("SELECT w FROM Weather w WHERE w.latitude = :lat AND w.longitude = :lon " +
            "AND w.timestamp BETWEEN :start AND :end ORDER BY w.timestamp DESC")
    List<Weather> findByLocationAndTimestamp(
            @Param("lat") Double latitude,
            @Param("lon") Double longitude,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    /**
     * Find weather by main condition
     */
    List<Weather> findByMainCondition(String mainCondition);

    /**
     * Find weather records with temperature in range
     */
    @Query("SELECT w FROM Weather w WHERE w.temperature BETWEEN :minTemp AND :maxTemp " +
            "ORDER BY w.timestamp DESC")
    List<Weather> findByTemperatureRange(
            @Param("minTemp") Double minTemp,
            @Param("maxTemp") Double maxTemp
    );

    /**
     * Find latest weather record
     */
    @Query("SELECT w FROM Weather w ORDER BY w.timestamp DESC LIMIT 1")
    Optional<Weather> findLatest();

    /**
     * Find weather records by humidity range
     */
    @Query("SELECT w FROM Weather w WHERE w.humidity BETWEEN :minHumidity AND :maxHumidity")
    List<Weather> findByHumidityRange(
            @Param("minHumidity") Integer minHumidity,
            @Param("maxHumidity") Integer maxHumidity
    );

    /**
     * Count weather records for a location
     */
    @Query("SELECT COUNT(w) FROM Weather w WHERE w.latitude = :lat AND w.longitude = :lon")
    Long countByLocation(@Param("lat") Double latitude, @Param("lon") Double longitude);

    /**
     * Delete old weather records (cleanup)
     */
    @Query("DELETE FROM Weather w WHERE w.timestamp < :before")
    void deleteOldRecords(@Param("before") LocalDateTime before);

    /**
     * Find average temperature for a location in time range
     */
    @Query("SELECT AVG(w.temperature) FROM Weather w WHERE w.latitude = :lat " +
            "AND w.longitude = :lon AND w.timestamp BETWEEN :start AND :end")
    Double findAverageTemperature(
            @Param("lat") Double latitude,
            @Param("lon") Double longitude,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}