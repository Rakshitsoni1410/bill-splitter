import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";

const CATEGORIES = [
  "FOOD",
  "TRAVEL",
  "RENT",
  "SHOPPING",
  "ENTERTAINMENT",
  "OTHER",
];
const CATEGORY_ICONS = {
  FOOD: "🍕",
  TRAVEL: "✈️",
  RENT: "🏠",
  SHOPPING: "🛍️",
  ENTERTAINMENT: "🎬",
  OTHER: "📦",
};
const ACTIVITY_ICONS = {
  EXPENSE_ADDED: "💸",
  MEMBER_JOINED: "👋",
  PAYMENT_MADE: "✅",
  GROUP_CREATED: "🎉",
  EXPENSE_DELETED: "🗑️",
  SETTLED: "✅",
};
const ACTIVITY_COLORS = {
  EXPENSE_ADDED: "#6c63ff",
  MEMBER_JOINED: "#00d4aa",
  PAYMENT_MADE: "#00d4aa",
  GROUP_CREATED: "#ffd166",
  EXPENSE_DELETED: "#ff6584",
  SETTLED: "#00d4aa",
};

export default function GroupPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("expenses");
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    category: "FOOD",
    splitType: "EQUAL",
  });
  const [memberEmail, setMemberEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [id]);

  const fetchAll = async () => {
    try {
      const [groupRes, expRes, balRes, actRes] = await Promise.all([
        API.get(`/groups/${id}`),
        API.get(`/expenses/group/${id}`),
        API.get(`/splits/balances/${id}`),
        API.get(`/activities/group/${id}`),
      ]);
      setGroup(groupRes.data);
      setExpenses(expRes.data);
      setBalances(balRes.data);
      setActivities(actRes.data);
    } catch {
      toast.error("Failed to load group");
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.post("/expenses/add", {
        ...expenseForm,
        amount: parseFloat(expenseForm.amount),
        groupId: parseInt(id),
        paidById: user.userId,
      });
      await API.post("/splits/create", {
        expenseId: res.data.id,
        percentages: null,
        exactAmounts: null,
      });
      toast.success("Expense added & split! 🎉");
      setShowExpenseModal(false);
      setExpenseForm({
        title: "",
        amount: "",
        category: "FOOD",
        splitType: "EQUAL",
      });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data || "Failed to add expense");
    } finally {
      setSubmitting(false);
    }
  };

  const addMember = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const userRes = await API.get(`/users/all`);
      const found = userRes.data.find((u) => u.email === memberEmail);
      if (!found) {
        toast.error("User not found!");
        return;
      }
      await API.post(`/groups/${id}/members`, { userId: found.id });
      toast.success("Member added! 🎉");
      setShowMemberModal(false);
      setMemberEmail("");
      fetchAll();
    } catch {
      toast.error("Failed to add member");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteExpense = async (expId) => {
    if (!confirm("Delete this expense?")) return;
    try {
      await API.delete(`/expenses/${expId}`);
      toast.success("Expense deleted");
      fetchAll();
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
        }}
      >
        <div className="spinner" style={{ width: 48, height: 48 }} />
      </div>
    );

  const myBalance = balances[user.userId] || 0;
  const TABS = ["expenses", "members", "balances", "activity"];

  return (
    <div className="page">
      {/* Header */}
      <div style={{ animation: "fadeUp 0.5s ease", marginBottom: 24 }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--muted)",
            fontSize: "0.9rem",
            marginBottom: 16,
            padding: 0,
          }}
        >
          ← Back to Dashboard
        </button>
        <div className="flex-between">
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800 }}>
              {group?.name}
            </h1>
            <p className="text-muted mt-8">{group?.members?.length} members</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setShowMemberModal(true)}
            >
              + Member
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowExpenseModal(true)}
            >
              + Expense
            </button>
          </div>
        </div>
      </div>

      {/* Balance Banner */}
      <div
        style={{
          padding: "20px 24px",
          borderRadius: "var(--radius)",
          background:
            myBalance >= 0
              ? "linear-gradient(135deg, rgba(0,212,170,0.15), rgba(0,212,170,0.05))"
              : "linear-gradient(135deg, rgba(255,101,132,0.15), rgba(255,101,132,0.05))",
          border: `1px solid ${myBalance >= 0 ? "rgba(0,212,170,0.3)" : "rgba(255,101,132,0.3)"}`,
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          animation: "fadeUp 0.6s ease",
        }}
      >
        <div>
          <p
            className="text-muted"
            style={{ fontSize: "0.85rem", marginBottom: 4 }}
          >
            Your Balance
          </p>
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              color: myBalance >= 0 ? "var(--green)" : "var(--accent2)",
            }}
          >
            {myBalance >= 0 ? "+" : ""}₹{Math.abs(myBalance).toFixed(2)}
          </h2>
          <p
            className="text-muted"
            style={{ fontSize: "0.85rem", marginTop: 4 }}
          >
            {myBalance > 0
              ? "Others owe you"
              : myBalance < 0
                ? "You owe others"
                : "All settled up! 🎉"}
          </p>
        </div>
        {group?.budgetLimit && (
          <div style={{ textAlign: "right" }}>
            <p
              className="text-muted"
              style={{ fontSize: "0.85rem", marginBottom: 4 }}
            >
              Budget
            </p>
            <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>
              ₹{group.totalSpent || 0} / ₹{group.budgetLimit}
            </p>
            <div
              style={{
                height: 6,
                background: "var(--border)",
                borderRadius: 3,
                marginTop: 8,
                width: 120,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(((group.totalSpent || 0) / group.budgetLimit) * 100, 100)}%`,
                  background:
                    "linear-gradient(90deg, var(--green), var(--accent2))",
                  borderRadius: 3,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 20,
          background: "var(--card)",
          padding: 4,
          borderRadius: 10,
          width: "fit-content",
          flexWrap: "wrap",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              background: tab === t ? "var(--accent)" : "transparent",
              color: tab === t ? "#fff" : "var(--muted)",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "0.85rem",
              transition: "all 0.2s",
            }}
          >
            {t === "activity"
              ? "📋 Activity"
              : t === "expenses"
                ? "🧾 Expenses"
                : t === "members"
                  ? "👥 Members"
                  : "⚖️ Balances"}
          </button>
        ))}
      </div>

      {/* Expenses Tab */}
      {tab === "expenses" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            animation: "fadeIn 0.3s ease",
          }}
        >
          {expenses.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: 60,
                background: "var(--card)",
                borderRadius: "var(--radius)",
                border: "1px dashed var(--border)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>🧾</div>
              <h3 style={{ marginBottom: 8 }}>No expenses yet</h3>
              <p className="text-muted">
                Add your first expense to start splitting!
              </p>
            </div>
          ) : (
            expenses.map((exp, i) => (
              <div
                key={exp.id}
                className="card"
                style={{
                  animation: `slideIn ${0.1 + i * 0.05}s ease`,
                  padding: "16px 20px",
                }}
              >
                <div className="flex-between">
                  <div className="flex gap-16">
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: "var(--bg2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.3rem",
                      }}
                    >
                      {CATEGORY_ICONS[exp.category] || "📦"}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, marginBottom: 4 }}>
                        {exp.title}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <span
                          className="badge badge-purple"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {exp.category}
                        </span>
                        <span
                          className="badge badge-yellow"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {exp.splitType}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        color: "var(--accent)",
                      }}
                    >
                      ₹{exp.amount}
                    </p>
                    <p className="text-muted" style={{ fontSize: "0.8rem" }}>
                      by {exp.paidBy?.name}
                    </p>
                    {exp.paidBy?.id === user.userId && (
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--accent2)",
                          fontSize: "0.8rem",
                          marginTop: 4,
                        }}
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Members Tab */}
      {tab === "members" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            animation: "fadeIn 0.3s ease",
          }}
        >
          {group?.members?.map((member, i) => (
            <div
              key={member.id}
              className="card"
              style={{
                padding: "16px 20px",
                animation: `slideIn ${0.1 + i * 0.05}s ease`,
              }}
            >
              <div className="flex-between">
                <div className="flex gap-16">
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #6c63ff, #ff6584)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                    }}
                  >
                    {member.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600 }}>{member.name}</p>
                    <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                      {member.email}
                    </p>
                  </div>
                </div>
                {member.id === group.createdBy?.id && (
                  <span className="badge badge-purple">Admin</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Balances Tab */}
      {tab === "balances" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            animation: "fadeIn 0.3s ease",
          }}
        >
          {Object.keys(balances).length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: 60,
                background: "var(--card)",
                borderRadius: "var(--radius)",
                border: "1px dashed var(--border)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
              <h3>All settled up!</h3>
            </div>
          ) : (
            Object.entries(balances).map(([userId, balance]) => {
              const member = group?.members?.find(
                (m) => m.id === parseInt(userId),
              );
              return (
                <div
                  key={userId}
                  className="card"
                  style={{ padding: "16px 20px" }}
                >
                  <div className="flex-between">
                    <div className="flex gap-16">
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          background:
                            balance >= 0
                              ? "rgba(0,212,170,0.2)"
                              : "rgba(255,101,132,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--text)",
                          fontWeight: 700,
                        }}
                      >
                        {member?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600 }}>
                          {member?.name || `User ${userId}`}
                        </p>
                        <p
                          className="text-muted"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {balance >= 0 ? "gets back" : "owes"}
                        </p>
                      </div>
                    </div>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        color: balance >= 0 ? "var(--green)" : "var(--accent2)",
                      }}
                    >
                      {balance >= 0 ? "+" : ""}₹{Math.abs(balance).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Activity Tab */}
      {tab === "activity" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            animation: "fadeIn 0.3s ease",
          }}
        >
          {activities.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: 60,
                background: "var(--card)",
                borderRadius: "var(--radius)",
                border: "1px dashed var(--border)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>📋</div>
              <h3 style={{ marginBottom: 8 }}>No activity yet</h3>
              <p className="text-muted">
                Activities will appear here as you use the group!
              </p>
            </div>
          ) : (
            activities.map((act, i) => (
              <div
                key={act.id}
                className="card"
                style={{
                  padding: "14px 20px",
                  animation: `slideIn ${0.1 + i * 0.05}s ease`,
                  borderLeft: `3px solid ${ACTIVITY_COLORS[act.type] || "var(--accent)"}`,
                }}
              >
                <div className="flex gap-16">
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      flexShrink: 0,
                      background: `${ACTIVITY_COLORS[act.type] || "#6c63ff"}22`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                    }}
                  >
                    {ACTIVITY_ICONS[act.type] || "📌"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        marginBottom: 4,
                      }}
                    >
                      {act.message}
                    </p>
                    <p className="text-muted" style={{ fontSize: "0.8rem" }}>
                      {new Date(act.createdAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Expense Modal */}
      {showExpenseModal && (
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
          onClick={(e) =>
            e.target === e.currentTarget && setShowExpenseModal(false)
          }
        >
          <div
            style={{
              background: "var(--card)",
              borderRadius: "var(--radius)",
              padding: 32,
              width: "100%",
              maxWidth: 440,
              border: "1px solid var(--border)",
              animation: "fadeUp 0.3s ease",
            }}
          >
            <h2 style={{ marginBottom: 24, fontFamily: "Syne" }}>
              Add Expense
            </h2>
            <form
              onSubmit={addExpense}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div>
                <label className="label">Title</label>
                <input
                  className="input"
                  placeholder="e.g. Dinner at Pizza Hut"
                  value={expenseForm.title}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, title: e.target.value })
                  }
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="label">Amount (₹)</label>
                <input
                  className="input"
                  type="number"
                  placeholder="0.00"
                  value={expenseForm.amount}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, amount: e.target.value })
                  }
                  required
                  min="1"
                />
              </div>
              <div className="grid-2">
                <div>
                  <label className="label">Category</label>
                  <select
                    className="input"
                    value={expenseForm.category}
                    onChange={(e) =>
                      setExpenseForm({
                        ...expenseForm,
                        category: e.target.value,
                      })
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {CATEGORY_ICONS[c]} {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Split Type</label>
                  <select
                    className="input"
                    value={expenseForm.splitType}
                    onChange={(e) =>
                      setExpenseForm({
                        ...expenseForm,
                        splitType: e.target.value,
                      })
                    }
                  >
                    <option value="EQUAL">Equal</option>
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="EXACT">Exact</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button
                  type="button"
                  className="btn btn-outline btn-full"
                  onClick={() => setShowExpenseModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner" /> Adding...
                    </>
                  ) : (
                    "Add Expense"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showMemberModal && (
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
          onClick={(e) =>
            e.target === e.currentTarget && setShowMemberModal(false)
          }
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
            <h2 style={{ marginBottom: 24, fontFamily: "Syne" }}>Add Member</h2>
            <form
              onSubmit={addMember}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div>
                <label className="label">Member Email</label>
                <input
                  className="input"
                  type="email"
                  placeholder="friend@example.com"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="button"
                  className="btn btn-outline btn-full"
                  onClick={() => setShowMemberModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner" /> Adding...
                    </>
                  ) : (
                    "Add Member"
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
