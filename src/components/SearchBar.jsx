import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

function SearchBar({ fetchData, setLocation }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const containerRef = useRef(null);

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

  // Clear search
  const handleClear = () => {
    setQuery("");
    setResults([]);
  };

  // Collapse on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="search-container" ref={containerRef}>
      <span>
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search city..."
            value={query}
            onChange={handleChange}
            className="search-input"
          />
          {query && (
            <button type="button" className="clear-btn" onClick={handleClear}>
              ×
            </button>
          )}
        </div>
      </span>

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
