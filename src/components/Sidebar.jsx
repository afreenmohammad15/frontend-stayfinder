import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import { useAuth } from "../contexts/AuthContext";
import { HYDERABAD_LOCALITIES } from "../data/properties";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth() || {};
  const {
    sidebarCollapsed,
    toggleSidebar,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    openAI,
    openCompare,
    openAddProperty,
  } = useLayout();

  const [localitiesExpanded, setLocalitiesExpanded] = useState(true);

  const isActive = (path) => location.pathname === path;

  const handleNavigate = (path, state = {}) => {
    navigate(path, { state });
    setMobileSidebarOpen(false);
  };

  const handleLocalityClick = (localityName) => {
    navigate("/explore", {
      state: { location: localityName === "All" ? "" : localityName },
    });
    setMobileSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          className="sidebar-mobile-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`app-sidebar ${sidebarCollapsed ? "collapsed" : ""} ${
          mobileSidebarOpen ? "mobile-open" : ""
        }`}
      >
        {/* Brand Header */}
        <div className="sidebar-brand">
          <Link
            to="/"
            className="sidebar-brand-link"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div className="sidebar-logo-icon">
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            {!sidebarCollapsed && (
              <div className="brand-text-wrap">
                <span className="brand-title">StayFinder</span>
                <span className="brand-edition">HYDERABAD PRO</span>
              </div>
            )}
          </Link>

          {/* Close button on mobile */}
          <button
            className="sidebar-mobile-close"
            onClick={() => setMobileSidebarOpen(false)}
            title="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Navigation Content */}
        <div className="sidebar-content-scroll">
          {/* Section 1: Main Pages */}
          <div className="sidebar-nav-group">
            {!sidebarCollapsed && (
              <span className="sidebar-group-title">MAIN NAVIGATION</span>
            )}

            <button
              className={`sidebar-nav-item ${isActive("/") ? "active" : ""}`}
              onClick={() => handleNavigate("/")}
              title="Home"
            >
              <span className="nav-item-icon">🏠</span>
              {!sidebarCollapsed && <span className="nav-item-label">Home</span>}
            </button>

            <button
              className={`sidebar-nav-item ${
                isActive("/explore") ? "active" : ""
              }`}
              onClick={() => handleNavigate("/explore")}
              title="Explore Hostels & PGs"
            >
              <span className="nav-item-icon">🔍</span>
              {!sidebarCollapsed && (
                <>
                  <span className="nav-item-label">Explore Stays</span>
                  <span className="nav-item-pill">14+</span>
                </>
              )}
            </button>

            <button
              className={`sidebar-nav-item ${isActive("/map") ? "active" : ""}`}
              onClick={() => handleNavigate("/map")}
              title="Interactive Map Discovery"
            >
              <span className="nav-item-icon">🗺️</span>
              {!sidebarCollapsed && (
                <>
                  <span className="nav-item-label">Map Discovery</span>
                  <span className="nav-item-live-dot" title="Live GPS"></span>
                </>
              )}
            </button>

            <button
              className={`sidebar-nav-item ${
                isActive("/dashboard") ? "active" : ""
              }`}
              onClick={() => handleNavigate("/dashboard")}
              title="Saved Stays & Dashboard"
            >
              <span className="nav-item-icon">📊</span>
              {!sidebarCollapsed && (
                <span className="nav-item-label">Dashboard</span>
              )}
            </button>
          </div>

          {/* Section 2: Hyderabad Hubs */}
          <div className="sidebar-nav-group">
            {!sidebarCollapsed && (
              <div
                className="sidebar-group-header-interactive"
                onClick={() => setLocalitiesExpanded(!localitiesExpanded)}
              >
                <span className="sidebar-group-title">HYDERABAD HUBS</span>
                <span className="group-toggle-arrow">
                  {localitiesExpanded ? "▾" : "▸"}
                </span>
              </div>
            )}

            {localitiesExpanded && (
              <div className="sidebar-localities-list">
                {HYDERABAD_LOCALITIES.slice(1, 7).map((loc) => (
                  <button
                    key={loc.name}
                    className="sidebar-sub-item"
                    onClick={() => handleLocalityClick(loc.name)}
                    title={`Hostels in ${loc.name}`}
                  >
                    <span className="sub-item-bullet">📍</span>
                    {!sidebarCollapsed && (
                      <span className="sub-item-text">{loc.name}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Smart Tools & Services */}
          <div className="sidebar-nav-group">
            {!sidebarCollapsed && (
              <span className="sidebar-group-title">INTELLIGENCE & TOOLS</span>
            )}

            <button
              className="sidebar-nav-item ai-trigger-item"
              onClick={() => {
                openAI();
                setMobileSidebarOpen(false);
              }}
              title="Ask StayFinder AI"
            >
              <span className="nav-item-icon spark-glow">✨</span>
              {!sidebarCollapsed && (
                <>
                  <span className="nav-item-label">StayFinder AI</span>
                  <span className="nav-badge-ai">GPT</span>
                </>
              )}
            </button>

            <button
              className="sidebar-nav-item"
              onClick={() => {
                openCompare();
                setMobileSidebarOpen(false);
              }}
              title="Compare Accommodations"
            >
              <span className="nav-item-icon">⚖️</span>
              {!sidebarCollapsed && (
                <span className="nav-item-label">Compare Stays</span>
              )}
            </button>

            <button
              className="sidebar-nav-item"
              onClick={() => {
                openAddProperty();
                setMobileSidebarOpen(false);
              }}
              title="List Your Hostel or PG"
            >
              <span className="nav-item-icon">➕</span>
              {!sidebarCollapsed && (
                <span className="nav-item-label">List Property</span>
              )}
            </button>

            <a
              href="https://www.google.com/maps/search/hostels+in+hyderabad/@17.4474,78.3762,13z"
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-nav-item"
              title="Open Google Maps in New Tab"
            >
              <span className="nav-item-icon">🌐</span>
              {!sidebarCollapsed && (
                <span className="nav-item-label">Google Maps Live</span>
              )}
            </a>
          </div>
        </div>

        {/* Sidebar Footer Widget */}
        <div className="sidebar-footer">
          {/* Live Location Status Indicator */}
          {!sidebarCollapsed ? (
            <div className="sidebar-gps-status">
              <span className="gps-indicator-dot"></span>
              <div>
                <strong>Hyderabad GPS Active</strong>
                <p>Showing closest hostels</p>
              </div>
            </div>
          ) : (
            <div className="sidebar-gps-icon-only" title="Hyderabad GPS Active">
              <span className="gps-indicator-dot"></span>
            </div>
          )}

          {/* User Profile / Auth Area */}
          <div className="sidebar-user-box">
            {currentUser ? (
              <div className="sidebar-user-info">
                <div className="user-avatar-circle">
                  {currentUser.displayName
                    ? currentUser.displayName[0].toUpperCase()
                    : currentUser.email
                    ? currentUser.email[0].toUpperCase()
                    : "U"}
                </div>
                {!sidebarCollapsed && (
                  <div className="user-meta-text">
                    <span className="user-name-text">
                      {currentUser.displayName ||
                        currentUser.email?.split("@")[0]}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="sidebar-signout-btn"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="sidebar-guest-box">
                <button
                  className="sidebar-signin-btn"
                  onClick={() => handleNavigate("/login")}
                >
                  <span className="user-avatar-circle guest">👤</span>
                  {!sidebarCollapsed && <span>Sign In / Register</span>}
                </button>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle Button */}
          <button
            className="sidebar-collapse-toggle-btn"
            onClick={toggleSidebar}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="toggle-chevron">
              {sidebarCollapsed ? "❯" : "❮"}
            </span>
            {!sidebarCollapsed && <span>Collapse Sidebar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
