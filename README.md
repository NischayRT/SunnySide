# 🌤 Weather App

A fast and interactive weather application built with **Vite + React**.  
It provides **real-time forecasts, 7-day outlook, 24-hour details, personalized weather tips, and graphical summaries**.

👉 Live Demo: [Weather Now](https://weather-now-aganitha.netlify.app/)
=======

---

## 🚀 Features

- 🌡 **Current Weather** – Real-time temperature, humidity, wind, and rain/snow conditions.
- 📆 **7-Day Forecast** – Overview of the week ahead.
- ⏰ **24-Hour Forecast** – Hourly weather breakdown with temperature trends.
- 📊 **Graphical Representation** – Charts for temperature variations & weekly summaries.
- 📝 **Weather Tips** – Smart suggestions (UV safety, hydration, clothing, sunscreen, etc.).
- 📍 **Location Support** – Detects your location or search by city/coordinates.
- ⭐ **Favorites** – Save and manage your favorite cities.
- ⚡ **Powered by Vite** – Super-fast dev environment and build process.

---

## 🛠 Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS (or custom CSS)
- **Charts:** Recharts (or Chart.js)
- **API:** [Open-Meteo](https://open-meteo.com/)

---

## 📦 Installation

Clone the repository:

```bash:
        git clone https://github.com/NischayRT/SunnySide.git
        cd weather-app
```

Install dependencies:

```bash:
        npm install
```

Run the development server:

```bash:
        npm run dev
```

Open in your browser:  
👉 [http://localhost:5173](http://localhost:5173)

---

## ⚙️ Configuration

Update the API endpoint in `App.jsx` with desired latitude & longitude:

```js
const apiUrl =
  "https://api.open-meteo.com/v1/forecast?latitude=17.384&longitude=78.4564&daily=uv_index_max,temperature_2m_max,temperature_2m_min,daylight_duration,sunshine_duration&hourly=temperature_2m&current=temperature_2m,showers,snowfall,rain&minutely_15=wind_speed_10m,temperature_2m";
```

---

## 📸 Screenshots

- 🖼 Home page with current weather
- 🖼 24-hour forecast with scrollable cards
- 🖼 7-day forecast
- 🖼 Weather tips & safety suggestions

---
