import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import InterviewSimulator from "./pages/InterviewSimulator.jsx";
import InterviewChat from "./pages/InterviewChat.jsx";
import InterviewHistory from "./pages/InterviewHistory.jsx";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login theme={theme} setTheme={setTheme} />} />
        <Route path="/register" element={<Register theme={theme} setTheme={setTheme} />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard theme={theme} setTheme={setTheme} />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile theme={theme} setTheme={setTheme} />
            </PrivateRoute>
          }
        />

        <Route
          path="/interview"
          element={
            <PrivateRoute>
              <InterviewSimulator theme={theme} setTheme={setTheme} />
            </PrivateRoute>
          }
        />

        <Route
          path="/interview/:id"
          element={
            <PrivateRoute>
              <InterviewChat theme={theme} setTheme={setTheme} />
            </PrivateRoute>
          }
        />

        <Route
          path="/interview-history"
          element={
            <PrivateRoute>
              <InterviewHistory theme={theme} setTheme={setTheme} />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}