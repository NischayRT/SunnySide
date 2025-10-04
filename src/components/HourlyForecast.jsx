import React from "react";
import { getWeatherIcon, getWeatherDescription } from "../utils/weatherIcons";
import "../App.css";

const HourlyForecast = ({ weatherData }) => {
  if (!weatherData || !weatherData.hourly) {
    return <div>Loading hourly forecast...</div>;
  }

  const { time, temperature_2m, weathercode } = weatherData.hourly;

  // Get current time
  const now = new Date();
  const currentHour = now.getHours();

  // Get today's date at midnight (start of day)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find the index of the current hour in the data
  const currentHourIndex = time.findIndex((timeStr) => {
    const date = new Date(timeStr);
    return (
      date.getHours() === currentHour &&
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });

  // If we can't find current hour data, show a message
  if (currentHourIndex === -1) {
    return <div>No hourly data available for current hour.</div>;
  }

  // Get 24 hours of data starting from current hour
  const hourlyData = [];
  for (let i = 0; i < 24; i++) {
    const dataIndex = currentHourIndex + i;

    if (dataIndex < time.length) {
      const hourTime = new Date(time[dataIndex]);
      const isDay = hourTime.getHours() >= 6 && hourTime.getHours() < 18;
      const hour = hourTime.getHours();

      // Check if this is the current hour
      const isCurrentHour =
        hour === currentHour &&
        hourTime.getDate() === now.getDate() &&
        hourTime.getMonth() === now.getMonth() &&
        hourTime.getFullYear() === now.getFullYear();

      hourlyData.push({
        time: time[dataIndex],
        temp: temperature_2m[dataIndex],
        weatherCode: weathercode[dataIndex],
        isDay: isDay,
        isCurrentHour: isCurrentHour,
      });
    } else {
      // Create placeholder for missing hours
      const placeholderTime = new Date(now);
      placeholderTime.setHours(currentHour + i);
      const isDay =
        placeholderTime.getHours() >= 6 && placeholderTime.getHours() < 18;
      const isCurrentHour = i === 0; // First item is current hour

      hourlyData.push({
        time: placeholderTime.toISOString(),
        temp: null,
        weatherCode: 0, // Default to clear
        isDay: isDay,
        isCurrentHour: isCurrentHour,
      });
    }
  }

  // Format time for display (12-hour format)
  const formatTime = (timeStr, index) => {
    const date = new Date(timeStr);
    let hours = date.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12

    // Add "Now" for current hour (first item)
    return index === 0 ? "Now" : `${hours} ${ampm}`;
  };

  return (
    <div className="hourly-forecast">
      <h3>24-Hour Forecast</h3>
      <div className="hourly-scroll">
        {hourlyData.map((hour, index) => (
          <div
            key={index}
            className={`hourly-item ${hour.isCurrentHour ? "active-now" : ""}`}
          >
            <div className="hour">{formatTime(hour.time, index)}</div>
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
