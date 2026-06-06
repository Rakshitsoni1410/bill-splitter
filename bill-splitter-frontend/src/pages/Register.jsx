import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";

export default function Register({ toggleTheme, theme }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/users/register", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: res.data.name,
          email: res.data.email,
          userId: res.data.userId,
        }),
      );
      toast.success("Account created! Welcome 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", background: "var(--bg)" }}
    >
      {/* Left Hero */}
      <div
        style={{
          flex: 1,
          background: "linear-gradient(135deg, #0d0d14 0%, #1a1a2e 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          position: "relative",
          overflow: "hidden",
        }}
        className="hide-mobile"
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 30% 50%, rgba(108,99,255,0.2), transparent 60%)",
          }}
        />
        <div
          style={{
            position: "relative",
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
            💰
          </div>
          <h2
            style={{
              fontFamily: "Syne",
              fontSize: "2rem",
              fontWeight: 800,
              marginBottom: 16,
              color: "#fff",
            }}
          >
            Join thousands splitting smarter
          </h2>
          <p style={{ color: "#8888aa", lineHeight: 1.7 }}>
            Create groups, add expenses, track who owes what — all in one place.
          </p>
          <div
            style={{
              marginTop: 32,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {[
              { icon: "🔐", text: "Secure JWT authentication" },
              { icon: "📊", text: "Real-time balance tracking" },
              { icon: "💸", text: "UPI-style payment simulation" },
            ].map(({ icon, text }) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "rgba(108,99,255,0.1)",
                  borderRadius: 12,
                  padding: "12px 16px",
                  border: "1px solid rgba(108,99,255,0.2)",
                }}
              >
                <span style={{ fontSize: "1.3rem" }}>{icon}</span>
                <span style={{ color: "#f0f0ff", fontSize: "0.9rem" }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,101,132,0.1), transparent)",
            bottom: "10%",
            right: "10%",
            filter: "blur(40px)",
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
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "linear-gradient(135deg, #ff6584, #6c63ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                margin: "0 auto 16px",
                boxShadow: "0 8px 24px rgba(255,101,132,0.3)",
              }}
            >
              🚀
            </div>
            <h1
              style={{
                fontFamily: "Syne",
                fontSize: "1.8rem",
                fontWeight: 800,
                marginBottom: 6,
              }}
            >
              Create account
            </h1>
            <p style={{ color: "var(--muted)" }}>
              Start splitting bills with friends today
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div>
              <label className="label">Full Name</label>
              <input
                className="input"
                type="text"
                placeholder="Rakshit Soni"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
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
                  <span className="spinner" /> Creating account...
                </>
              ) : (
                "Create Account →"
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
            Already have an account?{" "}
            <Link
              to="/"
              style={{
                color: "var(--accent)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </p>

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
    </div>
  );
}
