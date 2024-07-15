import React, { useState } from 'react';
import './Weather.css';

const WeatherApp = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [hourlyForecast, setHourlyForecast] = useState([]);

    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

    const getWeather = () => {
        if (!city) {
            alert('Please enter a city');
            return;
        }

        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

        fetch(currentWeatherUrl)
            .then(response => response.json())
            .then(data => {
                setWeatherData(data);
            })
            .catch(error => {
                console.error('Error fetching current weather data:', error);
                alert('Error fetching current weather data. Please try again.');
            });

        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                setHourlyForecast(data.list.slice(0, 8));
            })
            .catch(error => {
                console.error('Error fetching hourly forecast data:', error);
                alert('Error fetching hourly forecast data. Please try again.');
            });
    };

    const displayWeather = () => {
        if (!weatherData) return null;

        if (weatherData.cod === 404) {
            return <p>{weatherData.message}</p>;
        } else {
            const temperature = Math.round(weatherData.main.temp - 273.15);
            const description = weatherData.weather[0].description;
            const cityName = weatherData.name;
            return (
                <>
                    <p>City: {cityName}</p>
                    <p>Description: {description}</p>
                    <p>Temperature: {temperature}°C</p>
                </>
            );
        }
    };

    const displayHourlyForecast = () => {
        return hourlyForecast.map(item => {
            const dateTime = new Date(item.dt * 1000);
            const hour = dateTime.getHours();
            const temperature = Math.round(item.main.temp - 273.15);
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
            <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Enter city"
            />
            <button onClick={getWeather}>Search</button>
            <div id="weather-info">{displayWeather()}</div>
            <div id="hourly-forecast">{displayHourlyForecast()}</div>
        </div>
    );
};

export default WeatherApp;
