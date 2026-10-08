import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Comments from "../components/Comments";
import { useLayout } from "../contexts/LayoutContext";
import { defaultProperties } from "../data/properties";
import "./HostelDetails.css";

const API_URL = "http://localhost:8080/api/hostels";

function HostelDetails() {
  const { id } = useParams();
  const { openCompare } = useLayout();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isSaved, setIsSaved] = useState(false);
  const [bookingSent, setBookingSent] = useState(false);

  useEffect(() => {
    // Attempt fetch from backend; fallback to rich mock data if not available
    const numericId = parseInt(id, 10);
    const mockMatch = defaultProperties.find((p) => p.id === numericId) || defaultProperties[0];

    fetch(`${API_URL}/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Backend not reached");
        return res.json();
      })
      .then((data) => {
        // Merge API data with rich imagery and stayfinder attributes
        setProperty({
          ...mockMatch,
          ...data,
          image: data.imageUrl || data.image || mockMatch.image,
          gallery: data.imageUrl ? [data.imageUrl, ...mockMatch.gallery] : mockMatch.gallery
        });
        setLoading(false);
      })
      .catch(() => {
        // Use default high quality property
        setProperty(mockMatch);
        setLoading(false);
      });
  }, [id]);

  if (loading || !property) {
    return (
      <div className="details-container">
        <div className="loading-state glass-panel">
          <div className="spinner"></div>
          <h2>Loading Stay Details...</h2>
        </div>
      </div>
    );
  }

  const galleryImages = property.gallery && property.gallery.length > 0 
    ? property.gallery 
    : [property.image];

  const amenitiesList = property.amenities 
    ? property.amenities.split(",").map((s) => s.trim()) 
    : [];

  return (
    <div className="details-container">

      <main className="details-main-content">
        {/* Breadcrumb Navigation */}
        <div className="breadcrumbs">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/explore">Hyderabad</Link>
          <span>/</span>
          <span className="current">{property.name}</span>
        </div>

        {/* Title & Top Badges Header */}
        <div className="details-top-header">
          <div>
            <div className="badges-line">
              <span className="badge-verified-owner">✓ Verified Property</span>
              <span className="badge-stay-type">{property.type}</span>
              <span className="badge-rating-top">⭐ {property.rating} ({property.reviewsCount || 120} reviews)</span>
            </div>
            <h1 className="property-heading">{property.name}</h1>
            <p className="property-subloc">📍 {property.location}</p>
          </div>

          <div className="quick-action-header-buttons">
            <button 
              className={`pill-btn-outline ${isSaved ? "active-saved" : ""}`}
              onClick={() => setIsSaved(!isSaved)}
            >
              {isSaved ? "❤️ Saved" : "🤍 Save Stay"}
            </button>
            <button 
              className="pill-btn-outline" 
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }}
            >
              🔗 Share
            </button>
          </div>
        </div>

        {/* HERO PHOTO GALLERY (REAL TIME PICS) */}
        <div className="photo-gallery-section glass-panel">
          <div className="main-photo-viewport">
            <img 
              src={galleryImages[activeImageIndex]} 
              alt={property.name} 
              className="main-display-photo" 
            />
            <div className="photo-pill-tag">
              📸 Real Photo {activeImageIndex + 1} of {galleryImages.length}
            </div>
          </div>

          <div className="thumbnail-strip">
            {galleryImages.map((imgUrl, idx) => (
              <div 
                key={idx} 
                className={`thumbnail-item ${activeImageIndex === idx ? "active" : ""}`}
                onClick={() => setActiveImageIndex(idx)}
              >
                <img src={imgUrl} alt={`Room preview ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* TWO COLUMN CONTENT LAYOUT */}
        <div className="property-grid-layout">
          {/* Left Column: Details, Score, Amenities */}
          <div className="left-details-column">
            {/* Nav Tabs */}
            <div className="details-tabs-bar glass-pill">
              {["Overview", "Amenities", "Match Analysis", "Reviews & Comments"].map((tab) => (
                <button
                  key={tab}
                  className={`detail-tab-btn ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: Overview */}
            {activeTab === "Overview" && (
              <>
                {/* MATCH SCORE & STAY SCORE CARD */}
                <div className="match-score-card glass-panel">
                  <div className="match-score-header">
                    <div>
                      <span className="score-tag">StayFinder Intelligence</span>
                      <h3>Is this the right stay for you?</h3>
                    </div>
                  </div>

                  <div className="score-metrics-row">
                    {/* Circular Match Gauge */}
                    <div className="radial-metric-box">
                      <div className="donut-circle">
                        <span className="percent-val">{property.matchScore || 92}%</span>
                        <span className="percent-lbl">Match</span>
                      </div>
                      <p className="metric-desc">Based on your budget & lifestyle</p>
                    </div>

                    {/* Why StayFinder Recommends */}
                    <div className="why-recommends-box">
                      <h4>Why StayFinder recommends this:</h4>
                      <ul className="recommendations-list">
                        {(property.whyRecommended || [
                          "Within your specified budget",
                          "High-speed fiber Wi-Fi included",
                          "Prime connectivity to public transit",
                          "Rated 4.7+ by verified tenants"
                        ]).map((item, idx) => (
                          <li key={idx}>
                            <span className="check-bullet">✔</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Stay Score breakdown */}
                    <div className="stay-score-breakdown">
                      <div className="stay-score-badge">
                        <span className="score-num">{property.stayScore || 93}</span>
                        <span className="score-text">Stay Score</span>
                      </div>
                      <div className="breakdown-bars">
                        <div className="bar-row">
                          <span>Location</span>
                          <div className="bar-bg"><div className="bar-fill" style={{ width: "94%" }}></div></div>
                          <strong>94%</strong>
                        </div>
                        <div className="bar-row">
                          <span>Cleanliness</span>
                          <div className="bar-bg"><div className="bar-fill" style={{ width: "92%" }}></div></div>
                          <strong>92%</strong>
                        </div>
                        <div className="bar-row">
                          <span>Value for Money</span>
                          <div className="bar-bg"><div className="bar-fill" style={{ width: "96%" }}></div></div>
                          <strong>96%</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ABOUT THIS STAY */}
                <div className="about-stay-card glass-panel">
                  <h3>About {property.name}</h3>
                  <p className="description-text">
                    {property.description || 
                      "Experience comfort and convenience at this verified property. Designed with modern aesthetics, ergonomic work desks, warm natural light, and premium bedding. Ideal for working professionals, students, and digital nomads looking for a seamless stay."
                    }
                  </p>
                  
                  <div className="property-highlights-row">
                    <div className="highlight-pill">
                      <span>🛏️</span>
                      <div>
                        <strong>Room Type</strong>
                        <p>{property.rooms || "Private Room"}</p>
                      </div>
                    </div>
                    <div className="highlight-pill">
                      <span>🛋️</span>
                      <div>
                        <strong>Furnishing</strong>
                        <p>{property.furnished || "Fully Furnished"}</p>
                      </div>
                    </div>
                    <div className="highlight-pill">
                      <span>🍽️</span>
                      <div>
                        <strong>Food Option</strong>
                        <p>{property.foodIncluded ? "3 Meals Included" : "Self-Cooking Kitchen"}</p>
                      </div>
                    </div>
                    <div className="highlight-pill">
                      <span>🛡️</span>
                      <div>
                        <strong>Deposit</strong>
                        <p>₹{(property.deposit || property.rent * 2).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB CONTENT: Amenities */}
            {(activeTab === "Amenities" || activeTab === "Overview") && (
              <div className="amenities-card glass-panel">
                <h3>Included Amenities</h3>
                <div className="amenities-icons-grid">
                  {amenitiesList.map((item, idx) => (
                    <div key={idx} className="amenity-item-box">
                      <span className="amenity-check">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GOOGLE MAPS LOCATION & DIRECTIONS */}
            <div className="gmaps-location-card glass-panel" style={{ marginTop: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <span className="score-tag">Google Maps Location</span>
                  <h3 style={{ margin: "4px 0" }}>Map & Directions</h3>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)" }}>📍 {property.location}</p>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill-btn-outline"
                    style={{ textDecoration: "none", color: "#1a73e8", borderColor: "#1a73e8", fontSize: "0.84rem", padding: "8px 16px" }}
                  >
                    🚗 Open in Google Maps
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.name + ', ' + property.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill-btn-burgundy"
                    style={{ textDecoration: "none", fontSize: "0.84rem", padding: "8px 16px" }}
                  >
                    🗺️ View Street Map
                  </a>
                </div>
              </div>
              <div style={{ width: "100%", height: "300px", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(126,25,51,0.12)" }}>
                <iframe
                  title={`Google Maps for ${property.name}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&hl=en&z=15&output=embed`}
                />
              </div>
            </div>

            {/* TAB CONTENT: Reviews & Localhost Comments */}
            {(activeTab === "Reviews & Comments" || activeTab === "Overview") && (
              <div className="comments-integration-card glass-panel">
                <h3>Tenant Reviews & Discussion</h3>
                <p className="comments-intro">Real-time comments from residents and prospective tenants.</p>
                <Comments />
              </div>
            )}
          </div>

          {/* Right Column: Pricing & Booking Action Card */}
          <div className="right-booking-column">
            <div className="booking-action-card glass-panel">
              <div className="pricing-header">
                <div>
                  <span className="rent-label">Monthly Rent</span>
                  <div className="big-price">
                    <strong>₹{property.rent.toLocaleString()}</strong>
                    <span className="unit"> / month</span>
                  </div>
                </div>
                <span className="all-bills-badge">Bills Included</span>
              </div>

              <div className="deposit-info-row">
                <span>Security Deposit</span>
                <strong>₹{(property.deposit || property.rent * 2).toLocaleString()}</strong>
              </div>

              {/* Action Buttons */}
              <div className="booking-buttons-stack">
                <button 
                  className="pill-btn-burgundy full-width-btn"
                  onClick={() => setBookingSent(true)}
                >
                  {bookingSent ? "✓ Enquiry Sent Successfully!" : "Schedule a Visit"}
                </button>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-btn-outline full-width-btn"
                  style={{ textAlign: "center", textDecoration: "none", color: "#1a73e8", borderColor: "#1a73e8", fontWeight: 700 }}
                >
                  🗺️ Google Maps Directions
                </a>

                <button 
                  className="pill-btn-outline full-width-btn"
                  onClick={() => {
                    alert(`Contacting Owner (${property.owner?.name || "Host"}): ${property.owner?.phone || "+91 98490 23456"}`);
                  }}
                >
                  📞 Contact Owner
                </button>

                <button 
                  className="compare-trigger-btn"
                  onClick={openCompare}
                >
                  ⚖️ Compare with other stays
                </button>
              </div>

              {/* Owner Info Box */}
              <div className="owner-mini-card">
                <div className="owner-avatar">
                  {property.owner?.name ? property.owner.name[0] : "O"}
                </div>
                <div>
                  <strong>{property.owner?.name || "Ramesh Sharma"}</strong>
                  <p className="owner-tag">Verified Property Host • {property.owner?.responseRate || "10 min response"}</p>
                </div>
              </div>

              <div className="safety-guarantee">
                <span>🔒</span>
                <p>StayFinder Guarantee: 100% verified listing with zero brokerage fees.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HostelDetails;