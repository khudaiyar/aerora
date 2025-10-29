Aerora - Real-Time Global Weather
https://aerora.onrender.com


<img width="2306" height="1221" alt="Aerora" src="https://github.com/user-attachments/assets/7637783f-d758-4de4-80b1-30cdaaf1ff1a" />


---

What is Aerora?

Aerora is a real-time weather application that brings the world's weather to your fingertips. Search any city, anywhere, and instantly see current conditions with beautiful animated effects. No accounts, no logins—just pure weather information when you need it.

---

Why "Aerora"?

The name comes from combining "Aero" (Greek for air/atmosphere) and "Aurora" (the beautiful natural light phenomenon). I wanted something that felt atmospheric and dynamic, just like weather itself. Plus, it sounds cool and futuristic, which fits the tech-forward design I was going for.

---

The Story Behind This Project

I built Aerora because I was tired of cluttered weather apps that force you to create accounts, track your data, and show ads everywhere. I wanted something clean, fast, and genuinely useful—just search a city and see the weather. That’s it.

The challenge was making it visually interesting without being overwhelming. Instead of just showing numbers and icons, I added canvas-based animations for each weather condition. Rain actually falls, snow drifts down, the sun rotates—it's weather that feels alive.

Another part that makes Aerora special is that it also shows the places I’ve visited. You can explore my travels in real time while seeing the current weather in each city. It’s not just a forecast—it’s a living map of my journey.

What I Learned

This project pushed me into some new territory:

- Spring Boot & RESTful APIs - Built the entire backend from scratch
- OpenWeatherMap API Integration - Learned to work with external APIs, handle rate limits, and cache responses
- Canvas Animations - Created 8 different weather animations using pure JavaScript canvas
- Timezone Calculations - Figured out how to convert UTC offsets to local times for any city
- Responsive Design - Made sure everything looks good on mobile, tablet, and desktop
- Maven & Dependency Management - Set up the full Java stack properly

The hardest part? The canvas animations. Getting rain to fall at different speeds, making snow drift realistically, and creating a sun that changes color based on temperature took way more time than I expected. But it was worth it—the animations make the app feel alive.

---

Features

8 Default Cities from Around the World
See weather in New York, London, Tokyo, Paris, Sydney, Dubai, Moscow, and Singapore—all with different timezones and current conditions.

 Instant Search
Type any city name and get instant results. No need to save or manage a list—just search and see.

 Accurate Local Times
Each city shows its actual local time, not yours. Tokyo at night looks different than New York at noon.

 Live Weather Animations
Every city card has animated weather effects:
- ☀️ Sun with rotating rays (color changes with temperature)
- 🌙 Glowing moon with twinkling stars
- 🌧️ Falling raindrops
- ❄️ Drifting snowflakes
- ⛈️ Heavy rain with lightning flashes
- ☁️ Floating clouds
- 🌫️ Drifting fog layers

📊 Detailed Forecasts
Click any city to see:
- Current conditions & feels-like temperature
- Humidity, wind speed, pressure, UV index
- Hourly forecast (next 24 hours)
- 7-day forecast

 Use Your Location
Click the location button to see weather at your current position.

---

Tech Stack

Backend
- Spring Boot 3.2.0 - REST API framework
- Java 17 - Programming language
- Maven - Build & dependency management
- H2 Database - In-memory database for caching
- Caffeine Cache - Response caching (10-minute TTL)

Frontend
- Vanilla JavaScript - No frameworks, pure performance
- Canvas API - Custom weather animations
- HTML5 & CSS3 - Modern, responsive design
- Fetch API - Backend communication

 External Services
- OpenWeatherMap API - Weather data provider
- Geocoding API - Location search

---

How It Works

1. Backend calls OpenWeatherMap API when you search a city
2. Caches the response for 10 minutes to reduce API calls
3. Frontend receives JSON data with weather details
4. Calculates local time using timezone offset
5. Renders animated card with appropriate weather animation
6. Canvas animates based on conditions (rain, snow, sun, etc.)


Future Plans

- Add weather alerts & notifications
- Historical weather data charts
- Weather comparison between cities
- PWA support for offline access
- Dark/light theme toggle

---
 Why No Accounts?

I intentionally kept Aerora account-free. Weather is public information—everyone should access it without barriers. No signups, no tracking, no data collection. Just weather.

---

<img width="2232" height="1265" alt="Aerora s" src="https://github.com/user-attachments/assets/b6f203c7-9898-4c2e-9bc9-7c58fbf2e7a2" />


---

Acknowledgments

- OpenWeatherMap for the weather data API
- Pexelsfor free stock videos
- Google Fonts for Orbitron & Poppins fonts

---



Contact

Built by Hudayyar Yusubov

- GitHub: https://github.com/khudaiyar

---

Aerora - Weather that feels alive 
