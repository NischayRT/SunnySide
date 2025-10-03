import React from "react";
import { getWeatherIcon, getWeatherDescription } from "../utils/weatherIcons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTemperatureArrowDown,
  faTemperatureArrowUp,
} from "@fortawesome/free-solid-svg-icons";

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

  // Get current date for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Format day name and check if it's today
  const formatDay = (dateStr) => {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.getTime() === today.getTime()) return "Today";
    if (date.getTime() === tomorrow.getTime()) return "Tomorrow";

    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  // Check if a date is today
  const isToday = (dateStr) => {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  };

  return (
    <div className="seven-day-forecast">
      <h3>7-Day Forecast</h3>
      <div className="daily-forecast">
        {dailyData.map((day, index) => (
          <div
            key={index}
            className={`daily-item ${isToday(day.date) ? "active-today" : ""}`}
          >
            <div className="day">{formatDay(day.date)}</div>
            <div
              className="weather-icon"
              title={getWeatherDescription(day.weatherCode)}
            >
              {getWeatherIcon(day.weatherCode, true)}
            </div>
            <div className="temps">
              <span className="max-temp">
                <FontAwesomeIcon icon={faTemperatureArrowUp} />{" "}
                {Math.round(day.maxTemp)}°
              </span>
              <span className="min-temp">
                {Math.round(day.minTemp)}°{" "}
                <FontAwesomeIcon icon={faTemperatureArrowDown} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SevenDayForecast;
