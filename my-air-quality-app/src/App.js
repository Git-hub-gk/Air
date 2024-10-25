import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [airQuality, setAirQuality] = useState(null);
  const [error, setError] = useState(null);

  // Get user's location when the component mounts
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
      },
      (error) => setError("Error getting location. Please enable location services."),
      { enableHighAccuracy: true }
    );
  }, []);

  // Fetch air quality data based on location
  useEffect(() => {
    if (location.lat && location.lon) {
      const fetchAirQuality = async () => {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${location.lat}&lon=${location.lon}&appid=${process.env.REACT_APP_API_KEY}`
          );
          setAirQuality(response.data.list[0].components);
        } catch (error) {
          setError("Failed to fetch air quality data.");
        }
      };
      fetchAirQuality();
    }
  }, [location]);

  return (
    <div className="App" style={{ fontFamily: 'Arial', textAlign: 'center', padding: '20px' }}>
      <h1>Air Quality in Your Area</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {airQuality ? (
        <div style={{ marginTop: '20px' }}>
          <h2>Current Pollution Levels:</h2>
          <p>PM2.5: {airQuality.pm2_5} µg/m³</p>
          <p>PM10: {airQuality.pm10} µg/m³</p>
          <p>Carbon Monoxide (CO): {airQuality.co} µg/m³</p>
          <p>Ozone (O₃): {airQuality.o3} µg/m³</p>
          <p>Sulfur Dioxide (SO₂): {airQuality.so2} µg/m³</p>
          <p>Nitrogen Dioxide (NO₂): {airQuality.no2} µg/m³</p>
        </div>
      ) : (
        !error && <p>Loading air quality data...</p>
      )}
    </div>
  );
}

export default App;
