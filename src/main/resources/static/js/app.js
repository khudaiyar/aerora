// Multi-City Weather Dashboard with Timezone Support
class WeatherApp {
    constructor() {
        this.cities = [];
        this.currentCity = null;
        this.cityWeatherData = new Map();
        this.defaultCities = [
            { name: "Mary", country: "Turkmenistan", lat: 37.6, lon: 61.83 },
            { name: "Ashgabat", country: "Turkmenistan", lat: 37.95, lon: 58.38 },
            { name: "Minsk", country: "Belarus", lat: 53.9, lon: 27.5667 },
            { name: "Vitebsk", country: "Belarus", lat: 55.19, lon: 30.2 },
            { name: "Saint Petersburg", country: "Russia", lat: 59.9343, lon: 30.3351 },
            { name: "Moscow", country: "Russia", lat: 55.7558, lon: 37.6173 },
            { name: "Kursk", country: "Russia", lat: 51.73, lon: 36.19 },
            { name: "Oryol", country: "Russia", lat: 52.97, lon: 36.07 },
            { name: "Belgorod", country: "Russia", lat: 50.6, lon: 36.6 },
            { name: "Wuhan", country: "China", lat: 30.5928, lon: 114.3055 },
            { name: "Beijing", country: "China", lat: 39.9042, lon: 116.4074 },
            { name: "Xi'an", country: "China", lat: 34.3416, lon: 108.9398 },
            { name: "Qingdao", country: "China", lat: 36.0662, lon: 120.3826 },
            { name: "Chengdu", country: "China", lat: 30.5728, lon: 104.0668 },
            { name: "Changchun", country: "China", lat: 43.88, lon: 125.32 },
            { name: "Harbin", country: "China", lat: 45.75, lon: 126.65 },
            { name: "Shenyang", country: "China", lat: 41.8, lon: 123.4 },
            { name: "Dalian", country: "China", lat: 38.92, lon: 121.64 },
            { name: "Hangzhou", country: "China", lat: 30.2741, lon: 120.1551 },
            { name: "Tallinn", country: "Estonia", lat: 59.437, lon: 24.7536 }
        ];
        this.init();
    }

    init() {
        this.loadCitiesFromStorage();
        this.setupEventListeners();
        this.renderCities();
    }

