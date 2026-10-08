import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import { defaultProperties, propertyCategories } from "../data/properties";
import "./Home.css";

const API_URL = "http://localhost:8080/api/hostels";

function Home() {
  const navigate = useNavigate();
  const { openAI, openCompare } = useLayout();

  // Properties from backend or default
  const [properties, setProperties] = useState(defaultProperties);
  const [loadingBackend, setLoadingBackend] = useState(true);

  // Search Bar State
  const [location, setLocation] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [duration, setDuration] = useState("1 month");
  const [guests, setGuests] = useState("1 Guest");
  const [locationLoading, setLocationLoading] = useState(false);

  // Filter for Popular Stays
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch properties from Spring Boot backend on mount
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
          setProperties(mapped);
        }
        setLoadingBackend(false);
      })
      .catch(() => {
        // Fallback to rich default properties
        setProperties(defaultProperties);
        setLoadingBackend(false);
      });
  }, []);

  const handlePropertyAdded = (newProp) => {
    setProperties((prev) => [
      {
        ...newProp,
        image: newProp.imageUrl || newProp.image || defaultProperties[0].image
      },
      ...prev
    ]);
  };

  // Favorites
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("stayfinderFavorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

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

  const getLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Location is not supported by your browser.");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`📍 Hyderabad (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`);
        setLocationLoading(false);
      },
      () => {
        // Fallback to HITEC City
        setLocation("📍 HITEC City, Hyderabad");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSearch = () => {
    navigate("/explore", {
      state: {
        location,
        duration,
        guests
      }
    });
  };

  // Filtered properties for popular section
  const filteredPopular = properties.filter((item) => {
    if (selectedCategory === "All") return true;
    if (selectedCategory === "PGs") return item.type === "PG";
    if (selectedCategory === "Apartments") return item.type === "Apartment";
    if (selectedCategory === "Hostels") return item.type === "Hostel";
    if (selectedCategory === "Co-living") return item.type === "Co-living";
    if (selectedCategory === "Serviced Apartments") return item.type === "Serviced Apartments";
    return true;
  });

  return (
    <div className="home-container">
      {/* HERO SECTION / FIRST SLIDE WITH BACKGROUND PIC */}
      <section className="hero-slide-wrapper">
        <div 
          className="hero-slide-card"
          style={{
            backgroundImage: `linear-gradient(175deg, rgba(12, 8, 14, 0.18) 0%, rgba(12, 8, 14, 0.52) 45%, rgba(12, 8, 14, 0.92) 100%), url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1920&q=90')`
          }}
        >
          <div className="hero-slide-content">
            <h1 className="hero-slide-title">
              Find a Stay <br />
              That <span className="serif-gradient-highlight">Feels Like Home</span>
            </h1>

            <p className="hero-slide-subtitle">
              Verified hostels, PGs, and apartments across Hyderabad — HITEC City, Madhapur, Gachibowli & Kondapur.
            </p>

            {/* FLOATING GLASS SEARCH BAR */}
            <div className="hero-glass-search glass-panel">
              <div className="search-field-segment">
                <label className="field-label">Where in Hyderabad?</label>
                <div className="input-with-action">
                  <input 
                    type="text" 
                    placeholder="Locality (e.g., Madhapur, Gachibowli, HITEC City, Kondapur)..." 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="gps-btn" 
                    onClick={getLiveLocation}
                    title="Detect live location"
                  >
                    {locationLoading ? "..." : "📍"}
                  </button>
                </div>
              </div>

              <div className="divider-line"></div>

              <div className="search-field-segment">
                <label className="field-label">Move-in / Check-in</label>
                <input 
                  type="date" 
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="date-input"
                />
              </div>

              <div className="divider-line"></div>

              <div className="search-field-segment">
                <label className="field-label">Stay Duration</label>
                <select 
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value)}
                  className="select-field"
                >
                  <option value="1 month">1 month</option>
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                  <option value="1 year+">Long term (1 yr+)</option>
                </select>
              </div>

              <div className="divider-line"></div>

              <div className="search-field-segment">
                <label className="field-label">Guests</label>
                <select 
                  value={guests} 
                  onChange={(e) => setGuests(e.target.value)}
                  className="select-field"
                >
                  <option value="1 Guest">1 Guest</option>
                  <option value="2 Guests">2 Guests</option>
                  <option value="3+ Guests">3+ Guests</option>
                </select>
              </div>

              <button className="search-action-btn pill-btn-burgundy" onClick={handleSearch}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                Search
              </button>
            </div>

            {/* AI BANNER & VERIFIED COUNTER */}
            <div className="hero-sub-banner-row">
              <button 
                type="button" 
                className="ai-banner-pill"
                onClick={openAI}
              >
                <span className="spark-emoji">✨</span>
                <span className="ai-text">Ask StayFinder AI to Decide</span>
              </button>

              <div className="verified-badge-stack glass-pill hero-glass-light">
                <div className="avatar-group">
                  <span className="avatar-dot" style={{ backgroundColor: "#8C1D40" }}>S</span>
                  <span className="avatar-dot" style={{ backgroundColor: "#10B981" }}>A</span>
                  <span className="avatar-dot" style={{ backgroundColor: "#3B82F6" }}>R</span>
                </div>
                <span className="verified-text">
                  <strong>1,200+ Verified properties</strong> in 50+ cities
                </span>
              </div>
            </div>

            {/* TRUST HIGHLIGHTS BAR */}
            <div className="trust-highlights-row hero-trust-row">
              <div className="trust-badge glass-pill hero-glass-pill">
                <span className="trust-icon">🛡️</span>
                <span>Verified Properties</span>
              </div>
              <div className="trust-badge glass-pill hero-glass-pill">
                <span className="trust-icon">🤝</span>
                <span>Trusted Owners</span>
              </div>
              <div className="trust-badge glass-pill hero-glass-pill">
                <span className="trust-icon">🏷️</span>
                <span>Transparent Pricing</span>
              </div>
              <div className="trust-badge glass-pill hero-glass-pill">
                <span className="trust-icon">📸</span>
                <span>Real Photos</span>
              </div>
              <div className="trust-badge glass-pill hero-glass-pill">
                <span className="trust-icon">⭐</span>
                <span>Genuine Reviews</span>
              </div>
              <div className="trust-badge glass-pill hero-glass-pill">
                <span className="trust-icon">🔒</span>
                <span>Secure Enquiries</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FIND YOUR IDEAL STAY (CATEGORY CARDS) */}
      <section className="categories-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Find Your Ideal Stay</h2>
            <p className="section-subtitle">Curated categories tailored for your specific lifestyle and budget</p>
          </div>
        </div>

        <div className="categories-grid">
          {propertyCategories.map((cat) => (
            <div 
              key={cat.id} 
              className="category-card glass-panel"
              onClick={() => {
                navigate("/explore", { state: { type: cat.typeFilter } });
              }}
            >
              <div className="category-image-wrap">
                <img src={cat.image} alt={cat.name} />
              </div>
              <div className="category-meta">
                <h3>{cat.name}</h3>
                <p>{cat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR STAYS NEAR YOU */}
      <section className="popular-section">
        <div className="popular-header-row">
          <div>
            <h2 className="section-title">Popular Stays Near You</h2>
            <p className="section-subtitle">Highest rated rooms, apartments and hostels in prime locations</p>
          </div>
          <Link to="/explore" className="view-all-link">
            View All Stays →
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="category-tabs-bar">
          {["All", "PGs", "Apartments", "Hostels", "Co-living", "Serviced Apartments"].map((tab) => (
            <button
              key={tab}
              className={`tab-pill ${selectedCategory === tab ? "active" : ""}`}
              onClick={() => setSelectedCategory(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Property Cards Grid */}
        <div className="stays-grid">
          {filteredPopular.map((prop) => {
            const isFav = favorites.includes(prop.id);
            return (
              <div key={prop.id} className="property-card glass-panel">
                <div className="property-image-container">
                  <img src={prop.image} alt={prop.name} className="property-card-img" />
                  <div className="top-badges-row">
                    <span className="badge-verified">✓ Verified</span>
                    <span className="badge-match">{prop.matchScore}% Match</span>
                  </div>
                  <button 
                    className="fav-icon-btn" 
                    onClick={() => toggleFavorite(prop.id)}
                    aria-label="Add to favorites"
                  >
                    {isFav ? "❤️" : "🤍"}
                  </button>
                </div>

                <div className="property-card-body">
                  <div className="rating-location-row">
                    <span className="rating-pill">⭐ {prop.rating} ({prop.reviewsCount})</span>
                    <span className="stay-type-pill">{prop.type}</span>
                  </div>

                  <h3 className="property-name">{prop.name}</h3>
                  <p className="property-location">📍 {prop.location}</p>

                  <div className="amenities-tags">
                    {prop.amenities.split(",").slice(0, 3).map((a, i) => (
                      <span key={i} className="amenity-tag">{a.trim()}</span>
                    ))}
                    <span className="amenity-tag">+{prop.amenities.split(",").length - 3} more</span>
                  </div>

                  <div className="property-card-footer">
                    <div>
                      <span className="price-label">Rent</span>
                      <div className="price-tag">
                        <strong>₹{prop.rent.toLocaleString()}</strong>
                        <span className="month-unit"> / month</span>
                      </div>
                    </div>
                    <div className="card-buttons-group">
                      <button 
                        type="button" 
                        className="btn-compare-mini"
                        onClick={openCompare}
                        title="Compare stay"
                      >
                        ⚖️
                      </button>
                      <Link to={`/hostel/${prop.id}`} className="pill-btn-burgundy details-btn">
                        Details →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="stayfinder-footer">
        <div className="footer-inner glass-panel">
          <div className="footer-brand-col">
            <div className="footer-logo">
              🏠 <strong>StayFinder</strong>
            </div>
            <p>Smart, transparent discovery of hostels, PGs, and premium apartments with real-time verified data.</p>
          </div>
          <div className="footer-links-grid">
            <div>
              <h4>Explore</h4>
              <Link to="/explore">All Hostels & PGs</Link>
              <Link to="/map">Map Discovery</Link>
              <button className="link-button" onClick={openAI}>AI Assistant</button>
            </div>
            <div>
              <h4>Company</h4>
              <Link to="/">About Us</Link>
              <Link to="/register">Partner With Us</Link>
              <Link to="/login">Owner Portal</Link>
            </div>
            <div>
              <h4>Trust & Safety</h4>
              <a href="#verified">Verification Process</a>
              <a href="#terms">Terms of Service</a>
              <a href="#privacy">Privacy Policy</a>
            </div>
          </div>
        </div>
        <p className="copyright-text">© 2026 StayFinder. All rights reserved. Beautiful Glassmorphism UI.</p>
      </footer>
    </div>
  );
}

export default Home;