import { useState } from "react";
import PropTypes from "prop-types";

function SearchBar({ fetchData, setLocation }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // Handle user typing
  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${value}&count=5&language=en&format=json`
        );
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error("Search error:", err);
      }
    } else {
      setResults([]);
    }
  };

  // When user clicks a city
  const handleSelect = (city) => {
    setQuery(city.name);
    setResults([]);
    fetchData(city.latitude, city.longitude);
    setLocation({ name: city.name, country: city.country });
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search city..."
        value={query}
        onChange={handleChange}
        className="search-input"
      />

      {results.length > 0 && (
        <ul className="search-results">
          {results.map((city) => (
            <li key={`${city.latitude}-${city.longitude}`}>
              <button
                type="button"
                className="search-item"
                onClick={() => handleSelect(city)}
              >
                {city.name}, {city.country}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// PropTypes validation
SearchBar.propTypes = {
  fetchData: PropTypes.func.isRequired,
  setLocation: PropTypes.func.isRequired,
};

export default SearchBar;
