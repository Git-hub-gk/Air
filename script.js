const API_KEY = '3e92fe35e0aaa7695af1cd7c2de8d4a97a0a5ffa8c5b50442575ba9d2cf3a03d4b192a3763a6a59dfef1f14121a94c11';


function fetchAQIData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log("Fetched data:", data);  // Debugging line to ensure data is received
            const aqi = data.list[0].main.aqi;
            displayAQI(aqi);
            displayPollutants(data.list[0].components);
        })
        .catch(error => {
            document.getElementById("aqi-value").innerText = "Error retrieving data";
            document.getElementById("aqi-description").innerText = "Please check your connection.";
            console.error(error);
        });
}

function getLocationAndFetchAQI() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude: lat, longitude: lon } = position.coords;
                console.log("Latitude:", lat, "Longitude:", lon);  // Debugging line to confirm location
                fetchAQIData(lat, lon);
            },
            () => {
                document.getElementById("aqi-value").innerText = "Location access denied";
                document.getElementById("aqi-description").innerText = "Enable location access to view data.";
            }
        );
    } else {
        document.getElementById("aqi-value").innerText = "Geolocation not supported";
    }
}

function displayAQI(aqi) {
    const aqiDisplay = document.getElementById("aqi-value");
    const description = document.getElementById("aqi-description");

    aqiDisplay.innerText = aqi;

    // Add color-coding and descriptions based on AQI value
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
        description.innerText = "Unknown AQI level";
        aqiDisplay.style.color = "#333";
    }
}

function displayPollutants(components) {
    const pollutantsList = document.getElementById("pollutants-list");
    pollutantsList.innerHTML = "";  // Clear the previous list

    for (const [pollutant, value] of Object.entries(components)) {
        const li = document.createElement("li");
        li.innerText = `${pollutant.toUpperCase()}: ${value.toFixed(2)} µg/m³`;
        pollutantsList.appendChild(li);
    }
}

window.onload = getLocationAndFetchAQI;
