import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";

export default function Login({ toggleTheme, theme }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/users/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: res.data.name,
          email: res.data.email,
          userId: res.data.userId,
        }),
      );
      toast.success("Welcome back! 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "var(--bg)",
      }}
    >
      {/* Left Panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background blobs */}
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(108,99,255,0.15), transparent)",
            top: "10%",
            left: "10%",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,101,132,0.1), transparent)",
            bottom: "20%",
            right: "15%",
            filter: "blur(30px)",
          }}
        />

        <div
          style={{
            width: "100%",
            maxWidth: 400,
            position: "relative",
            animation: "fadeUp 0.6s ease",
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "linear-gradient(135deg, #6c63ff, #ff6584)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                margin: "0 auto 16px",
                boxShadow: "0 8px 24px rgba(108,99,255,0.3)",
                animation: "float 3s ease-in-out infinite",
              }}
            >
              💸
            </div>
            <h1
              style={{
                fontFamily: "Syne",
                fontSize: "1.8rem",
                fontWeight: 800,
                marginBottom: 6,
              }}
            >
              Welcome back
            </h1>
            <p style={{ color: "var(--muted)" }}>
              Sign in to your BillSplitter account
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              style={{ marginTop: 8, padding: "14px" }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" /> Signing in...
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: 24,
              color: "var(--muted)",
              fontSize: "0.9rem",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "var(--accent)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign up free
            </Link>
          </p>

          {/* Theme toggle */}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button
              onClick={toggleTheme}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted)",
                fontSize: "0.85rem",
              }}
            >
              {theme === "dark" ? "☀️ Light mode" : "🌙 Dark mode"}
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Hero */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6c63ff 0%, #ff6584 100%)",
          padding: 40,
          color: "#fff",
        }}
        className="hide-mobile"
      >
        <div
          style={{
            maxWidth: 400,
            textAlign: "center",
            animation: "fadeUp 0.8s ease",
          }}
        >
          <div
            style={{
              fontSize: "5rem",
              marginBottom: 24,
              animation: "float 3s ease-in-out infinite",
            }}
          >
            🤝
          </div>
          <h2
            style={{
              fontFamily: "Syne",
              fontSize: "2rem",
              fontWeight: 800,
              marginBottom: 16,
            }}
          >
            Split bills, not friendships
          </h2>
          <p style={{ opacity: 0.85, lineHeight: 1.7, fontSize: "1rem" }}>
            Track expenses, split bills fairly, and settle up instantly with
            your friends and groups.
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              marginTop: 32,
            }}
          >
            {[
              "💸 Split Equally",
              "📊 Track Expenses",
              "💳 Settle Instantly",
            ].map((f) => (
              <div
                key={f}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: 12,
                  padding: "10px 16px",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  backdropFilter: "blur(10px)",
                }}
              >
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
