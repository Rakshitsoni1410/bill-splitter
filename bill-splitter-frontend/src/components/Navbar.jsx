import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      style={{
        background: "var(--card)",
        borderBottom: "1px solid var(--border)",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Logo */}
      <Link
        to="/dashboard"
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "linear-gradient(135deg, #6c63ff, #ff6584)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.1rem",
          }}
        >
          💸
        </div>
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "var(--text)",
          }}
        >
          BillSplitter
        </span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {[
          { path: "/dashboard", label: "🏠 Home" },
          { path: "/wallet", label: "💳 Wallet" },
        ].map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              textDecoration: "none",
              color: isActive(path) ? "#fff" : "var(--muted)",
              background: isActive(path) ? "var(--accent)" : "transparent",
              fontWeight: 500,
              fontSize: "0.9rem",
              transition: "all 0.2s",
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            cursor: "pointer",
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {/* User */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6c63ff, #ff6584)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.85rem",
            }}
          >
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <span
            style={{
              fontSize: "0.9rem",
              fontWeight: 500,
              color: "var(--text)",
            }}
            className="hide-mobile"
          >
            {user.name}
          </span>
        </div>

        <button onClick={logout} className="btn btn-outline btn-sm">
          Logout
        </button>
      </div>
    </nav>
  );
}
