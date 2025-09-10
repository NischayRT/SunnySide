// utils/weatherIcons.js
export const getWeatherIcon = (weatherCode, isDay = true) => {
  // Clear sky
  if (weatherCode === 0) {
    return isDay ? "☀️" : "🌙";
  }

  // Mainly clear, partly cloudy, and overcast
  if (weatherCode === 1) return isDay ? "🌤️" : "🌙☁️";
  if (weatherCode === 2) return isDay ? "⛅" : "🌙☁️";
  if (weatherCode === 3) return "☁️";

  // Fog and depositing rime fog
  if (weatherCode === 45 || weatherCode === 48) return "🌫️";

  // Drizzle
  if (weatherCode === 51 || weatherCode === 53 || weatherCode === 55)
    return "🌧️";

  // Freezing Drizzle
  if (weatherCode === 56 || weatherCode === 57) return "🌧️❄️";

  // Rain
  if (weatherCode === 61 || weatherCode === 63 || weatherCode === 65)
    return "🌧️";

  // Freezing Rain
  if (weatherCode === 66 || weatherCode === 67) return "🌧️❄️";

  // Snow fall
  if (weatherCode === 71 || weatherCode === 73 || weatherCode === 75)
    return "❄️";

  // Snow grains
  if (weatherCode === 77) return "🌨️";

  // Rain showers
  if (weatherCode === 80 || weatherCode === 81 || weatherCode === 82)
    return "🌦️";

  // Snow showers
  if (weatherCode === 85 || weatherCode === 86) return "🌨️";

  // Thunderstorm
  if (weatherCode === 95) return "⛈️";

  // Thunderstorm with hail
  if (weatherCode === 96 || weatherCode === 99) return "⛈️❄️";

  // Default for unknown codes
  return isDay ? "☀️" : "🌙";
};

export const getWeatherDescription = (weatherCode) => {
  const descriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };

  return descriptions[weatherCode] || "Unknown weather condition";
};
