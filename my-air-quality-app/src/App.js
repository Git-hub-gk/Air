import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [airQuality, setAirQuality] = useState(null);
  const [error, setError] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // Fetch air quality data
  const fetchAirQuality = async () => {
    try {
      const response = await axios.get(
        `https://api.openaq.org/v1/measurements?latitude=${latitude}&longitude=${longitude}&order_by=desc&limit=1`
      );

      if (response.data.results.length > 0) {
        setAirQuality(response.data.results[0]); // Get the latest result
      } else {
        setError("No data available for this location.");
      }
    } catch (error) {
      console.error("Error fetching air quality data:", error);
      setError("Failed to fetch air quality data.");
    }
  };

  // Get user's location
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        }, (error) => {
          console.error(error);
          setError("Unable to retrieve location.");
        });
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []);

  // Fetch data when latitude and longitude are available
  useEffect(() => {
    if (latitude && longitude) {
      fetchAirQuality();
    }
  }, [latitude, longitude]);

  return (
    <div>
      <h1>Air Quality in Your Area</h1>
      {error && <p>{error}</p>}
      {airQuality ? (
        <div>
          <h2>Latest Air Quality Data</h2>
          <p>Location: {airQuality.city}</p>
          <p>PM2.5: {airQuality.value} µg/m³</p>
          <p>Measurement Time: {new Date(airQuality.date.local).toLocaleString()}</p>
        </div>
      ) : (
        <p>Loading air quality data...</p>
      )}
    </div>
  );
};

export default App;
