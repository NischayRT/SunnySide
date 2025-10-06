# 🌤 Weather App

A fast and interactive weather application built with **Vite + React**.  
It provides **real-time forecasts, 7-day outlook, 24-hour details, personalized weather tips, and graphical summaries**.

👉 Live Demo:
 [Weather Now](https://weather-now-aganitha.netlify.app/)
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
- **Styling:** Custom CSS
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
  <img width="1895" height="906" alt="image" src="https://github.com/user-attachments/assets/a0347a34-996b-489b-afff-eb3f961591cd" />

- 🖼 24-hour forecast with scrollable cards

  <img width="1886" height="900" alt="image" src="https://github.com/user-attachments/assets/88351314-64ad-41ab-a234-a18204b3130e" />

- 🖼 7-day forecast
  <img width="1901" height="903" alt="image" src="https://github.com/user-attachments/assets/68cba2e4-c7ed-40bb-a012-a29d68bbebd4" />

- 🖼 Weather tips & safety suggestions
  <img width="1893" height="907" alt="image" src="https://github.com/user-attachments/assets/524227f2-e65c-4b43-9cee-9b924a2f221a" />

- 🖼 Search bar and results
  <img width="1896" height="828" alt="image" src="https://github.com/user-attachments/assets/eaf1c943-ec30-4fb3-9939-cfbdefc07de4" />

- 🖼 Favorites tab
  <img width="1893" height="902" alt="image" src="https://github.com/user-attachments/assets/d3ccd14a-05ee-4a01-bcfe-2434faca4627" />

---
