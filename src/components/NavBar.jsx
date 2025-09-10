import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import "../App.css";
function NavBar({ getUserLocation, children }) {
  return (
    <div className="NavBar-1">
      <h1>
        <span className="Logo-Container">
          {/* <img src="Weather.png" className="Logo" alt="Logo" /> */}
          SunnySide
        </span>
      </h1>
      <div className="Search-Bar">{children}</div>
      <button onClick={getUserLocation} className="Location-Btn">
        <FontAwesomeIcon icon={faLocationDot} className="icon" />
        My Location
      </button>
    </div>
  );
}

export default NavBar;
