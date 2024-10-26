const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key

// Real-time clock
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById("clock").innerText = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);

// Get location and fetch data
function fetchLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById("location").innerText = "Geolocation is not supported by this browser.";
    }
}

// Display user location and fetch air quality and weather data
function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    document.getElementById("location").innerText = `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`;
    fadeIn("location-card");

    fetchAirQualityData(latitude, longitude);
    fetchWeatherData(latitude, longitude);
}

// Fetch air quality data
function fetchAirQualityData(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const airQualityIndex = data.list[0].main.aqi;
            const aqiDescriptions = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
            const description = aqiDescriptions[airQualityIndex - 1];
            document.getElementById("air-quality").innerText = `AQI: ${airQualityIndex} (${description})`;
            provideHealthAdvice(airQualityIndex);
            fadeIn("air-quality-card");
        })
        .catch(error => {
            document.getElementById("air-quality").innerText = "Failed to load data.";
        });
}

// Fetch weather data
function fetchWeatherData(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const temperature = data.main.temp;
            const weatherDescription = data.weather[0].description;
            document.getElementById("weather").innerText = `${temperature}°C, ${weatherDescription}`;
            fadeIn("weather-card");
        })
        .catch(error => {
            document.getElementById("weather").innerText = "Failed to load data.";
        });
}

// Provide health advice based on AQI
function provideHealthAdvice(aqi) {
    const adviceText = [
        "Enjoy outdoor activities.",
        "Limit prolonged outdoor activities.",
        "Sensitive groups limit outdoor activities.",
        "Avoid outdoor activities.",
        "Stay indoors with air purifiers."
    ];
    document.getElementById("advice").innerText = adviceText[aqi - 1];
  
