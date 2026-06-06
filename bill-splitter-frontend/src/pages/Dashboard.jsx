import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";

export default function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "" });
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await API.get(`/groups/user/${user.userId}`);
      setGroups(res.data);
    } catch {
      toast.error("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await API.post("/groups/create", {
        name: newGroup.name,
        createdById: user.userId,
        memberIds: [user.userId],
      });
      toast.success("Group created! 🎉");
      setShowModal(false);
      setNewGroup({ name: "" });
      fetchGroups();
    } catch {
      toast.error("Failed to create group");
    } finally {
      setCreating(false);
    }
  };

  const categoryColors = [
    "#6c63ff",
    "#ff6584",
    "#00d4aa",
    "#ffd166",
    "#a29bfe",
  ];

  return (
    <div className="page">
      {/* Header */}
      <div
        className="flex-between mb-24"
        style={{ animation: "fadeUp 0.5s ease" }}
      >
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800 }}>
            Hey, {user.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-muted mt-8">Manage your groups and expenses</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Group
        </button>
      </div>

      {/* Stats */}
      <div className="grid-3 mb-24" style={{ animation: "fadeUp 0.6s ease" }}>
        {[
          {
            icon: "👥",
            label: "Total Groups",
            value: groups.length,
            color: "#6c63ff",
          },
          { icon: "💸", label: "Active Splits", value: "—", color: "#ff6584" },
          { icon: "✅", label: "Settled", value: "—", color: "#00d4aa" },
        ].map(({ icon, label, value, color }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon" style={{ background: `${color}22` }}>
              {icon}
            </div>
            <div>
              <p
                className="text-muted"
                style={{ fontSize: "0.8rem", marginBottom: 4 }}
              >
                {label}
              </p>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color }}>
                {value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Groups */}
      <div style={{ animation: "fadeUp 0.7s ease" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 16 }}>
          Your Groups
        </h2>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div
              className="spinner"
              style={{ width: 40, height: 40, margin: "0 auto" }}
            />
          </div>
        ) : groups.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 60,
              background: "var(--card)",
              borderRadius: "var(--radius)",
              border: "1px dashed var(--border)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🏕️</div>
            <h3 style={{ marginBottom: 8 }}>No groups yet</h3>
            <p className="text-muted">
              Create your first group to start splitting bills!
            </p>
            <button
              className="btn btn-primary"
              style={{ marginTop: 20 }}
              onClick={() => setShowModal(true)}
            >
              + Create Group
            </button>
          </div>
        ) : (
          <div className="grid-2">
            {groups.map((group, i) => (
              <div
                key={group.id}
                className="card"
                style={{
                  cursor: "pointer",
                  animation: `fadeUp ${0.3 + i * 0.1}s ease`,
                }}
                onClick={() => navigate(`/group/${group.id}`)}
              >
                <div className="flex-between mb-16">
                  <div className="flex gap-16">
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: `${categoryColors[i % categoryColors.length]}22`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.4rem",
                      }}
                    >
                      🏷️
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                        {group.name}
                      </h3>
                      <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                        {group.members?.length || 0} members
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-purple">Active</span>
                </div>
                <div
                  style={{
                    padding: "10px 14px",
                    background: "var(--bg2)",
                    borderRadius: 10,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                    Budget
                  </span>
                  <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                    {group.budgetLimit
                      ? `₹${group.totalSpent || 0} / ₹${group.budgetLimit}`
                      : "No limit"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            animation: "fadeIn 0.2s ease",
            padding: 20,
          }}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div
            style={{
              background: "var(--card)",
              borderRadius: "var(--radius)",
              padding: 32,
              width: "100%",
              maxWidth: 420,
              border: "1px solid var(--border)",
              animation: "fadeUp 0.3s ease",
            }}
          >
            <h2 style={{ marginBottom: 24, fontFamily: "Syne" }}>
              Create New Group
            </h2>
            <form
              onSubmit={createGroup}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div>
                <label className="label">Group Name</label>
                <input
                  className="input"
                  placeholder="e.g. Goa Trip 🏖️"
                  value={newGroup.name}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, name: e.target.value })
                  }
                  required
                  autoFocus
                />
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button
                  type="button"
                  className="btn btn-outline btn-full"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={creating}
                >
                  {creating ? (
                    <>
                      <span className="spinner" /> Creating...
                    </>
                  ) : (
                    "Create Group"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
