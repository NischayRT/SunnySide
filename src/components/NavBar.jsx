import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import "../App.css";
function NavBar({ getUserLocation, children }) {
  return (
    <div className="NavBar-1">
      <h1>
        <span className="Logo-Container">
<<<<<<< HEAD
          {/* <img src="Weather.png" className="Logo" alt="Logo" /> */}
          SunnySide
=======
          <img src="Logo.png" className="Logo" alt="Logo" />
>>>>>>> 5b715a6bd1d2bab2b47a9045bfe2a479392bc7ff
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
