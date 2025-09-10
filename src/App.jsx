import { useEffect, useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import WeatherDetails from "./components/WeatherDetails";
import FavoritesList from "./components/FavoritesList";
import SearchBar from "./components/SearchBar";
import WeatherTips from "./components/WeatherTips";
import HourlyForecast from "./components/HourlyForecast";
import SevenDayForecast from "./components/SevenDayForecast";
import TemperatureGraph from "./components/TemperatureGraph";

const DEFAULT_LAT = 17.385; // Hyderabad latitude
const DEFAULT_LNG = 78.4867; // Hyderabad longitude
const DEFAULT_LOCATION = {
  name: "Hyderabad",
  country: "India",
  lat: DEFAULT_LAT,
  lng: DEFAULT_LNG,
};

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState("today");
  const [loading, setLoading] = useState(true);

  // Load favorites and last location from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("weatherFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    const lastLocation = localStorage.getItem("lastLocation");
    if (lastLocation) {
      const loc = JSON.parse(lastLocation);
      setLocation(loc);
      fetchData(loc.lat, loc.lng, loc.name, loc.country);
    } else {
      fetchData(DEFAULT_LAT, DEFAULT_LNG, "Hyderabad", "India");
    }
  }, []);

  // Save favorites whenever they change
  useEffect(() => {
    localStorage.setItem("weatherFavorites", JSON.stringify(favorites));
  }, [favorites]);

  // Save last location to localStorage when it changes
  useEffect(() => {
    if (location.name !== DEFAULT_LOCATION.name) {
      localStorage.setItem("lastLocation", JSON.stringify(location));
    }
  }, [location]);

  // Fetch weather data
  const fetchData = async (lat, lng, name, country) => {
    setLoading(true);
    try {
      const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=uv_index_max,weathercode,temperature_2m_max,temperature_2m_min,sunset,sunrise&hourly=uv_index,temperature_2m,weathercode,relativehumidity_2m&current=temperature_2m,relative_humidity_2m,windspeed_10m,weathercode&timezone=auto&forecast_days=7`;

      const response = await fetch(apiUrl);
      const json = await response.json();

      setWeatherData(json);
      setLocation({ name, country, lat, lng });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Failed to fetch weather data. Using default location.");
      fetchData(DEFAULT_LAT, DEFAULT_LNG, "Hyderabad", "India");
    } finally {
      setLoading(false);
    }
  };

  // Get user geolocation
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchData(
            latitude,
            longitude,
            "My Location",
            `Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`
          );
        },
        () => {
          alert(
            "Unable to retrieve your location. Showing Hyderabad by default."
          );
          fetchData(DEFAULT_LAT, DEFAULT_LNG, "Hyderabad", "India");
        }
      );
    }
  };

  // Toggle favorite
  const toggleFavorite = () => {
    const isFavorite = favorites.some(
      (fav) => fav.lat === location.lat && fav.lng === location.lng
    );
    if (isFavorite) {
      setFavorites(
        favorites.filter(
          (fav) => !(fav.lat === location.lat && fav.lng === location.lng)
        )
      );
    } else {
      setFavorites([...favorites, location]);
    }
  };

  const isFavorite = favorites.some(
    (fav) => fav.lat === location.lat && fav.lng === location.lng
  );

  const loadFavorite = (fav) => {
    fetchData(fav.lat, fav.lng, fav.name, fav.country);
    setActiveTab("today");
  };

  const removeFavorite = (favToRemove) => {
    setFavorites(
      favorites.filter(
        (fav) => !(fav.lat === favToRemove.lat && fav.lng === favToRemove.lng)
      )
    );
  };

  return (
    <div className="App">
      <NavBar getUserLocation={getUserLocation}>
        <SearchBar fetchData={fetchData} setLocation={setLocation} />
      </NavBar>

      <div className="NavBar-2">
        <ul className="TitleBar">
          <li className="Item">
            <button
              className={`ButtonItem ${activeTab === "today" ? "active" : ""}`}
              onClick={() => setActiveTab("today")}
            >
              Today
            </button>
          </li>
          <li className="Item">
            <button
              className={`ButtonItem ${
                activeTab === "favorites" ? "active" : ""
              }`}
              onClick={() => setActiveTab("favorites")}
            >
              Favorites
            </button>
          </li>
        </ul>
      </div>

      {loading ? (
        <div className="loading">Loading weather data...</div>
      ) : activeTab === "today" && location && weatherData ? (
        <>
          <WeatherDetails
            location={location}
            weatherData={weatherData}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
          />
          <div className="Single-Wrap">
            <WeatherTips weatherData={weatherData} />
            <TemperatureGraph weatherData={weatherData} />
          </div>
          <HourlyForecast weatherData={weatherData} />
          <SevenDayForecast weatherData={weatherData} />
        </>
      ) : (
        <FavoritesList
          favorites={favorites}
          loadFavorite={loadFavorite}
          removeFavorite={removeFavorite}
        />
      )}
    </div>
  );
}

export default App;
