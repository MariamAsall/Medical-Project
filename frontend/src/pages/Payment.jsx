import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import "./patient.css";

function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

// Given a weekday name (e.g. "Monday") and a time string (e.g. "13:00:00"),
// compute the next occurrence of that weekday as a full ISO datetime string.
function buildDateTime(dayName, timeStr) {
  const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const targetDay = DAYS.indexOf(dayName); // 0=Sun … 6=Sat
  if (targetDay === -1 || !timeStr) return null;

  const now = new Date();
  const todayDay = now.getDay(); // 0=Sun … 6=Sat
  let daysAhead = targetDay - todayDay;
  if (daysAhead <= 0) daysAhead += 7; // always pick a future date

  const date = new Date(now);
  date.setDate(now.getDate() + daysAhead);

  const [h, m, s] = timeStr.split(":");
  date.setHours(parseInt(h, 10), parseInt(m, 10), parseInt(s ?? "0", 10), 0);

  // Return full ISO 8601 string in UTC — universally accepted by Django
  return date.toISOString();
}

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state || {};

  const { doctorId, doctorName, day, start_time, end_time } = booking;

  const [form, setForm] = useState({
    reason: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!doctorId || !day || !start_time) {
    return (
      <div className="pt-center-state">
        <span style={{ fontSize: 36 }}>🚫</span>
        <p style={{ color: "var(--pt-slate)", fontFamily: "var(--pt-font)" }}>
          No booking data found.
        </p>
        <button
          className="pt-btn pt-btn-primary"
          style={{ width: "auto" }}
          onClick={() => navigate("/patient/dashboard")}
        >
          Go back to Doctors
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    let val = e.target.value;
    if (e.target.name === "cardNumber") {
      val = val.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
    }
    if (e.target.name === "expiry") {
      val = val.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1/$2").slice(0, 5);
    }
    if (e.target.name === "cvv") {
      val = val.replace(/\D/g, "").slice(0, 3);
    }
    setForm((prev) => ({ ...prev, [e.target.name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.reason.trim()) {
      setError("Please enter a reason for your visit.");
      return;
    }

    // Build the date_time the backend expects from the slot's weekday + start time
    const date_time = buildDateTime(day, start_time);
    if (!date_time) {
      setError("Could not determine appointment time. Please go back and select a slot again.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.post("appointments/book/", {
        doctor: doctorId,
        date_time,
        reason: form.reason,
        status: "pending",
      });
      navigate("/patient/appointments");
    } catch (err) {
      const data = err.response?.data;
      const msg =
        typeof data === "string"
          ? data
          : Object.values(data || {}).flat().join(" ") ||
            "Booking failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-page">
      <button className="pt-back-link" onClick={() => navigate(-1)}>
        ← Back to Slots
      </button>

      <div className="pt-page-header">
        <h1 className="pt-page-title">Confirm Appointment</h1>
        <p className="pt-page-subtitle">Review your booking and complete payment</p>
      </div>

      {error && (
        <div className="pt-error-box">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="pt-payment-layout">
        {/* ── Summary ── */}
        <div className="pt-summary-card">
          <div className="pt-summary-label">Booking Summary</div>
          <div className="pt-summary-doctor">{doctorName || "Doctor"}</div>

          <div className="pt-summary-row">
            <span>📅</span>
            <span>{day}</span>
          </div>
          <div className="pt-summary-row">
            <span>🕐</span>
            <span>
              {formatTime(start_time)}
              {end_time ? ` – ${formatTime(end_time)}` : ""}
            </span>
          </div>

          <hr className="pt-summary-divider" />

          <div className="pt-summary-fee">
            <span style={{ opacity: 0.8, fontSize: 14 }}>Consultation fee</span>
            <span>$50.00</span>
          </div>
        </div>

        {/* ── Form ── */}
        <form className="pt-form-card" onSubmit={handleSubmit}>
          <div className="pt-form-section-title">Visit Details</div>

          <div className="pt-field">
            <label className="pt-label">Reason for visit *</label>
            <input
              className="pt-input"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="e.g. Annual checkup, follow-up…"
              required
            />
          </div>

          <hr className="pt-divider" />
          <div className="pt-form-section-title">Payment Details</div>

          <div className="pt-field">
            <label className="pt-label">Cardholder name</label>
            <input
              className="pt-input"
              name="cardName"
              value={form.cardName}
              onChange={handleChange}
              placeholder="Name on card"
            />
          </div>

          <div className="pt-field">
            <label className="pt-label">Card number</label>
            <input
              className="pt-input"
              name="cardNumber"
              value={form.cardNumber}
              onChange={handleChange}
              placeholder="0000 0000 0000 0000"
              inputMode="numeric"
            />
          </div>

          <div className="pt-input-row">
            <div className="pt-field">
              <label className="pt-label">Expiry date</label>
              <input
                className="pt-input"
                name="expiry"
                value={form.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
                inputMode="numeric"
              />
            </div>
            <div className="pt-field">
              <label className="pt-label">CVV</label>
              <input
                className="pt-input"
                name="cvv"
                value={form.cvv}
                onChange={handleChange}
                placeholder="•••"
                inputMode="numeric"
                type="password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="pt-btn pt-btn-submit"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? "Processing…" : "Confirm & Pay →"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Payment;