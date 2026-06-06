import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import GroupPage from "./pages/GroupPage";
import Wallet from "./pages/Wallet";
import Navbar from "./components/Navbar";
import Splash from "./components/Splash";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [showSplash, setShowSplash] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  if (showSplash) return <Splash />;

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        theme={theme}
        toastStyle={{
          background: "var(--card)",
          color: "var(--text)",
          border: "1px solid var(--border)",
        }}
      />
      {token && <Navbar theme={theme} toggleTheme={toggleTheme} />}
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login toggleTheme={toggleTheme} theme={theme} />
            )
          }
        />
        <Route
          path="/register"
          element={
            token ? (
              <Navigate to="/dashboard" />
            ) : (
              <Register toggleTheme={toggleTheme} theme={theme} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/group/:id"
          element={token ? <GroupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/wallet"
          element={token ? <Wallet /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
