// Utility Functions - COMPLETE VERSION
const utils = {
    // Format temperature
    formatTemp(temp) {
        return Math.round(temp);
    },

    // Format wind speed
    formatWindSpeed(speed) {
        return `${Math.round(speed)} m/s`;
    },

    // Format pressure
    formatPressure(pressure) {
        return `${pressure} hPa`;
    },

    // Format humidity
    formatHumidity(humidity) {
        return `${humidity}%`;
    },

    // Format visibility
    formatVisibility(visibility) {
        return `${(visibility / 1000).toFixed(1)} km`;
    },

    // Get current time in specific timezone
    getCurrentTimeInTimezone(timezoneOffset) {
        // timezoneOffset is in seconds from UTC
        const now = new Date();
        const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
        const cityTime = new Date(utcTime + (timezoneOffset * 1000));

        return cityTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    },

    // Get current date in specific timezone
    getCurrentDateInTimezone(timezoneOffset) {
        const now = new Date();
        const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
        const cityTime = new Date(utcTime + (timezoneOffset * 1000));

        return cityTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Get hour in timezone (0-23)
    getHourInTimezone(timezoneOffset) {
        const now = new Date();
        const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
        const cityTime = new Date(utcTime + (timezoneOffset * 1000));
        return cityTime.getHours();
    },

    // Check if it's daytime in specific timezone
    isDaytimeInTimezone(timezoneOffset, sunrise, sunset) {
        if (!sunrise || !sunset) {
            // Fallback to hour-based logic
            const hour = this.getHourInTimezone(timezoneOffset);
            return hour >= 6 && hour < 20;
        }

        const now = Date.now() / 1000; // Current time in seconds
        return now >= sunrise && now < sunset;
    },

    // Get current time (local)
    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    },

    // Get current date (local)
    getCurrentDate() {
        const now = new Date();
        return now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Get day name
    getDayName(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', { weekday: 'long' });
        }
    },

    // Get short date
    getShortDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    },

    // Get hour from timestamp
    getHourFromTimestamp(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true
        });
    },

    // Get time of day
    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 8) return 'morning';
        if (hour >= 8 && hour < 17) return 'day';
        if (hour >= 17 && hour < 20) return 'evening';
        return 'night';
    },

    // Capitalize first letter
    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    // Get UV Index level
    getUVLevel(uv) {
        if (uv <= 2) return { level: 'Low', color: '#4CAF50' };
        if (uv <= 5) return { level: 'Moderate', color: '#FFEB3B' };
        if (uv <= 7) return { level: 'High', color: '#FF9800' };
        if (uv <= 10) return { level: 'Very High', color: '#F44336' };
        return { level: 'Extreme', color: '#9C27B0' };
    },

    // Get wind direction
    getWindDirection(deg) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(deg / 22.5) % 16;
        return directions[index];
    },

    // Show loading
    showLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'flex';
        }
    },

    // Hide loading
    hideLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
        }
    },

    // Show element
    showElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'block';
        }
    },

    // Hide element
    hideElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
        }
    },

    // Show error
    showError(message) {
        alert(message);
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Get rain probability text
    getRainProbability(pop) {
        const percent = Math.round(pop * 100);
        if (percent === 0) return '';
        return `💧 ${percent}% chance of rain`;
    },

    // Format rain amount
    formatRain(amount) {
        if (!amount || amount === 0) return '';
        return `${amount.toFixed(1)} mm`;
    },

    // Format snow amount
    formatSnow(amount) {
        if (!amount || amount === 0) return '';
        return `${amount.toFixed(1)} mm`;
    },

    // Update clock in real-time
    startClock() {
        const updateClock = () => {
            const timeElement = document.getElementById('currentTime');
            const dateElement = document.getElementById('currentDate');

            if (timeElement) {
                timeElement.textContent = this.getCurrentTime();
            }
            if (dateElement) {
                dateElement.textContent = this.getCurrentDate();
            }
        };

        updateClock();
        setInterval(updateClock, 1000);
    },

    // Check if browser supports geolocation
    supportsGeolocation() {
        return 'geolocation' in navigator;
    }
};

console.log('✅ Utils loaded successfully with timezone functions');