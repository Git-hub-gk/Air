const API_KEY = 'YOUR_API_KEY_HERE';

function fetchAQIData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data || !data.list || !data.list[0]) {
                throw new Error("Unexpected API response format.");
            }
            const aqi = data.list[0].main.aqi;
            displayAQI(aqi);
            displayPollutants(data.list[0].components);
        })
        .catch(error => {
            console.error("Error fetching AQI data:", error);
            document.getElementById("aqi-value").innerText = "Unable to retrieve data.";
            document.getElementById("aqi-description").innerText = "Please check your API key and network connection.";
        });
}

// Function to get the user's current location
function getLocationAndFetchAQI() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchAQIData(lat, lon);
            },
            (error) => {
                console.error("Error getting location:", error);
                document.getElementById("aqi-value").innerText = "Location permission required";
                document.getElementById("aqi-description").innerText = "Enable location to view AQI data.";
            }
        );
    } else {
        document.getElementById("aqi-value").innerText = "Geolocation not supported";
    }
}

// Display AQI Value with color and description based on AQI level
function displayAQI(aqi) {
    const aqiDisplay = document.getElementById("aqi-value");
    const description = document.getElementById("aqi-description");

    aqiDisplay.innerText = aqi;

    // Color-coding based on AQI value ranges
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

// Display pollutant details
function displayPollutants(components) {
    const pollutantsList = document.getElementById("pollutants-list");
    pollutantsList.innerHTML = "";

    for (const [pollutant, value] of Object.entries(components)) {
        const li = document.createElement("li");
        li.innerText = `${pollutant.toUpperCase()}: ${value.toFixed(2)} µg/m³`;
        pollutantsList.appendChild(li);
    }
}

// Initialize t
