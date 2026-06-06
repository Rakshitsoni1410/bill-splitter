import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../api/axios";

export default function Wallet() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [payForm, setPayForm] = useState({
    receiverUpiId: "",
    amount: "",
    note: "",
  });
  const [upiId, setUpiId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const [walletRes, historyRes] = await Promise.all([
        API.get(`/payments/wallet/${user.userId}`),
        API.get(`/payments/history/${user.userId}`),
      ]);
      setWallet(walletRes.data);
      setHistory(historyRes.data);
    } catch {
      toast.error("Failed to load wallet");
    } finally {
      setLoading(false);
    }
  };

  const makePayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.post("/payments/pay", {
        senderId: user.userId,
        receiverUpiId: payForm.receiverUpiId,
        amount: parseFloat(payForm.amount),
        note: payForm.note,
      });
      toast.success(`Payment successful! Ref: ${res.data.txnReference} ✅`);
      setShowPayModal(false);
      setPayForm({ receiverUpiId: "", amount: "", note: "" });
      fetchWalletData();
    } catch (err) {
      toast.error(err.response?.data || "Payment failed!");
    } finally {
      setSubmitting(false);
    }
  };

  const setUpi = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.put(`/users/${user.userId}/upi`, { upiId });
      toast.success("UPI ID set! 🎉");
      setShowUpiModal(false);
      fetchWalletData();
    } catch {
      toast.error("Failed to set UPI ID");
    } finally {
      setSubmitting(false);
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

  return (
    <div className="page">
      <div style={{ animation: "fadeUp 0.5s ease" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 8 }}>
          Wallet 💳
        </h1>
        <p className="text-muted mb-24">Manage your balance and transactions</p>
      </div>

      {/* Wallet Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #6c63ff 0%, #ff6584 100%)",
          borderRadius: 24,
          padding: 32,
          marginBottom: 24,
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          animation: "fadeUp 0.6s ease",
          boxShadow: "0 16px 48px rgba(108,99,255,0.4)",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            top: -60,
            right: -40,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            bottom: -40,
            left: 40,
          }}
        />

        <div style={{ position: "relative" }}>
          <p style={{ opacity: 0.8, marginBottom: 8, fontSize: "0.9rem" }}>
            Available Balance
          </p>
          <h1
            style={{
              fontFamily: "Syne",
              fontSize: "3rem",
              fontWeight: 800,
              marginBottom: 20,
            }}
          >
            {wallet?.walletBalance || "₹0.00"}
          </h1>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div>
              <p style={{ opacity: 0.7, fontSize: "0.8rem", marginBottom: 4 }}>
                UPI ID
              </p>
              <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                {wallet?.upiId || (
                  <button
                    onClick={() => setShowUpiModal(true)}
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.4)",
                      color: "#fff",
                      padding: "6px 14px",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: "0.85rem",
                    }}
                  >
                    + Set UPI ID
                  </button>
                )}
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {wallet?.upiId && (
                <button
                  onClick={() => setShowUpiModal(true)}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                  }}
                >
                  ✏️ Edit UPI
                </button>
              )}
              <button
                onClick={() => setShowPayModal(true)}
                style={{
                  background: "#fff",
                  border: "none",
                  color: "#6c63ff",
                  padding: "10px 20px",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                }}
              >
                💸 Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid-3 mb-24" style={{ animation: "fadeUp 0.7s ease" }}>
        {[
          {
            icon: "📤",
            label: "Sent",
            value: history.filter((t) => t.from === user.name).length,
            color: "#ff6584",
          },
          {
            icon: "📥",
            label: "Received",
            value: history.filter((t) => t.to === user.name).length,
            color: "#00d4aa",
          },
          {
            icon: "✅",
            label: "Total Txns",
            value: history.length,
            color: "#6c63ff",
          },
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

      {/* Transaction History */}
      <div style={{ animation: "fadeUp 0.8s ease" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 16 }}>
          Transaction History
        </h2>

        {history.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 60,
              background: "var(--card)",
              borderRadius: "var(--radius)",
              border: "1px dashed var(--border)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>💳</div>
            <h3 style={{ marginBottom: 8 }}>No transactions yet</h3>
            <p className="text-muted">
              Make your first payment to see history here!
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {history.map((txn, i) => {
              const isSender = txn.from === user.name;
              return (
                <div
                  key={i}
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
                          borderRadius: 12,
                          background: isSender
                            ? "rgba(255,101,132,0.15)"
                            : "rgba(0,212,170,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.3rem",
                        }}
                      >
                        {isSender ? "📤" : "📥"}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, marginBottom: 4 }}>
                          {isSender
                            ? `Paid to ${txn.to}`
                            : `Received from ${txn.from}`}
                        </p>
                        <p
                          className="text-muted"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {txn.note || "No note"} • {txn.txnReference}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          color: isSender ? "var(--accent2)" : "var(--green)",
                        }}
                      >
                        {isSender ? "-" : "+"}
                        {txn.amount}
                      </p>
                      <span
                        className={`badge ${txn.status === "SUCCESS" ? "badge-green" : "badge-red"}`}
                        style={{ fontSize: "0.7rem" }}
                      >
                        {txn.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pay Modal */}
      {showPayModal && (
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
            e.target === e.currentTarget && setShowPayModal(false)
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
            <h2 style={{ marginBottom: 24, fontFamily: "Syne" }}>
              💸 Send Payment
            </h2>
            <form
              onSubmit={makePayment}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div>
                <label className="label">Receiver UPI ID</label>
                <input
                  className="input"
                  placeholder="friend@billsplitter"
                  value={payForm.receiverUpiId}
                  onChange={(e) =>
                    setPayForm({ ...payForm, receiverUpiId: e.target.value })
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
                  value={payForm.amount}
                  onChange={(e) =>
                    setPayForm({ ...payForm, amount: e.target.value })
                  }
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="label">Note (optional)</label>
                <input
                  className="input"
                  placeholder="e.g. Dinner split"
                  value={payForm.note}
                  onChange={(e) =>
                    setPayForm({ ...payForm, note: e.target.value })
                  }
                />
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button
                  type="button"
                  className="btn btn-outline btn-full"
                  onClick={() => setShowPayModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success btn-full"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner" /> Processing...
                    </>
                  ) : (
                    "✅ Pay Now"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Set UPI Modal */}
      {showUpiModal && (
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
            e.target === e.currentTarget && setShowUpiModal(false)
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
            <h2 style={{ marginBottom: 8, fontFamily: "Syne" }}>Set UPI ID</h2>
            <p className="text-muted mb-24" style={{ fontSize: "0.9rem" }}>
              Others will use this to send you money
            </p>
            <form
              onSubmit={setUpi}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div>
                <label className="label">UPI ID</label>
                <input
                  className="input"
                  placeholder="yourname@billsplitter"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="button"
                  className="btn btn-outline btn-full"
                  onClick={() => setShowUpiModal(false)}
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
                      <span className="spinner" /> Saving...
                    </>
                  ) : (
                    "Save UPI ID"
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
