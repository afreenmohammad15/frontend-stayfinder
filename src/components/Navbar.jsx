import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLayout } from "../contexts/LayoutContext";
import "./Navbar.css";

function Navbar({ onOpenAI, onOpenCompare, onOpenAddProperty }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth() || {};
  const {
    sidebarCollapsed,
    toggleSidebar,
    setMobileSidebarOpen,
    openAI: layoutOpenAI,
    openCompare: layoutOpenCompare,
    openAddProperty: layoutOpenAddProperty,
  } = useLayout();

  const [searchInput, setSearchInput] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Fallback to layout context actions if props are not passed
  const handleOpenAI = onOpenAI || layoutOpenAI;
  const handleOpenCompare = onOpenCompare || layoutOpenCompare;
  const handleOpenAddProperty = onOpenAddProperty || layoutOpenAddProperty;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate("/explore", { state: { location: searchInput.trim() } });
    } else {
      navigate("/explore");
    }
  };

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      setProfileDropdownOpen(false);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="stayfinder-top-navbar">
      <div className="navbar-inner-full">
        {/* LEFT SECTION: Sidebar Toggle & Location Badge */}
        <div className="navbar-left-cluster">
          {/* Desktop Sidebar Toggle */}
          <button
            className="navbar-icon-btn sidebar-toggle-btn"
            onClick={toggleSidebar}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label="Toggle sidebar"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
              <path d="M14 9l3 3-3 3"></path>
            </svg>
          </button>

          {/* Mobile Drawer Button */}
          <button
            className="navbar-icon-btn mobile-drawer-btn"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open mobile menu"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {/* Location Badge */}
          <div
            className="navbar-city-pill"
            onClick={() => navigate("/explore")}
            title="Active City: Hyderabad, Telangana (Click to Explore)"
          >
            <span className="live-dot-pulse"></span>
            <span className="city-pin">📍</span>
            <div className="city-text-stack">
              <strong className="city-title">Hyderabad</strong>
              <small className="city-sub">HITEC & IT Hub</small>
            </div>
          </div>
        </div>

        {/* CENTER SECTION: Executive OmniSearch Input */}
        <form className="navbar-omnisearch-form" onSubmit={handleSearchSubmit}>
          <div className="omnisearch-input-wrapper">
            <span className="search-icon-adornment">🔍</span>
            <input
              type="text"
              className="omnisearch-field"
              placeholder="Search hostels, PGs, localities (e.g. Madhapur, Gachibowli, HITEC City)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              type="submit"
              className="omnisearch-enter-pill"
              title="Search Stays"
            >
              Search ↵
            </button>
          </div>
        </form>

        {/* RIGHT SECTION: Quick Tools, Actions & Profile */}
        <div className="navbar-right-cluster">
          {/* AI Assistant Quick Pill */}
          <button
            type="button"
            className="navbar-ai-button"
            onClick={handleOpenAI}
            title="Ask StayFinder AI"
          >
            <span className="spark-emoji">✨</span>
            <span className="ai-btn-text">AI Concierge</span>
          </button>

          {/* Compare Button */}
          <button
            type="button"
            className="navbar-icon-pill"
            onClick={handleOpenCompare}
            title="Compare Properties"
          >
            <span className="icon-symbol">⚖️</span>
            <span className="action-label-desktop">Compare</span>
          </button>

          {/* Interactive Map View */}
          <Link
            to="/map"
            className={`navbar-icon-pill ${
              location.pathname === "/map" ? "active" : ""
            }`}
            title="Explore Hyderabad on Map"
          >
            <span className="icon-symbol">🗺️</span>
            <span className="action-label-desktop">Map</span>
          </Link>

          {/* List Property CTA */}
          <button
            type="button"
            className="pill-btn-burgundy navbar-list-btn"
            onClick={handleOpenAddProperty}
          >
            <span className="plus-sign">+</span>
            <span>List Stay</span>
          </button>

          {/* User Profile / Sign In */}
          {currentUser ? (
            <div className="navbar-profile-rel">
              <button
                className="navbar-user-avatar-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                title={currentUser.email}
              >
                <span className="avatar-letter">
                  {currentUser.displayName
                    ? currentUser.displayName[0].toUpperCase()
                    : currentUser.email
                    ? currentUser.email[0].toUpperCase()
                    : "U"}
                </span>
              </button>

              {profileDropdownOpen && (
                <div className="profile-dropdown-menu glass-panel">
                  <div className="dropdown-user-header">
                    <strong>
                      {currentUser.displayName || "Verified User"}
                    </strong>
                    <small>{currentUser.email}</small>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link
                    to="/dashboard"
                    className="dropdown-item"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    📊 My Dashboard
                  </Link>
                  <Link
                    to="/explore"
                    className="dropdown-item"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    🔍 Saved Stays
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar-signin-pill">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
