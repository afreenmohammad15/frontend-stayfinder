import React, { createContext, useContext, useState, useEffect } from "react";

const LayoutContext = createContext();

export function LayoutProvider({ children }) {
  // Sidebar collapsed state (persisted in localStorage)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem("stayfinder_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  // Mobile drawer open state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Global modals state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [addPropertyOpen, setAddPropertyOpen] = useState(false);

  // Global search input state
  const [globalSearch, setGlobalSearch] = useState("");

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("stayfinder_sidebar_collapsed", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        aiModalOpen,
        setAiModalOpen,
        openAI: () => setAiModalOpen(true),
        closeAI: () => setAiModalOpen(false),
        compareModalOpen,
        setCompareModalOpen,
        openCompare: () => setCompareModalOpen(true),
        closeCompare: () => setCompareModalOpen(false),
        addPropertyOpen,
        setAddPropertyOpen,
        openAddProperty: () => setAddPropertyOpen(true),
        closeAddProperty: () => setAddPropertyOpen(false),
        globalSearch,
        setGlobalSearch,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    // Return safe fallbacks if accessed outside provider
    return {
      sidebarCollapsed: false,
      toggleSidebar: () => {},
      mobileSidebarOpen: false,
      setMobileSidebarOpen: () => {},
      aiModalOpen: false,
      openAI: () => {},
      closeAI: () => {},
      compareModalOpen: false,
      openCompare: () => {},
      closeCompare: () => {},
      addPropertyOpen: false,
      openAddProperty: () => {},
      closeAddProperty: () => {},
      globalSearch: "",
      setGlobalSearch: () => {},
    };
  }
  return context;
}