    setupEventListeners() {
        document.getElementById('searchBtn').addEventListener('click', () => this.performSearch());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });
        document.getElementById('searchInput').addEventListener('input', utils.debounce((e) => {
            const query = e.target.value.trim();
            if (query.length >= 3) this.showSearchSuggestions(query);
            else this.hideSearchSuggestions();
        }, 300));
        document.getElementById('locationBtn').addEventListener('click', () => this.getUserLocation());
        document.getElementById('addCityBtn').addEventListener('click', () => {
            document.getElementById('searchInput').focus();
        });
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('cityDetailModal').addEventListener('click', (e) => {
            if (e.target.id === 'cityDetailModal') this.closeModal();
        });
        document.addEventListener('click', (e) => {
            const searchSection = document.querySelector('.search-section');
            if (!searchSection.contains(e.target)) this.hideSearchSuggestions();
        });

        // EVENT DELEGATION: Listen on parent container
        const citiesGrid = document.getElementById('citiesGrid');
        citiesGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.city-card');
            if (!card) return;

            // Close search dropdown when clicking a city card
            this.hideSearchSuggestions();

            const lat = parseFloat(card.dataset.lat);
            const lon = parseFloat(card.dataset.lon);

            if (!isNaN(lat) && !isNaN(lon)) {
                const city = this.cities.find(c => c.lat === lat && c.lon === lon);
                const weather = this.cityWeatherData.get(`${lat},${lon}`);

                if (city && weather) {
                    console.log('Card clicked:', city.name);
                    this.showCityDetails(city, weather);
                }
            }
        });
    }

    loadCitiesFromStorage() {
        const stored = localStorage.getItem('weatherCities');
        if (!stored) {
            console.log("🌍 Loading default 20 cities for first-time visitors");
            this.cities = [...this.defaultCities];
            this.saveCitiesToStorage();
        } else {
            this.cities = JSON.parse(stored);
        }
    }

    saveCitiesToStorage() {
        localStorage.setItem('weatherCities', JSON.stringify(this.cities));
    }

    async getUserLocation() {
        if (!utils.supportsGeolocation()) {
            utils.showError('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const location = await weatherService.reverseGeocode(latitude, longitude);
                    if (location) this.addCity(location.lat, location.lon, location.name, location.country);
                } catch (error) {
                    console.error('Error getting location:', error);
                }
            },
            () => utils.showError('Unable to retrieve your location')
        );
    }

    async performSearch() {
        const query = document.getElementById('searchInput').value.trim();
        if (!query) return;

        try {
            const locations = await weatherService.searchLocation(query);
            if (locations?.length > 0) {
                const location = locations[0];
                this.addCity(location.lat, location.lon, location.name, location.country);
                this.hideSearchSuggestions();
                document.getElementById('searchInput').value = '';
            } else utils.showError('Location not found');
        } catch (error) {
            utils.showError('Error searching for location');
        }
    }

    async showSearchSuggestions(query) {
        try {
            const locations = await weatherService.searchLocation(query);
            const resultsContainer = document.getElementById('searchResults');

            if (locations?.length > 0) {
                resultsContainer.innerHTML = locations.map(loc => `
                    <div class="search-result-item" data-lat="${loc.lat}" data-lon="${loc.lon}"
                         data-name="${loc.name}" data-country="${loc.country}">
                        <div class="result-name">${loc.name}</div>
                        <div class="result-country">${loc.state ? loc.state + ', ' : ''}${loc.country}</div>
                    </div>`).join('');

                resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const lat = parseFloat(item.dataset.lat);
                        const lon = parseFloat(item.dataset.lon);
                        const name = item.dataset.name;
                        const country = item.dataset.country;
                        this.addCity(lat, lon, name, country);
                        this.hideSearchSuggestions();
                        document.getElementById('searchInput').value = '';
                    });
                });

                resultsContainer.classList.add('active');
            } else this.hideSearchSuggestions();
        } catch (error) {
            console.error('Error fetching search suggestions:', error);
        }
    }

    hideSearchSuggestions() {
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.classList.remove('active');
        resultsContainer.innerHTML = '';
    }

    addCity(lat, lon, name, country) {
        const exists = this.cities.find(c => c.lat === lat && c.lon === lon);
        if (exists) {
            utils.showError('City already added!');
            return;
        }
        this.cities.push({ lat, lon, name, country });
        this.saveCitiesToStorage();
        this.renderCities();
    }

    removeCity(lat, lon) {
        this.cities = this.cities.filter(c => !(c.lat === lat && c.lon === lon));
        this.saveCitiesToStorage();
        this.renderCities();
        this.closeModal();
    }

    async renderCities() {
        const container = document.getElementById('citiesGrid');
        const emptyState = document.getElementById('emptyState');
        const cityCount = document.getElementById('cityCount');
        cityCount.textContent = this.cities.length;

        if (this.cities.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        container.innerHTML = '';
        for (const city of this.cities) {
            const card = await this.createCityCard(city);
            container.appendChild(card);
        }
    }

    async createCityCard(city) {
        const card = document.createElement('div');
        card.className = 'city-card';
        card.innerHTML = `<div class="city-card-loading"><div class="spinner"></div></div>`;

        try {
            const weather = await weatherService.getCurrentWeather(city.lat, city.lon);

            // Store weather data
            this.cityWeatherData.set(`${city.lat},${city.lon}`, weather);

            const timezoneOffset = weather.timezoneOffset || weather.timezone || 0;
            const localTime = utils.getCurrentTimeInTimezone(timezoneOffset);
            const isDaytime = utils.isDaytimeInTimezone(timezoneOffset, weather.sunrise, weather.sunset);
            const bgClass = this.getCardBackgroundClass(weather.mainCondition, isDaytime);

            card.className = `city-card ${bgClass}`;
            // CRITICAL: Add data attributes for event delegation
            card.dataset.lat = city.lat;
            card.dataset.lon = city.lon;
            card.style.cursor = 'pointer';

            card.innerHTML = `
                <div class="city-card-header">
                    <div class="city-info">
                        <h3>${city.name}</h3>
                        <p>${city.country}</p>
                        <p class="city-local-time">${localTime}</p>
                    </div>
                    <div class="city-temp">${utils.formatTemp(weather.temperature)}°</div>
                </div>
                <div class="city-weather">
                    <img class="city-icon" src="${weatherService.getWeatherIconURL(weather.icon)}">
                    <div class="city-desc">
                        <p>${utils.capitalize(weather.description)}</p>
                        <p>Feels like ${utils.formatTemp(weather.feelsLike)}°C</p>
                    </div>
                </div>
                <div class="city-time-indicator ${isDaytime ? 'daytime' : 'nighttime'}">
                    ${isDaytime ? '☀️ Day' : '🌙 Night'}
                </div>
            `;
        } catch (error) {
            card.innerHTML = `<p style="color: var(--text-light); text-align: center;">⚠️ Unable to load ${city.name}</p>`;
        }
        return card;
    }

    getCardBackgroundClass(condition, isDaytime) {
        const c = condition.toLowerCase();
        if (c.includes('clear')) return isDaytime ? 'card-bg-clear-day' : 'card-bg-clear-night';
        if (c.includes('cloud')) return isDaytime ? 'card-bg-cloudy-day' : 'card-bg-cloudy-night';
        if (c.includes('rain') || c.includes('drizzle')) return 'card-bg-rainy';
        if (c.includes('snow')) return 'card-bg-snowy';
        if (c.includes('thunder')) return 'card-bg-stormy';
        if (c.includes('mist') || c.includes('fog') || c.includes('haze')) return 'card-bg-misty';
        return 'card-bg-default';
    }

    async showCityDetails(city, weather) {
        this.currentCity = city;
        const modal = document.getElementById('cityDetailModal');
        const modalLoader = document.getElementById('modalLoader');
        const modalBody = document.getElementById('modalBody');

        // Hide search section when modal opens
        document.querySelector('.search-section').style.display = 'none';

        // Show modal and loader
        modal.classList.add('active');
        modalLoader.style.display = 'flex';
        modalBody.style.display = 'none';

        try {
            // Populate basic weather info (always available from card data)
            const timezoneOffset = weather.timezoneOffset || weather.timezone || 0;
            document.getElementById('modalCityName').textContent = `${city.name}, ${city.country}`;
            document.getElementById('modalLocalTime').textContent = utils.getCurrentTimeInTimezone(timezoneOffset);
            document.getElementById('modalDateTime').textContent = utils.getCurrentDateInTimezone(timezoneOffset);
            document.getElementById('modalWeatherIcon').src = weatherService.getWeatherIconURL(weather.icon);
            document.getElementById('modalTemperature').textContent = utils.formatTemp(weather.temperature);
            document.getElementById('modalDescription').textContent = utils.capitalize(weather.description);
            document.getElementById('modalFeelsLike').textContent = utils.formatTemp(weather.feelsLike);
            document.getElementById('modalHumidity').textContent = utils.formatHumidity(weather.humidity);
            document.getElementById('modalWindSpeed').textContent = utils.formatWindSpeed(weather.windSpeed);
            document.getElementById('modalPressure').textContent = utils.formatPressure(weather.pressure);
            document.getElementById('modalUV').textContent = weather.uvIndex || 'N/A';

            // Setup remove button
            const removeBtn = document.getElementById('removeCityBtn');
            removeBtn.onclick = () => this.removeCity(city.lat, city.lon);

            // Show content immediately with basic data
            modalLoader.style.display = 'none';
            modalBody.style.display = 'block';

            // Try to fetch hourly and forecast data in background
            try {
                const hourly = await weatherService.getHourlyForecast(city.lat, city.lon);
                const hourlyContainer = document.getElementById('modalHourly');

                if (hourly && hourly.length > 0) {
                    hourlyContainer.innerHTML = hourly.slice(0, 24).map(h => {
                        // Check if h.dt exists, otherwise use h.time or current timestamp
                        const timestamp = h.dt || h.time || Math.floor(Date.now() / 1000);
                        const hourText = utils.getHourFromTimestamp(timestamp);
                        const icon = h.icon || h.weather?.[0]?.icon || '01d';
                        const temp = h.temperature || h.temp || 0;
                        const desc = h.description || h.weather?.[0]?.description || '';

                        return `
                            <div class="hourly-item">
                                <div class="hourly-time">${hourText}</div>
                                <img class="hourly-icon" src="${weatherService.getWeatherIconURL(icon)}" alt="${desc}">
                                <div class="hourly-temp">${utils.formatTemp(temp)}°</div>
                            </div>
                        `;
                    }).join('');
                } else {
                    hourlyContainer.innerHTML = '<p style="color: var(--text-light); padding: 20px;">Hourly forecast not available</p>';
                }
            } catch (err) {
                console.log('Hourly forecast unavailable:', err.message);
                document.getElementById('modalHourly').innerHTML = '<p style="color: var(--text-light); padding: 20px;">Hourly forecast not available</p>';
            }

            try {
                const forecast = await weatherService.getWeekForecast(city.lat, city.lon);
                const forecastContainer = document.getElementById('modalForecast');

                if (forecast && forecast.length > 0) {
                    forecastContainer.innerHTML = forecast.map(day => `
                        <div class="forecast-day">
                            <div>
                                <div class="day-name-date">${utils.getDayName(day.date)}</div>
                                <div class="day-date">${utils.getShortDate(day.date)}</div>
                            </div>
                            <div class="day-info">
                                <img class="day-icon" src="${weatherService.getWeatherIconURL(day.icon)}" alt="${day.description}">
                                <div class="day-desc">${utils.capitalize(day.description)}</div>
                            </div>
                            <div class="day-temps">
                                <span class="temp-max">${utils.formatTemp(day.tempMax)}°</span>
                                <span class="temp-min">${utils.formatTemp(day.tempMin)}°</span>
                            </div>
                        </div>
                    `).join('');
                } else {
                    forecastContainer.innerHTML = '<p style="color: var(--text-light); padding: 20px;">7-day forecast not available</p>';
                }
            } catch (err) {
                console.log('7-day forecast unavailable:', err.message);
                document.getElementById('modalForecast').innerHTML = '<p style="color: var(--text-light); padding: 20px;">7-day forecast not available</p>';
            }

        } catch (error) {
            console.error('Error loading city details:', error);
            utils.showError('Failed to load city details');
            this.closeModal();
        }
    }

    closeModal() {
        document.getElementById('cityDetailModal').classList.remove('active');
        this.currentCity = null;

        // Show search section again when modal closes
        document.querySelector('.search-section').style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => new WeatherApp());

const subtitle = document.querySelector('.app-subtitle');
const text = "Where I've been, and what the skies have seen.";
let index = 0;
let typingForward = true;

function typeWriter() {
    if (typingForward) {
        subtitle.textContent = text.substring(0, index);
        index++;
        if (index <= text.length) {
            setTimeout(typeWriter, 100);
        } else {
            setTimeout(() => {
                typingForward = false;
                typeWriter();
            }, 10000);
        }
    } else {
        subtitle.textContent = text.substring(0, index);
        index--;
        if (index >= 0) {
            setTimeout(typeWriter, 50);
        } else {
            typingForward = true;
            setTimeout(typeWriter, 500);
        }
    }
}

typeWriter();