// API key for OpenWeather Air Pollution API
const API_KEY = '3e92fe35e0aaa7695af1cd7c2de8d4a97a0a5ffa8c5b50442575ba9d2cf3a03d4b192a3763a6a59dfef1f14121a94c11';

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

    // Fetch real air quality data using the API
    fetchAirQualityData(latitude, longitude);
}

// Function to fetch and display air quality data
function fetchAirQualityData(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const airQualityIndex = data.list[0].main.aqi; // AQI value on a scale from 1 to 5 (1: Good, 5: Hazardous)

            // Map AQI to descriptive text
            const aqiDescriptions = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
            const description = aqiDescriptions[airQualityIndex - 1];

            document.getElementById("air-quality").innerText = `Air Quality Index (AQI): ${airQualityIndex} (${description})`;
        })
        .catch(error => {
            document.getElementById("air-quality").innerText = "Failed to fetch air quality data.";
            console.error("Error fetching air quality data:", error);
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
