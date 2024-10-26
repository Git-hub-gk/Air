const API_KEY = 'YOUR_API_KEY_HERE';

// Fetch AQI data
function fetchAQIData() {
    const lat = 26.9124; // Jaipur latitude
    const lon = 75.7873; // Jaipur longitude
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const aqi = data.list[0].main.aqi;
            displayAQI(aqi);
            displayPollutants(data.list[0].components);
        })
        .catch(error => {
            console.error("Error fetching AQI data:", error);
            document.getElementById("aqi-value").innerText = "Data unavailable";
        });
}

// Display AQI Value
function displayAQI(aqi) {
    const aqiDisplay = document.getElementById("aqi-value");
    const description = document.getElementById("aqi-description");

    aqiDisplay.innerText = aqi;

    // Set AQI description and color based on range
    if (aqi === 1) {
        description.innerText = "Good (0-50)";
        aqiDisplay.style.color = "#00e400";
    } else if (aqi === 2) {
        description.innerText = "Fair (51-100)";
        aqiDisplay.style.color = "#ffff00";
    } else if (aqi === 3) {
        description.innerText = "Moderate (101-150)";
        aqiDisplay.style.color = "#ff7e00";
    } else if (aqi === 4) {
        description.innerText = "Poor (151-200)";
        aqiDisplay.style.color = "#ff0000";
    } else if (aqi === 5) {
        description.innerText = "Very Poor (201-300)";
        aqiDisplay.style.color = "#99004c";
    } else {
        description.innerText = "Severe (300+)";
        aqiDisplay.style.color = "#7e0023";
    }
}

// Display Pollutant Details
function displayPollutants(components) {
    const pollutantsList = document.getElementById("pollutants-list");
    pollutantsList.innerHTML = "";

    for (const [pollutant, value] of Object.entries(components)) {
        const li = document.createElement("li");
        li.innerText = `${pollutant.toUpperCase()}: ${value.toFixed(2)} µg/m³`;
        pollutantsList.appendChild(li);
    }
}

// Initialize the app on load
window.onload = fetchAQIData;
