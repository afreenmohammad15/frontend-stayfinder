import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import { 
  defaultProperties, 
  HYDERABAD_LOCALITIES, 
  getGoogleMapsDirectionsUrl 
} from "../data/properties";
import "./Explore.css";

const API_URL = "http://localhost:8080/api/hostels";

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function Explore() {
  const routeLocation = useLocation();
  const initialType = routeLocation.state?.type || "All";
  const initialSearch = routeLocation.state?.location || "";
  const { openCompare } = useLayout();

  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedLocality, setSelectedLocality] = useState("All");
  const [type, setType] = useState(initialType);
  const [maxRent, setMaxRent] = useState(25000);
  const [userLocation, setUserLocation] = useState(null);
  const [locationMessage, setLocationMessage] = useState("");

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("stayfinderFavorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Backend not available");
        return res.json();
      })
      .then((data) => {
        // If backend returns list, merge with default Hyderabad properties so real photos & coordinates exist
        if (Array.isArray(data) && data.length > 0) {
          const merged = data.map((item, idx) => ({
            ...defaultProperties[idx % defaultProperties.length],
            ...item,
            image: item.imageUrl || item.image || defaultProperties[idx % defaultProperties.length].image
          }));
          setHostels(merged);
        } else {
          setHostels(defaultProperties);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback to high-res real Hyderabad properties
        setHostels(defaultProperties);
        setLoading(false);
      });
  }, []);

  const handlePropertyAdded = (newProp) => {
    setHostels((prev) => [
      {
        ...newProp,
        image: newProp.imageUrl || newProp.image || defaultProperties[0].image
      },
      ...prev
    ]);
  };

  const getLiveLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Your browser does not support location services.");
      return;
    }
    setLocationMessage("Locating nearest Hyderabad stays from your current GPS...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationMessage("✓ Showing stays sorted by nearest distance to your location");
      },
      () => {
        // If user denied GPS permission, default location to HITEC City center
        setUserLocation({ lat: 17.4474, lng: 78.3762 });
        setLocationMessage("Location permission denied. Sorted by proximity to HITEC City, Hyderabad.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSelectLocality = (loc) => {
    setSelectedLocality(loc.name);
    if (loc.name === "All") {
      setSearch("");
    } else {
      setSearch(loc.name);
      if (loc.lat && loc.lng) {
        setUserLocation({ lat: loc.lat, lng: loc.lng });
        setLocationMessage(`✓ Showing stays sorted by nearest distance to ${loc.name}`);
      }
    }
  };

  const toggleFavorite = (id) => {
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter((favId) => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("stayfinderFavorites", JSON.stringify(updated));
  };

  const filteredHostels = hostels
    .filter((hostel) => {
      const searchText = search.toLowerCase();
      const matchesSearch =
        !search ||
        hostel.name?.toLowerCase().includes(searchText) ||
        hostel.location?.toLowerCase().includes(searchText);

      const matchesType = type === "All" || hostel.type === type;
      const matchesRent = hostel.rent <= maxRent;
      return matchesSearch && matchesType && matchesRent;
    })
    .map((hostel) => {
      if (!userLocation) return hostel;
      return {
        ...hostel,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          hostel.latitude,
          hostel.longitude
        )
      };
    })
    .sort((a, b) => {
      if (userLocation && a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      return (b.matchScore || 90) - (a.matchScore || 90);
    });

  return (
    <div className="explore-container">
      <div className="explore-content-wrap">
        {/* Header */}
        <div className="explore-hero-head">
          <span className="explore-tag">StayFinder Hyderabad</span>
          <h1>Explore Hostels & PGs in Hyderabad</h1>
          <p>Verified stays across HITEC City, Madhapur, Gachibowli, Kondapur, and beyond with Google Maps directions.</p>
        </div>

        {/* Filter & Search Bar */}
        <div className="explore-filter-box glass-panel">
          <div className="filter-search-input-wrap">
            <input
              type="text"
              placeholder="Search by locality (e.g., Madhapur, Gachibowli, HITEC City, Kondapur, Ameerpet)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="pill-btn-outline gps-explore-btn" onClick={getLiveLocation}>
              📍 Near Me
            </button>
          </div>

          {/* Quick Hyderabad Locality Chips */}
          <div className="locality-chips-row">
            <span className="locality-label">Hyderabad Hubs:</span>
            <div className="locality-pills-list">
              {HYDERABAD_LOCALITIES.map((loc) => (
                <button
                  key={loc.name}
                  className={`locality-chip ${selectedLocality === loc.name ? "active" : ""}`}
                  onClick={() => handleSelectLocality(loc)}
                >
                  {loc.name === "All" ? "🌟 All Hyderabad" : `📍 ${loc.name}`}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-controls-row">
            <div className="filter-type-pills">
              {["All", "Hostel", "PG", "Co-living", "Apartment", "Serviced Apartments"].map((t) => (
                <button
                  key={t}
                  className={`type-pill ${type === t ? "active" : ""}`}
                  onClick={() => setType(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="rent-slider-wrap">
              <div className="slider-label">
                <span>Budget Limit:</span>
                <strong>₹{maxRent.toLocaleString()}/mo</strong>
              </div>
              <input
                type="range"
                min="5000"
                max="30000"
                step="1000"
                value={maxRent}
                onChange={(e) => setMaxRent(Number(e.target.value))}
              />
            </div>
          </div>

          {locationMessage && <div className="explore-loc-msg">{locationMessage}</div>}
        </div>

        {/* Results Bar */}
        <div className="explore-results-meta">
          <div>
            <h3>{filteredHostels.length} Stays Available</h3>
            <p>
              {userLocation 
                ? "Sorted by distance nearest to you with live Google Maps routing" 
                : "Showing verified Hyderabad listings with real coordinates & Google Maps"}
            </p>
          </div>
          <div className="view-mode-buttons">
            <button className="pill-btn-outline" onClick={openCompare}>
              ⚖️ Compare
            </button>
            <a 
              href="https://www.google.com/maps/search/hostels+in+hyderabad/@17.4474,78.3762,13z"
              target="_blank"
              rel="noopener noreferrer"
              className="pill-btn-outline"
            >
              🌐 Open All in Google Maps
            </a>
            <Link to="/map" className="pill-btn-burgundy">
              🗺️ Interactive Map
            </Link>
          </div>
        </div>

        {/* Property Grid */}
        {loading ? (
          <div className="explore-loading glass-panel">
            <div className="spinner"></div>
            <p>Loading Hyderabad stays...</p>
          </div>
        ) : (
          <div className="explore-grid">
            {filteredHostels.map((hostel) => {
              const isFav = favorites.includes(hostel.id);
              const amenities = hostel.amenities ? hostel.amenities.split(",").slice(0, 3) : [];
              const gmapsUrl = getGoogleMapsDirectionsUrl(
                hostel.latitude,
                hostel.longitude,
                userLocation?.lat,
                userLocation?.lng
              );

              return (
                <div key={hostel.id} className="explore-card glass-panel">
                  <div className="card-media-wrap">
                    <img src={hostel.image} alt={hostel.name} />
                    <div className="card-top-tags">
                      <span className="verified-badge">✓ Verified</span>
                      <span className="match-score-badge">{hostel.matchScore || 92}% Match</span>
                    </div>
                    <button 
                      className="heart-fav-btn" 
                      onClick={() => toggleFavorite(hostel.id)}
                    >
                      {isFav ? "❤️" : "🤍"}
                    </button>
                  </div>

                  <div className="card-detail-body">
                    <div className="card-sub-header">
                      <span className="type-badge">{hostel.type}</span>
                      <span className="rating-badge">⭐ {hostel.rating}</span>
                    </div>

                    <h3 className="card-title">{hostel.name}</h3>
                    <p className="card-loc">📍 {hostel.location}</p>

                    {hostel.distance !== undefined && (
                      <p className="card-distance">
                        📏 <strong>{hostel.distance.toFixed(1)} km</strong> from your location
                      </p>
                    )}

                    <div className="card-amenities-list">
                      {amenities.map((item, i) => (
                        <span key={i} className="card-amenity-chip">{item.trim()}</span>
                      ))}
                    </div>

                    <div className="card-footer-action">
                      <div>
                        <span className="rent-tiny">Rent</span>
                        <div className="rent-price-box">
                          <strong>₹{hostel.rent.toLocaleString()}</strong>
                          <small> / mo</small>
                        </div>
                      </div>

                      <div className="card-actions-group">
                        <a 
                          href={gmapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pill-btn-outline card-gmaps-link"
                          title="Open navigation directions in Google Maps"
                        >
                          🗺️ Google Maps
                        </a>
                        <Link to={`/hostel/${hostel.id}`} className="pill-btn-burgundy card-view-btn">
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Explore;