import { useState } from "react";
import { Link } from "react-router-dom";
import "./LiveLocation.css";

function LiveLocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getLiveLocation = () => {
    setLoading(true);
    setError("");
    setLocation(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });

        setLoading(false);
      },
      (error) => {
        setLoading(false);

        if (error.code === error.PERMISSION_DENIED) {
          setError(
            "Location permission was denied. Please allow location access."
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setError("Your current location could not be determined.");
        } else if (error.code === error.TIMEOUT) {
          setError("Location request timed out. Please try again.");
        } else {
          setError("Unable to get your location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="live-location-page">

      <div className="live-location-card">

        <Link to="/" className="location-logo">
          StayFinder
        </Link>

        <div className="location-icon">
          📍
        </div>

        <h1>Find stays near you</h1>

        <p>
          StayFinder uses your device's current location to
          discover hostels and PGs around you.
        </p>

        <button
          className="location-button"
          onClick={getLiveLocation}
          disabled={loading}
        >
          {loading ? "Getting your location..." : "Use My Live Location"}
        </button>

        {location && (
          <div className="location-result">

            <h2>Location detected ✓</h2>

            <p>
              <strong>Latitude:</strong>{" "}
              {location.latitude.toFixed(6)}
            </p>

            <p>
              <strong>Longitude:</strong>{" "}
              {location.longitude.toFixed(6)}
            </p>

            <p>
              <strong>Accuracy:</strong>{" "}
              {Math.round(location.accuracy)} meters
            </p>

            <Link to="/explore" className="continue-button">
              Find Nearby Stays →
            </Link>

          </div>
        )}

        {error && (
          <div className="location-error">
            {error}
          </div>
        )}

      </div>

    </div>
  );
}

export default LiveLocation;