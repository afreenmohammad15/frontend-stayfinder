import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LayoutProvider } from "./contexts/LayoutContext";
import AppLayout from "./components/AppLayout";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import HostelDetails from "./pages/HostelDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LiveLocation from "./pages/LiveLocation";
import MapView from "./pages/MapView";

function App() {
  return (
    <BrowserRouter>
      <LayoutProvider>
        <Routes>
          {/* Main Full-Screen Layout with Persistent Side Navbar & Professional Top Bar */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/hostel/:id" element={<HostelDetails />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/location" element={<LiveLocation />} />
          </Route>

          {/* Standalone Authentication Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </LayoutProvider>
    </BrowserRouter>
  );
}

export default App;