

import React, { useEffect, useState } from "react";
import "./Weather.css";
import search_icon from "../src/assets/search.png";
import clear_icon from "../src/assets/clear.png";
import cloud_icon from "../src/assets/cloud.png";
import drizzle_icon from "../src/assets/drizzle.png";
import humidity_icon from "../src/assets/humidity.png";
import rain_icon from "../src/assets/rain.png";
import snow_icon from "../src/assets/snow.png";
import wind_icon from "../src/assets/wind.png";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Lahore");
  const [error, setError] = useState("");

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const search = async (cityName) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      console.log("API URL:", url);
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        const icon = allIcons[data.weather[0]?.icon] || clear_icon;
        setWeatherData({
          humidity: data.main.humidity,
          wind: data.wind.speed,
          temperature: Math.floor(data.main.temp),
          location: data.name,
          icon: icon,
        });
        setError(""); 
      } else {
        setError("City not found. Please try again.");
        setWeatherData(null);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Failed to fetch data. Please check your connection.");
      setWeatherData(null);
    }
  };

  useEffect(() => {
    search(city);
  }, []);

  const handleSearch = () => {
    if (city.trim() === "") {
      setError("City name cannot be empty.");
      return;
    }
    search(city);
    setCity("");
  };

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search City"
          value={city}
          onChange={(e) => setCity(e.target.value)} 
        />
        <img
          src={search_icon}
          alt="Search"
          onClick={handleSearch} 
          style={{ cursor: "pointer" }}
        />
      </div>

      {error && <p className="error">{error}</p>}

      {weatherData ? (
        <>
          <img src={weatherData.icon} alt="Weather Icon" className="weather-icon" />
          <p className="temperature">{weatherData.temperature}°C</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="Humidity" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>

            <div className="col">
              <img src={wind_icon} alt="Wind Speed" />
              <div>
                <p>{weatherData.wind} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        !error && <p>Loading weather data...</p>
      )}
    </div>
  );
};

export default Weather;
