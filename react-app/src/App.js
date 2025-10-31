import React, { useState } from "react";
import "./Weather.css";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  // Check if API key is available
  if (!apiKey) {
    console.error("API key is missing. Please check your .env file");
  }

  const getWeather = async () => {
    if (!city) {
      alert("Please enter a city");
      return;
    }

    if (!apiKey) {
      setError(
        "API key is not configured. Please check your environment variables."
      );
      return;
    }

    setLoading(true);
    setError("");

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
      // Fetch current weather
      const currentResponse = await fetch(currentWeatherUrl);
      const currentData = await currentResponse.json();

      if (currentData.cod !== 200) {
        throw new Error(currentData.message || "Failed to fetch weather data");
      }

      setWeatherData(currentData);

      // Fetch forecast
      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await forecastResponse.json();

      if (forecastData.cod !== "200") {
        throw new Error(
          forecastData.message || "Failed to fetch forecast data"
        );
      }

      setHourlyForecast(forecastData.list?.slice(0, 8) || []);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(
        error.message || "Error fetching weather data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const displayWeather = () => {
    if (error) {
      return <p className="error">Error: {error}</p>;
    }

    if (loading) {
      return <p>Loading...</p>;
    }

    if (!weatherData) return null;

    // Check if weather data structure is valid
    if (!weatherData.main || !weatherData.weather || !weatherData.weather[0]) {
      return <p>Invalid weather data received</p>;
    }

    const temperature = Math.round(weatherData.main.temp);
    const description = weatherData.weather[0].description;
    const cityName = weatherData.name;

    return (
      <>
        <p>City: {cityName}</p>
        <p>Description: {description}</p>
        <p>Temperature: {temperature}°C</p>
      </>
    );
  };

  const displayHourlyForecast = () => {
    if (!hourlyForecast || hourlyForecast.length === 0) {
      return null;
    }

    return hourlyForecast.map((item) => {
      // Add safety checks for item structure
      if (!item || !item.main || !item.weather || !item.weather[0]) {
        return null;
      }

      const dateTime = new Date(item.dt * 1000);
      const hour = dateTime.getHours();
      const temperature = Math.round(item.main.temp);
      const iconCode = item.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

      return (
        <div className="hourly-item" key={item.dt}>
          <span>{hour}:00</span>
          <img src={iconUrl} alt="Hourly Weather Icon" />
          <span>{temperature}°C</span>
        </div>
      );
    });
  };

  return (
    <div id="app-container">
      <h2>Simple Weather App</h2>
      <div>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          onKeyPress={(e) => e.key === "Enter" && getWeather()}
        />
        <button onClick={getWeather} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      <div id="weather-info">{displayWeather()}</div>
      <div id="hourly-forecast">
        {hourlyForecast.length > 0 && <h3>24-Hour Forecast</h3>}
        {displayHourlyForecast()}
      </div>
    </div>
  );
};

export default WeatherApp;
