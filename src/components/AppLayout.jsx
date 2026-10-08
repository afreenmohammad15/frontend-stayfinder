import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import StayFinderAI from "./StayFinderAI";
import CompareModal from "./CompareModal";
import AddPropertyModal from "./AddPropertyModal";
import { useLayout } from "../contexts/LayoutContext";
import "./AppLayout.css";

function AppLayout() {
  const {
    sidebarCollapsed,
    aiModalOpen,
    closeAI,
    compareModalOpen,
    closeCompare,
    addPropertyOpen,
    closeAddProperty,
  } = useLayout();

  return (
    <div className={`app-shell-root ${sidebarCollapsed ? "sidebar-is-collapsed" : ""}`}>
      {/* Persistent Left Sidenavbar */}
      <Sidebar />

      {/* Main Full-Screen Viewport Area */}
      <div className="app-main-viewport">
        {/* Persistent Executive Top Navbar */}
        <Navbar />

        {/* Dynamic Route Content */}
        <main className="app-main-content-flow">
          <Outlet />
        </main>
      </div>

      {/* Global Modals (Mounted once, persistent state) */}
      <StayFinderAI isOpen={aiModalOpen} onClose={closeAI} />
      <CompareModal isOpen={compareModalOpen} onClose={closeCompare} />
      <AddPropertyModal isOpen={addPropertyOpen} onClose={closeAddProperty} />
    </div>
  );
}

export default AppLayout;
