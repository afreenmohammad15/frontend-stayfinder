import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { defaultProperties } from "../data/properties";
import { useAuth } from "../contexts/AuthContext";
import { useLayout } from "../contexts/LayoutContext";
import "./Dashboard.css";

const API_URL = "http://localhost:8080/api/hostels";

function Dashboard() {
  const { currentUser, userProfile } = useAuth() || {};
  const { openAI } = useLayout();
  const [allHostels, setAllHostels] = useState(defaultProperties);

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("stayfinderFavorites");
      return saved ? JSON.parse(saved) : [1, 2];
    } catch {
      return [1, 2];
    }
  });

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    fetch(API_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Backend not available");
        return res.json();
      })
      .then((data) => {
        clearTimeout(timeoutId);
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item, idx) => ({
            ...defaultProperties[idx % defaultProperties.length],
            ...item,
            image: item.imageUrl || item.image || defaultProperties[idx % defaultProperties.length].image
          }));
          setAllHostels(mapped);
        }
      })
      .catch(() => {
        clearTimeout(timeoutId);
        setAllHostels(defaultProperties);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const savedProperties = allHostels.filter((hostel) =>
    favorites.includes(hostel.id)
  );

  const removeFavorite = (id) => {
    const updated = favorites.filter((favId) => favId !== id);
    setFavorites(updated);
    localStorage.setItem("stayfinderFavorites", JSON.stringify(updated));
  };

  const handlePropertyAdded = (newProp) => {
    setAllHostels((prev) => [
      {
        ...newProp,
        image: newProp.imageUrl || newProp.image || defaultProperties[0].image
      },
      ...prev
    ]);
  };

  return (
    <div className="dashboard-page">
      <main className="dashboard-container">
        {/* WELCOME */}
        <div className="dashboard-welcome glass-panel">
          <div className="dash-user-badge">
            <div className="dash-avatar">
              {(currentUser?.displayName || userProfile?.fullName || currentUser?.email || "U")[0].toUpperCase()}
            </div>
            <div>
              <p className="dash-greeting">
                Welcome back, <strong>{currentUser?.displayName || userProfile?.fullName || currentUser?.email?.split("@")[0] || "Guest"}</strong> 👋
              </p>
              <p className="dash-sub">Here are your personalized recommendations and saved stays.</p>
            </div>
          </div>

          <div className="dash-stats-row">
            <div className="stat-card glass-pill">
              <span className="stat-num">{favorites.length}</span>
              <span className="stat-label">Saved Stays</span>
            </div>
            <div className="stat-card glass-pill">
              <span className="stat-num">2</span>
              <span className="stat-label">Active Visits</span>
            </div>
            <div className="stat-card glass-pill">
              <span className="stat-num">95%</span>
              <span className="stat-label">Best Match</span>
            </div>
          </div>
        </div>

        {/* SAVED PROPERTIES */}
        <section className="dash-section">
          <div className="section-head-bar">
            <h2>Your Saved Properties ({savedProperties.length})</h2>
            <Link to="/explore" className="dash-link">Browse More →</Link>
          </div>

          {savedProperties.length === 0 ? (
            <div className="empty-favorites-box glass-panel">
              <span className="empty-icon">🤍</span>
              <h3>No saved stays yet</h3>
              <p>Explore properties and click the heart icon to save them for quick access.</p>
              <Link to="/explore" className="pill-btn-burgundy">Explore Stays Now</Link>
            </div>
          ) : (
            <div className="dash-props-grid">
              {savedProperties.map((prop) => (
                <div key={prop.id} className="dash-card glass-panel">
                  <div className="dash-card-media">
                    <img src={prop.image} alt={prop.name} />
                    <span className="dash-badge-verified">✓ Verified</span>
                    <button 
                      className="dash-remove-btn" 
                      onClick={() => removeFavorite(prop.id)}
                      title="Remove from saved"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="dash-card-info">
                    <div className="dash-meta-row">
                      <span className="type-lbl">{prop.type}</span>
                      <span className="star-lbl">⭐ {prop.rating}</span>
                    </div>
                    <h4>{prop.name}</h4>
                    <p className="loc-p">📍 {prop.location}</p>
                    <div className="dash-bottom-row">
                      <strong>₹{prop.rent.toLocaleString()}/mo</strong>
                      <Link to={`/hostel/${prop.id}`} className="pill-btn-burgundy mini-btn">
                        Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RECOMMENDED FOR YOU */}
        <section className="dash-section">
          <div className="section-head-bar">
            <h2>Recommended Stays Near You</h2>
            <button className="link-text-btn" onClick={openAI}>
              Ask AI for More ✨
            </button>
          </div>

          <div className="dash-props-grid">
            {allHostels.slice(0, 3).map((prop) => (
              <div key={prop.id} className="dash-card glass-panel">
                <div className="dash-card-media">
                  <img src={prop.image} alt={prop.name} />
                  <span className="dash-match-badge">{prop.matchScore || 92}% Match</span>
                </div>
                <div className="dash-card-info">
                  <div className="dash-meta-row">
                    <span className="type-lbl">{prop.type}</span>
                    <span className="star-lbl">⭐ {prop.rating}</span>
                  </div>
                  <h4>{prop.name}</h4>
                  <p className="loc-p">📍 {prop.location}</p>
                  <div className="dash-bottom-row">
                    <strong>₹{prop.rent.toLocaleString()}/mo</strong>
                    <Link to={`/hostel/${prop.id}`} className="pill-btn-outline mini-btn">
                      View Stay
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;