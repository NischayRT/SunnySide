🌤 Weather App

A fast and interactive weather application built with Vite + React. It provides real-time forecasts, 7-day outlook, 24-hour details, and personalized weather tips with graphical summaries.

https://weather-now-aganitha.netlify.app/


🚀 Features

*🌡 Current Weather – Real-time temperature, humidity, rain/snow conditions.

*📆 7-Day Forecast – Get an overview of the week ahead.

*⏰ 24-Hour Forecast – Hourly temperature trends and weather changes.

*📊 Graphical Representation – Easy-to-read charts for temperature variations and weekly summaries.

*📝 Weather Tips – Smart suggestions (UV safety, hydration, clothing, sunscreen, etc.) based on conditions.

*📍 Location Support – Fetch data based on latitude & longitude.

*⚡ Powered by Vite – Super-fast dev environment and build process.



🛠 Tech Stack

Frontend: React + Vite

Styling: Tailwind CSS (or custom CSS if you styled manually)

Charts: Recharts (or Chart.js if you used that)

API: Open-Meteo



📦 Installation

Clone the repository:

git clone https://github.com/NischayRT/SunnySide.git
cd weather-app


Install dependencies:

npm install


Run the development server:

npm run dev


Open your browser at:

http://localhost:5173

⚙️ Configuration

Update the API endpoint in your code with desired latitude & longitude:

const apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=17.384&longitude=78.4564&daily=uv_index_max,temperature_2m_max,temperature_2m_min,daylight_duration,sunshine_duration&hourly=temperature_2m&current=temperature_2m,showers,snowfall,rain&minutely_15=wind_speed_10m,temperature_2m";


📸 Screenshots



