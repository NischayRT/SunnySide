import React from "react";
import { getWeatherIcon, getWeatherDescription } from "../utils/weatherIcons";
import "../App.css";
const HourlyForecast = ({ weatherData }) => {
  if (!weatherData || !weatherData.hourly) {
    return <div>Loading hourly forecast...</div>;
  }

  const { time, temperature_2m, weathercode } = weatherData.hourly;

  // Get today's date at midnight (start of day)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  // Find the index where today's data starts
  const startIndex = time.findIndex((timeStr) => {
    const date = new Date(timeStr);
    return date >= today;
  });

  // If we can't find today's data, show a message
  if (startIndex === -1) {
    return <div>No hourly data available for today.</div>;
  }

  // Get 24 hours of data starting from the first available hour of today
  const hourlyData = [];
  for (let i = 0; i < 24; i++) {
    const dataIndex = startIndex + i;

    if (dataIndex < time.length) {
      const hourTime = new Date(time[dataIndex]);
      const isDay = hourTime.getHours() >= 6 && hourTime.getHours() < 18;

      // Use actual data if available
      hourlyData.push({
        time: time[dataIndex],
        temp: temperature_2m[dataIndex],
        weatherCode: weathercode[dataIndex],
        isDay: isDay,
      });
    } else {
      // Create placeholder for missing hours
      const placeholderTime = new Date(today);
      placeholderTime.setHours(i);
      const isDay = i >= 6 && i < 18;

      hourlyData.push({
        time: placeholderTime.toISOString(),
        temp: null,
        weatherCode: 0, // Default to clear
        isDay: isDay,
      });
    }
  }

  // Format time for display (12-hour format)
  const formatTime = (timeStr) => {
    const date = new Date(timeStr);
    let hours = date.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    return `${hours} ${ampm}`;
  };

  return (
    <div className="hourly-forecast">
      <h3>24-Hour Forecast (Today)</h3>
      <div className="hourly-scroll">
        {hourlyData.map((hour, index) => (
          <div key={index} className="hourly-item">
            <div className="hour">{formatTime(hour.time)}</div>
            <div
              className="weather-icon"
              title={getWeatherDescription(hour.weatherCode)}
            >
              {getWeatherIcon(hour.weatherCode, hour.isDay)}
            </div>
            <div className="temp">
              {hour.temp !== null ? `${Math.round(hour.temp)}°` : "--"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
