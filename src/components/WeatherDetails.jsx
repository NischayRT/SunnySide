import React from "react";
import "./WeatherDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faStar as regularStar,
  faTemperatureArrowDown,
  faTemperatureArrowUp,
  faSun,
  faMoon,
  faWind,
  faCloud,
  faCloudSun,
  faCloudMoon,
  faCloudRain,
  faBolt,
  faSnowflake,
  faSmog,
} from "@fortawesome/free-solid-svg-icons";

// Import Weather Codes
import { weatherIcons, weatherConditions } from "./weatherCodes";

/* Helper functions */
const formatValue = (value, suffix = "") => {
  if (value === undefined || value === null) return "--";
  return `${value}${suffix}`;
};

const formatTime = (timeString) => {
  if (!timeString) return "--";
  const date = new Date(timeString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const getUVIndexColor = (uvValue) => {
  if (uvValue === undefined || uvValue === null) return "";
  if (uvValue >= 11) return "uv-extreme";
  if (uvValue >= 8) return "uv-very-high";
  if (uvValue >= 6) return "uv-high";
  if (uvValue >= 3) return "uv-moderate";
  return "uv-low";
};

const getUVIndexDescription = (uvValue) => {
  if (uvValue === undefined || uvValue === null) return "";
  if (uvValue >= 11) return "Extreme";
  if (uvValue >= 8) return "Very High";
  if (uvValue >= 6) return "High";
  if (uvValue >= 3) return "Moderate";
  return "Low";
};

// Function to check if it's currently day or night
const isDaytime = (sunrise, sunset) => {
  if (!sunrise || !sunset) return true; // Default to daytime if data missing

  const now = new Date();
  const sunriseTime = new Date(sunrise);
  const sunsetTime = new Date(sunset);

  return now >= sunriseTime && now < sunsetTime;
};

// Function to get appropriate weather icon based on weather code and time of day
const getWeatherIcon = (weatherCode, isDay) => {
  // Handle clear sky conditions (day vs night)
  if (weatherCode === 0 || weatherCode === 1) {
    return isDay ? faSun : faMoon;
  }

  // Handle partly cloudy conditions
  if (weatherCode === 2) {
    return isDay ? faCloudSun : faCloudMoon;
  }

  // Handle overcast
  if (weatherCode === 3) {
    return faCloud;
  }

  // Handle fog
  if (weatherCode === 45 || weatherCode === 48) {
    return faSmog;
  }

  // Handle drizzle
  if (weatherCode >= 51 && weatherCode <= 57) {
    return faCloudRain;
  }

  // Handle rain
  if (weatherCode >= 61 && weatherCode <= 67) {
    return faCloudRain;
  }

  // Handle snow
  if (
    (weatherCode >= 71 && weatherCode <= 77) ||
    weatherCode === 85 ||
    weatherCode === 86
  ) {
    return faSnowflake;
  }

  // Handle rain showers
  if (weatherCode >= 80 && weatherCode <= 82) {
    return faCloudRain;
  }

  // Handle thunderstorms
  if (weatherCode >= 95 && weatherCode <= 99) {
    return faBolt;
  }

  // Default icon
  return isDay ? faSun : faMoon;
};

/**
 * Find the hourly value closest to "now"
 * returns { value, index, time } or { value: undefined, index: -1, time: null }
 */
const getNearestHourly = (values = [], times = []) => {
  if (
    !Array.isArray(values) ||
    !Array.isArray(times) ||
    values.length === 0 ||
    times.length === 0
  ) {
    return { value: undefined, index: -1, time: null };
  }

  const now = Date.now();
  let nearestIndex = -1;
  let minDiff = Infinity;

  for (let i = 0; i < times.length; i++) {
    const ts = Date.parse(times[i]);
    if (isNaN(ts)) continue;
    const diff = Math.abs(ts - now);
    if (diff < minDiff) {
      minDiff = diff;
      nearestIndex = i;
    }
  }

  if (nearestIndex === -1) return { value: undefined, index: -1, time: null };
  return {
    value: values[nearestIndex],
    index: nearestIndex,
    time: times[nearestIndex],
  };
};

function WeatherDetails({ location, weatherData, toggleFavorite, isFavorite }) {
  // Extract current UV index from the API data
  const getCurrentUVIndex = () => {
    if (!weatherData || !weatherData.hourly || !weatherData.hourly.uv_index) {
      return null;
    }

    const uvIndexValues = weatherData.hourly.uv_index;
    const uvIndexTimes = weatherData.hourly.time;

    // Find the UV index value closest to the current time
    const { value: uvCurrentValue } = getNearestHourly(
      uvIndexValues,
      uvIndexTimes
    );

    return uvCurrentValue !== undefined ? Math.round(uvCurrentValue) : null;
  };

  const currentUVIndex = getCurrentUVIndex();

  const uvColorClass = getUVIndexColor(currentUVIndex);
  const uvDescription = getUVIndexDescription(currentUVIndex);

  // Get sunrise and sunset times (daily arrays)
  const sunriseTime = weatherData?.daily?.sunrise?.[0];
  const sunsetTime = weatherData?.daily?.sunset?.[0];

  // Check if it's currently daytime
  const daytime = isDaytime(sunriseTime, sunsetTime);

  // Daily data
  const maxTemp = weatherData?.daily?.temperature_2m_max?.[0];
  const minTemp = weatherData?.daily?.temperature_2m_min?.[0];

  // Current Weather Code (for condition icon)
  const weatherCode = weatherData?.current?.weathercode;
  const weatherIcon = weatherIcons[weatherCode];
  const weatherCondition = weatherConditions[weatherCode];

  // Get appropriate weather icon for temperature display
  const tempWeatherIcon = getWeatherIcon(weatherCode, daytime);

  return (
    <div className="Main-Body">
      <button
        className="Favorite-Button"
        onClick={toggleFavorite}
        aria-label="Toggle favorite"
      >
        <FontAwesomeIcon
          icon={isFavorite ? solidStar : regularStar}
          className={isFavorite ? "favorite-active" : "favorite-inactive"}
        />
      </button>

      <div className="Location-Details">
        <h2 className="Location">
          {location.name}, {location.country}
        </h2>
        <h4 className="Date">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </h4>

        {/* Weather Icon + Temperature */}
        <div className="Current-Weather">
          {weatherIcon && (
            <i
              className={`fas ${weatherIcon} weather-icon`}
              aria-hidden="true"
            ></i>
          )}
          <h2 className="Temperature">
            <FontAwesomeIcon icon={tempWeatherIcon} className="temp-icon" />
            {formatValue(
              weatherData?.current?.temperature_2m !== undefined
                ? Math.round(weatherData.current.temperature_2m)
                : undefined,
              ` ${weatherData?.current_units?.temperature_2m || "°C"}`
            )}
          </h2>
        </div>

        {/* Weather Condition Text */}
        {weatherCondition && <p className="Condition">{weatherCondition}</p>}

        {weatherData?.current && (
          <div className="Weather-Details">
            {/* Current UV Index (from hourly, nearest hour) */}
            <div className="Detail-Item">
              <span className="Label">UV Index:</span>
              <span className={`Value ${uvColorClass}`}>
                {currentUVIndex !== null ? currentUVIndex : "--"}
                {uvDescription && (
                  <span className="uv-description"> ({uvDescription})</span>
                )}
              </span>
            </div>

            <div className="Detail-Item">
              <span className="Label">Humidity:</span>
              <span className="Value">
                {formatValue(
                  weatherData?.current?.relative_humidity_2m !== undefined
                    ? Math.round(weatherData.current.relative_humidity_2m)
                    : undefined,
                  ` ${weatherData?.current_units?.relative_humidity_2m || "%"}`
                )}
              </span>
            </div>

            <div className="Detail-Item">
              <span className="Label">
                <FontAwesomeIcon icon={faWind} /> Wind Speed:
              </span>
              <span className="Value">
                {formatValue(
                  weatherData?.current?.windspeed_10m !== undefined
                    ? Math.round(weatherData.current.windspeed_10m)
                    : undefined,
                  ` ${weatherData?.current_units?.windspeed_10m || "km/h"}`
                )}
              </span>
            </div>

            {/* Sunrise and Sunset */}
            <div className="Detail-Item sun-times">
              <span className="Label">
                <FontAwesomeIcon icon={faSun} className="sun-icon" /> Sunrise:
              </span>
              <span className="Value">{formatTime(sunriseTime)}</span>
            </div>

            <div className="Detail-Item moon-time">
              <span className="Label">
                <FontAwesomeIcon icon={faMoon} className="moon-icon" /> Sunset:
              </span>
              <span className="Value">{formatTime(sunsetTime)}</span>
            </div>

            {/* Daily Temperature Range */}
            <div className="Detail-Item">
              <span className="Label">
                <FontAwesomeIcon icon={faTemperatureArrowUp} />
                <span> High / Low: </span>
                <FontAwesomeIcon
                  icon={faTemperatureArrowDown}
                  className="high-icon"
                />
              </span>
              <span className="Value">
                {formatValue(
                  maxTemp !== undefined ? Math.round(maxTemp) : undefined,
                  "°"
                )}{" "}
                /{" "}
                {formatValue(
                  minTemp !== undefined ? Math.round(minTemp) : undefined,
                  "°"
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherDetails;
