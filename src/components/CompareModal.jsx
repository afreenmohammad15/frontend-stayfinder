import React from "react";
import { Link } from "react-router-dom";
import { defaultProperties } from "../data/properties";
import "./CompareModal.css";

function CompareModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const compareList = defaultProperties.slice(0, 3);

  return (
    <div className="compare-overlay" onClick={onClose}>
      <div className="compare-modal-box glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="compare-header">
          <div>
            <span className="compare-tag">⚖️ Smart Comparison</span>
            <h2>Compare Properties</h2>
            <p className="subtitle">Side-by-side assessment of pricing, amenities, and stay score</p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Comparison Table */}
        <div className="compare-table-wrapper">
          <table className="compare-table">
            <thead>
              <tr>
                <th className="feature-col">Feature</th>
                {compareList.map((prop, idx) => (
                  <th key={prop.id} className="prop-col">
                    <div className="compare-prop-card">
                      {idx === 1 && <span className="best-tag">★ Best Overall</span>}
                      <img src={prop.image} alt={prop.name} />
                      <h4>{prop.name}</h4>
                      <p className="loc">📍 {prop.location}</p>
                      <strong className="rent">₹{prop.rent.toLocaleString()}/mo</strong>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="feature-label">Stay Score</td>
                {compareList.map((p) => (
                  <td key={p.id}>
                    <span className="score-badge">🏆 {p.stayScore}/100</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="feature-label">Match Score</td>
                {compareList.map((p) => (
                  <td key={p.id}>
                    <span className="match-badge">{p.matchScore}% Match</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="feature-label">Room Type</td>
                {compareList.map((p) => (
                  <td key={p.id}>{p.rooms}</td>
                ))}
              </tr>
              <tr>
                <td className="feature-label">Furnishing</td>
                {compareList.map((p) => (
                  <td key={p.id}>{p.furnished}</td>
                ))}
              </tr>
              <tr>
                <td className="feature-label">Security Deposit</td>
                {compareList.map((p) => (
                  <td key={p.id}>₹{p.deposit.toLocaleString()}</td>
                ))}
              </tr>
              <tr>
                <td className="feature-label">Food Provided</td>
                {compareList.map((p) => (
                  <td key={p.id}>{p.foodIncluded ? "✅ Included (3 Meals)" : "❌ Self Cook"}</td>
                ))}
              </tr>
              <tr>
                <td className="feature-label">High-Speed Wi-Fi</td>
                {compareList.map((p) => (
                  <td key={p.id}>{p.wifi ? "✅ Included" : "❌"}</td>
                ))}
              </tr>
              <tr>
                <td className="feature-label">Parking Available</td>
                {compareList.map((p) => (
                  <td key={p.id}>{p.parking ? "✅ Covered Parking" : "❌"}</td>
                ))}
              </tr>
              <tr>
                <td className="feature-label">Air Conditioning</td>
                {compareList.map((p) => (
                  <td key={p.id}>{p.ac ? "✅ AC Installed" : "❌ Non-AC"}</td>
                ))}
              </tr>
              <tr>
                <td className="feature-label">Rating</td>
                {compareList.map((p) => (
                  <td key={p.id}>⭐ {p.rating} ({p.reviewsCount} reviews)</td>
                ))}
              </tr>
              <tr>
                <td className="feature-label">Action</td>
                {compareList.map((p) => (
                  <td key={p.id}>
                    <Link to={`/hostel/${p.id}`} onClick={onClose} className="pill-btn-burgundy view-link">
                      View Details
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CompareModal;
