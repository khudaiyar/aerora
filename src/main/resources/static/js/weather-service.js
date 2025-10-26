// Weather Service - API Communication
class WeatherService {
    constructor() {
        this.baseURL = 'https://aerora.onrender.com/api';
    }


    async getCurrentWeather(lat, lon) {
        try {
            const response = await fetch(`${this.baseURL}/weather/current?lat=${lat}&lon=${lon}`);
            if (!response.ok) throw new Error('Failed to fetch current weather');
            return await response.json();
        } catch (error) {
            console.error('Error fetching current weather:', error);
            throw error;
        }
    }

    async getYesterdayWeather(lat, lon) {
        try {
            const response = await fetch(`${this.baseURL}/weather/yesterday?lat=${lat}&lon=${lon}`);
            if (!response.ok) throw new Error('Failed to fetch yesterday weather');
            return await response.json();
        } catch (error) {
            console.error('Error fetching yesterday weather:', error);
            throw error;
        }
    }

    async getHourlyForecast(lat, lon) {
        try {
            const response = await fetch(`${this.baseURL}/weather/hourly?lat=${lat}&lon=${lon}`);
            if (!response.ok) throw new Error('Failed to fetch hourly forecast');
            return await response.json();
        } catch (error) {
            console.error('Error fetching hourly forecast:', error);
            throw error;
        }
    }

    async getWeekForecast(lat, lon) {
        try {
            const response = await fetch(`${this.baseURL}/weather/forecast?lat=${lat}&lon=${lon}`);
            if (!response.ok) throw new Error('Failed to fetch week forecast');
            return await response.json();
        } catch (error) {
            console.error('Error fetching week forecast:', error);
            throw error;
        }
    }

    async searchLocation(query) {
        try {
            const response = await fetch(`${this.baseURL}/location/search?query=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Failed to search location');
            return await response.json();
        } catch (error) {
            console.error('Error searching location:', error);
            throw error;
        }
    }

    async reverseGeocode(lat, lon) {
        try {
            const response = await fetch(`${this.baseURL}/location/reverse?lat=${lat}&lon=${lon}`);
            if (!response.ok) throw new Error('Failed to reverse geocode');
            return await response.json();
        } catch (error) {
            console.error('Error reverse geocoding:', error);
            throw error;
        }
    }

    getWeatherIcon(iconCode) {
        const iconMap = {
            '01d': '☀️',
            '01n': '🌙',
            '02d': '⛅',
            '02n': '☁️',
            '03d': '☁️',
            '03n': '☁️',
            '04d': '☁️',
            '04n': '☁️',
            '09d': '🌧️',
            '09n': '🌧️',
            '10d': '🌦️',
            '10n': '🌧️',
            '11d': '⛈️',
            '11n': '⛈️',
            '13d': '❄️',
            '13n': '❄️',
            '50d': '🌫️',
            '50n': '🌫️'
        };
        return iconMap[iconCode] || '🌡️';
    }

    getWeatherIconURL(iconCode) {
        return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    }
}

const weatherService = new WeatherService();
