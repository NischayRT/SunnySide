import React from "react";
import { getWeatherIcon, getWeatherDescription } from "../utils/weatherIcons";

const SevenDayForecast = ({ weatherData }) => {
  if (!weatherData || !weatherData.daily) {
    return <div>Loading 7-day forecast...</div>;
  }

  const { time, temperature_2m_max, temperature_2m_min, weathercode } =
    weatherData.daily;

  const dailyData = time.map((dateStr, i) => ({
    date: dateStr,
    maxTemp: temperature_2m_max[i],
    minTemp: temperature_2m_min[i],
    weatherCode: weathercode[i],
  }));

  // Format day name
  const formatDay = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <div className="seven-day-forecast">
      <h3>7-Day Forecast</h3>
      <div className="daily-forecast">
        {dailyData.map((day, index) => (
          <div key={index} className="daily-item">
            <div className="day">{formatDay(day.date)}</div>
            <div
              className="weather-icon"
              title={getWeatherDescription(day.weatherCode)}
            >
              {getWeatherIcon(day.weatherCode, true)}
            </div>
            <div className="temps">
              <span className="max-temp">{Math.round(day.maxTemp)}°</span>
              <span className="min-temp">{Math.round(day.minTemp)}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SevenDayForecast;
