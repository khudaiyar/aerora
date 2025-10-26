package com.weather.repository;

import com.weather.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {

    /**
     * Find location by name and country
     */
    Optional<Location> findByNameAndCountry(String name, String country);

    /**
     * Find all locations by country
     */
    List<Location> findByCountry(String country);

    /**
     * Search locations by name (case-insensitive)
     */
    @Query("SELECT l FROM Location l WHERE LOWER(l.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Location> searchByName(@Param("name") String name);

    /**
     * Search locations by name or country
     */
    @Query("SELECT l FROM Location l WHERE LOWER(l.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(l.country) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Location> searchByNameOrCountry(@Param("query") String query);

    /**
     * Find locations within a coordinate range (bounding box)
     */
    @Query("SELECT l FROM Location l WHERE l.lat BETWEEN :latMin AND :latMax " +
            "AND l.lon BETWEEN :lonMin AND :lonMax")
    List<Location> findByCoordinateRange(
            @Param("latMin") Double latMin,
            @Param("latMax") Double latMax,
            @Param("lonMin") Double lonMin,
            @Param("lonMax") Double lonMax
    );

    /**
     * Find location by exact coordinates
     */
    @Query("SELECT l FROM Location l WHERE l.lat = :lat AND l.lon = :lon")
    Optional<Location> findByCoordinates(@Param("lat") Double lat, @Param("lon") Double lon);

    /**
     * Find all locations ordered by name
     */
    List<Location> findAllByOrderByNameAsc();

    /**
     * Count locations by country
     */
    @Query("SELECT COUNT(l) FROM Location l WHERE l.country = :country")
    Long countByCountry(@Param("country") String country);

    /**
     * Find recent locations (by lastUpdated)
     */
    @Query("SELECT l FROM Location l ORDER BY l.lastUpdated DESC")
    List<Location> findRecentLocations();
}
