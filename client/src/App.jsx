import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Timetable from "./pages/Timetable";
import DeanApproval from "./pages/DeanApproval";
import Dashboard from "./pages/Dashboard";
import Add from "./pages/Add";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Faculty */}
          <Route path="/faculty/timetable" element={<Timetable />} />

          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Add */}
          <Route path="/add" element={<Add />} />

          {/* Dean Approval */}
          <Route path="/dean-approval" element={<DeanApproval />} />

          {/* Any unknown URL */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;