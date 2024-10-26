const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key

// Function to get the user's location
function fetchLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById("location").innerText = "Geolocation is not supported by this browser.";
    }
}

// Display user's location and fetch air quality data
function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    document.getElementById("location").innerText = `Location: Latitude ${latitude.toFixed(2)}, Longitude ${longitude.toFixed(2)}`;

    fetchAirQualityData(latitude, longitude);
    fetchWeatherData(latitude, longitude);
}

// Fetch and display air quality data
function fetchAirQualityData(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const airQualityIndex = data.list[0].main.aqi; // AQI on a scale from 1 to 5
            const aqiDescriptions = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
            const description = aqiDescriptions[airQualityIndex - 1];

            document.getElementById("air-quality").innerText = `Air Quality Index (AQI): ${airQualityIndex} (${description})`;
            provideHealthAdvice(airQualityIndex);
            updateAQIChart(airQualityIndex);
            document.getElementById("last-updated").innerText = `Last updated: ${new Date().toLocaleTimeString()}`;
        })
        .catch(error => {
            document.getElementById("air-quality").innerText = "Failed to fetch air quality data.";
            console.error("Error fetching air quality data:", error);
        });
}

// Fetch and display current weather data
function fetchWeatherData(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const temperature = data.main.temp;
            const humidity = data.main.humidity;
            const weatherDescription = data.weather[0].description;

            document.getElementById("weather").innerText = `Weather: ${weatherDescription}, ${temperature}°C, Humidity: ${humidity}%`;
        })
        .catch(error => {
            document.getElementById("weather").innerText = "Failed to fetch weather data.";
            console.error("Error fetching weather data:", error);
        });
}

// Provide health advice based on AQI
function provideHealthAdvice(aqi) {
    let advice = "";
    if (aqi === 1) {
        advice = "Air quality is good. Enjoy outdoor activities!";
    } else if (aqi === 2) {
        advice = "Air quality is fair. Consider limiting prolonged outdoor activities.";
    } else if (aqi === 3) {
        advice = "Moderate air quality. Sensitive groups should limit outdoor activities.";
    } else if (aqi === 4) {
        advice = "Poor air quality. Avoid outdoor activities if possible.";
    } else if (aqi === 5) {
        advice = "Very poor air quality. Stay indoors and use air purifiers if available.";
    }
    document.getElementById("advice").innerText = advice;
}

// Update AQI chart with dummy historical data
function updateAQIChart(currentAQI) {
    const ctx = document.getElementById('aqi-chart').getContext('2d');
    const historyData = [50, 100, 150, 200, currentAQI]; // Placeholder data for past hours

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["4 hrs ago", "3 hrs ago", "2 hrs ago", "1 hr ago", "Now"],
            datasets: [{
                label: 'AQI History',
                data: historyData,
                borderColor: 'rgb(75, 192, 192)',
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: 300
                }
            }
        }
    });
}

// Show error if location access is denied or fails
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById("location").innerText = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById("location").innerText = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.getElementById("location").innerText = "The request to get user location timed out.";
            break;
        default:
            document.getElementById("location").innerText = "An unknown error occurred.";
            break;
    }
}

// Initialize fetching location on load
window.onload = fetchLocation;
