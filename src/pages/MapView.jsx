import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { 
  defaultProperties, 
  getGoogleMapsDirectionsUrl 
} from "../data/properties";
import "./MapView.css";

const API_URL = "http://localhost:8080/api/hostels";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom user location pin
const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapBounds({ hostels, userLocation }) {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 13);
      return;
    }
    if (hostels.length === 0) return;
    const valid = hostels.filter(h => h.latitude && h.longitude);
    if (valid.length === 0) return;
    const bounds = L.latLngBounds(valid.map((h) => [h.latitude, h.longitude]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }, [hostels, userLocation, map]);

  return null;
}

function MapView() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapMode, setMapMode] = useState("leaflet"); // "leaflet" | "googlemaps"
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locMessage, setLocMessage] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Backend not available");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item, idx) => ({
            ...defaultProperties[idx % defaultProperties.length],
            ...item,
            image: item.imageUrl || item.image || defaultProperties[idx % defaultProperties.length].image
          }));
          setHostels(mapped);
        } else {
          setHostels(defaultProperties);
        }
        setLoading(false);
      })
      .catch(() => {
        setHostels(defaultProperties);
        setLoading(false);
      });
  }, []);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setLocMessage("Locating your GPS coordinates...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setLocating(false);
        setLocMessage("✓ Centered on your live GPS location");
      },
      () => {
        // Fallback to HITEC City center
        setUserLocation({ lat: 17.4474, lng: 78.3762 });
        setLocating(false);
        setLocMessage("Location access denied. Centered on HITEC City, Hyderabad.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Hyderabad center
  const defaultCenter = [17.4474, 78.3762];

  return (
    <div className="map-page">
      <section className="map-header-bar max-wrap">
        <div>
          <span className="map-badge">StayFinder Hyderabad Map</span>
          <h1>Explore Hostels & PGs in Hyderabad</h1>
          <p>Browse verified accommodations across Madhapur, Gachibowli, HITEC City & Kondapur with Google Maps routing.</p>
        </div>

        <div className="map-actions-top">
          <button 
            className="pill-btn-outline" 
            onClick={handleLocateMe}
            title="Locate my position"
          >
            {locating ? "📍 Locating..." : "📍 Near Me (My GPS)"}
          </button>

          {/* Mode Switcher */}
          <div className="map-mode-toggle">
            <button
              className={`mode-toggle-btn ${mapMode === "leaflet" ? "active" : ""}`}
              onClick={() => setMapMode("leaflet")}
            >
              📍 Interactive Pins
            </button>
            <button
              className={`mode-toggle-btn ${mapMode === "googlemaps" ? "active" : ""}`}
              onClick={() => setMapMode("googlemaps")}
            >
              🗺️ Google Maps Live
            </button>
          </div>

          <a 
            href="https://www.google.com/maps/search/hostels+in+hyderabad/@17.4474,78.3762,13z" 
            target="_blank" 
            rel="noopener noreferrer"
            className="pill-btn-outline"
          >
            🌐 Open All in Google Maps
          </a>

          <Link to="/explore" className="pill-btn-burgundy">
            ← Explore List View
          </Link>
        </div>
      </section>

      {locMessage && (
        <div className="max-wrap" style={{ marginBottom: "12px" }}>
          <span className="explore-loc-msg">{locMessage}</span>
        </div>
      )}

      <main className="map-main-layout max-wrap">
        <div className="map-canvas-card glass-panel">
          {loading ? (
            <div className="map-loading-box">
              <p>Locating verified Hyderabad stays...</p>
            </div>
          ) : mapMode === "googlemaps" ? (
            /* Embedded Google Maps Live View */
            <div className="gmaps-embed-container">
              <iframe
                title="Hyderabad Hostels on Google Maps"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={
                  userLocation 
                    ? `https://maps.google.com/maps?q=hostels+near+${userLocation.lat},${userLocation.lng}&hl=en&z=14&output=embed`
                    : "https://maps.google.com/maps?q=hostels+in+hitec+city+madhapur+gachibowli+hyderabad&hl=en&z=13&output=embed"
                }
                allowFullScreen
              />
            </div>
          ) : (
            /* Interactive Leaflet Pins View */
            <MapContainer
              center={defaultCenter}
              zoom={12}
              scrollWheelZoom={true}
              className="map-surface"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapBounds hostels={hostels} userLocation={userLocation} />

              {/* User location pin */}
              {userLocation && (
                <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                  <Popup className="glass-popup">
                    <div style={{ padding: "4px" }}>
                      <strong style={{ color: "#b91c1c" }}>📍 You Are Here</strong>
                      <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "#666" }}>
                        Showing nearby Hyderabad hostels
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Hostel pins */}
              {hostels.map((hostel) => (
                <Marker
                  key={hostel.id}
                  position={[hostel.latitude, hostel.longitude]}
                >
                  <Popup className="glass-popup">
                    <div className="map-popup-card">
                      <img src={hostel.image} alt={hostel.name} />
                      <h4>{hostel.name}</h4>
                      <p className="pop-loc">📍 {hostel.location}</p>
                      <div className="pop-meta">
                        <strong className="pop-rent">₹{hostel.rent.toLocaleString()}/mo</strong>
                        <span className="pop-rating">⭐ {hostel.rating}</span>
                      </div>
                      
                      <div className="popup-actions-row">
                        <a 
                          href={getGoogleMapsDirectionsUrl(
                            hostel.latitude, 
                            hostel.longitude, 
                            userLocation?.lat, 
                            userLocation?.lng
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pop-btn-gmaps"
                          title="Open in Google Maps"
                        >
                          🗺️ Directions
                        </a>
                        <Link to={`/hostel/${hostel.id}`} className="pop-btn">
                          Details →
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </main>
    </div>
  );
}

export default MapView;