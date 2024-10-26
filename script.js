const API_KEY = 3e92fe35e0aaa7695af1cd7c2de8d4a9;

function fetchAQIData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            return response.json();
        })
        .then(data => {
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
                fetchAQIData(lat, lon);
            },
            () => {
                document.getElementById("aqi-value").innerText = "Location access denied";
                document.getElementById("aqi-description").innerText = "Enable location access to view data.";
            }
       
