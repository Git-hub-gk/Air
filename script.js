const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with actual API key

// Fetch location and initialize app
function fetchLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById("location").innerText = "Geolocation not supported.";
    }
}

// Display user location and fetch data
function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    document.getElementById("location").innerText = `Latitude: ${latitude.toFixed(2)}, Longitude: ${longitude.toFixed(2)}`;

    fetchAirQualityData(latitude, longitude);
}

// Fetch air quality data
function fetchAirQualityData(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const aqi = data.list[0].main.aqi;
            displayAirQuality(aqi);
            provideImprovementSuggestions(aqi);
        })
        .catch(() => {
            document.getElementById("air-quality").innerText = "Unable to retrieve data.";
        });
}

// Display air quality index and description
function displayAirQuality(aqi) {
    const aqiDescriptions = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
    document.getElementById("air-quality").innerText = `AQI: ${aqi} - ${aqiDescriptions[aqi - 1]}`;
}

// Provide improvement suggestions based on AQI level
function provideImprovementSuggestions(aqi) {
    const suggestions = [
        "Enjoy outdoor activities as usual.",
        "Limit outdoor activities if sensitive.",
        "Avoid prolonged outdoor activities.",
        "Stay indoors; avoid outdoor exercise.",
        "Stay indoors; use air purifiers if possible."
    ];
    document.getElementById("suggestions").innerText = suggestions[aqi - 1];
}

// Show error if location fails
function showError(error) {
    document.getElementById("location").innerText = "Unable to retrieve location.";
}

// Initialize location fetching on load
window.onload = fetchLocation;
