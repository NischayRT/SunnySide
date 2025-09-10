import React from "react";
import "./WeatherTips.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUmbrella,
  faWind,
  faTemperatureHigh,
  faTemperatureLow,
  faSun,
  faMoon,
  faGlassWater,
  faShirt,
  faCloud,
} from "@fortawesome/free-solid-svg-icons";

const WeatherTips = ({ weatherData }) => {
  if (!weatherData || !weatherData.current) {
    return null;
  }

  // Function to get the current UV index
  const getCurrentUVIndex = () => {
    if (
      !weatherData.hourly ||
      !weatherData.hourly.uv_index ||
      !weatherData.hourly.time
    ) {
      return null;
    }

    const uvIndexValues = weatherData.hourly.uv_index;
    const uvIndexTimes = weatherData.hourly.time;

    // Find the UV index value closest to the current time
    const now = Date.now();
    let nearestIndex = -1;
    let minDiff = Infinity;

    for (let i = 0; i < uvIndexTimes.length; i++) {
      const time = new Date(uvIndexTimes[i]);
      const diff = Math.abs(time.getTime() - now);
      if (diff < minDiff) {
        minDiff = diff;
        nearestIndex = i;
      }
    }

    return nearestIndex >= 0 ? uvIndexValues[nearestIndex] : null;
  };

  const { temperature_2m, relative_humidity_2m, windspeed_10m, weathercode } =
    weatherData.current;
  const uvIndex = getCurrentUVIndex();

  // Generate tips based on weather conditions
  const generateTips = () => {
    const tips = [];
    const nowHour = new Date().getHours();

    // UV Index tips
    if (uvIndex !== null) {
      if (uvIndex >= 8) {
        tips.push(
          {
            icon: faSun,
            text: "UV radiation is extremely high. Cover your body completely and wear a hat or mask outdoors.",
            severity: "high",
          },
          {
            icon: faSun,
            text: "Avoid going outside during peak hours (10 AM – 4 PM) if possible.",
            severity: "high",
          },
          {
            icon: faSun,
            text: "Always use a strong sunscreen (SPF 30+) when outdoors.",
            severity: "high",
          }
        );
      } else if (uvIndex >= 6) {
        tips.push(
          {
            icon: faSun,
            text: "UV levels are high. Apply sunscreen with SPF 30+.",
            severity: "medium",
          },
          {
            icon: faShirt,
            text: "Wear sunglasses and light clothing to protect your skin.",
            severity: "medium",
          }
        );
      }
    }

    // Temperature tips
    if (temperature_2m >= 34) {
      tips.push(
        {
          icon: faTemperatureHigh,
          text: "It's very hot. Wear light cotton clothes.",
          severity: "high",
        },
        {
          icon: faGlassWater,
          text: "Drink plenty of water to stay hydrated.",
          severity: "high",
        },
        {
          icon: faSun,
          text: "Avoid staying outdoors too long in direct sunlight.",
          severity: "high",
        }
      );
    } else if (temperature_2m <= 20) {
      tips.push(
        {
          icon: faTemperatureLow,
          text: "It's chilly outside. Wear warm clothes and sweaters.",
          severity: "medium",
        },
        {
          icon: faShirt,
          text: "Cover your ears, hands, and feet to stay comfortable.",
          severity: "medium",
        },
        {
          icon: faGlassWater,
          text: "Have warm drinks like tea/coffee to maintain body warmth.",
          severity: "medium",
        }
      );
    } else if (temperature_2m < 30 && uvIndex < 6) {
      tips.push({
        icon: faSun,
        text: "Weather is pleasant. Have a great day outdoors!",
        severity: "low",
      });
    }

    // Humidity and precipitation tips
    if (
      relative_humidity_2m >= 80 ||
      [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weathercode)
    ) {
      tips.push(
        {
          icon: faUmbrella,
          text: "High humidity or rain. Carry an umbrella with you.",
          severity: "medium",
        },
        {
          icon: faShirt,
          text: "Wear a raincoat or waterproof jacket.",
          severity: "medium",
        },
        {
          icon: faCloud,
          text: "Avoid slippery roads and drive carefully in rain.",
          severity: "medium",
        }
      );
    }

    // Wind tips
    if (windspeed_10m >= 20) {
      tips.push(
        {
          icon: faWind,
          text: "Strong winds expected. Cover your mouth, nose, and eyes.",
          severity: "high",
        },
        {
          icon: faWind,
          text: "Avoid standing under trees or weak structures.",
          severity: "high",
        },
        {
          icon: faWind,
          text: "Limit outdoor exposure until winds calm down.",
          severity: "high",
        }
      );
    }

    // Nighttime peaceful weather
    if (nowHour >= 21 || nowHour <= 5) {
      if (weathercode === 0 || weathercode === 1) {
        tips.push({
          icon: faMoon,
          text: "Clear sky tonight. Have a peaceful and restful night!",
          severity: "low",
        });
      }
    }

    // Add fallback
    if (tips.length === 0) {
      tips.push({
        icon: faSun,
        text: "Weather looks calm. Enjoy your day!",
        severity: "low",
      });
    }

    return tips;
  };

  const tips = generateTips();

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "#ff6b6b";
      case "medium":
        return "#ffa94d";
      case "low":
        return "#51cf66";
      default:
        return "#868e96";
    }
  };

  const getSeverityText = (severity) => {
    switch (severity) {
      case "high":
        return "Important";
      case "medium":
        return "Moderate";
      case "low":
        return "General";
      default:
        return "Tip";
    }
  };

  return (
    <div className="weather-tips">
      <h3>
        <FontAwesomeIcon icon={faShirt} /> Weather Safety Tips
      </h3>
      <div className="tips-container">
        {tips.map((tip, index) => (
          <div key={index} className="tip-card">
            <div
              className="tip-severity"
              style={{ backgroundColor: getSeverityColor(tip.severity) }}
            >
              {getSeverityText(tip.severity)}
            </div>
            <div className="tip-content">
              <FontAwesomeIcon icon={tip.icon} className="tip-icon" />
              <p>{tip.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherTips;
