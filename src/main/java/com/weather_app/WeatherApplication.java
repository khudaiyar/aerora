package com.weather;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableCaching
@EnableScheduling
public class WeatherApplication {

    public static void main(String[] args) {
        SpringApplication.run(WeatherApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("🌦️  Weather App Started Successfully!");
        System.out.println("========================================");
        System.out.println("📍 Application: http://localhost:8080");
        System.out.println("🗄️  H2 Console: http://localhost:8080/h2-console");
        System.out.println("🔌 API Health: http://localhost:8080/api/weather/health");
        System.out.println("========================================\n");
    }
}
