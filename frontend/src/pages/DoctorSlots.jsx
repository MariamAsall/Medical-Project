import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "./patient.css";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

function DoctorSlots() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [bookedDateTimes, setBookedDateTimes] = useState(new Set());
  const [doctorName, setDoctorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [slotsRes, docRes, apptRes] = await Promise.all([
          api.get(`availability/?doctor=${doctorId}`),
          api.get(`doctors/profiles/all/`),
          api.get(`appointments/manage/`),
        ]);

        const raw = slotsRes.data;
        setSlots(Array.isArray(raw) ? raw : raw.results ?? []);

        // Build a set of "weekday|HH:MM" strings for slots already booked
        // by checking confirmed/pending appointments for this doctor
        const appts = Array.isArray(apptRes.data)
          ? apptRes.data
          : apptRes.data?.results ?? [];

        const booked = new Set(
          appts
            .filter(
              (a) =>
                String(a.doctor) === String(doctorId) &&
                ["pending", "confirmed"].includes(a.status)
            )
            .map((a) => {
              const dt = new Date(a.date_time);
              const weekday = (dt.getDay() + 6) % 7; // Mon=0
              const hh = String(dt.getHours()).padStart(2, "0");
              const mm = String(dt.getMinutes()).padStart(2, "0");
              return `${weekday}|${hh}:${mm}`;
            })
        );
        setBookedDateTimes(booked);

        const docs = Array.isArray(docRes.data) ? docRes.data : [];
        const found = docs.find((d) => String(d.id) === String(doctorId));
        if (found) {
          const first = found.user_data?.first_name || "";
          const last = found.user_data?.last_name || "";
          setDoctorName(`Dr. ${first} ${last}`.trim());
        }
      } catch (err) {
        setError("Could not load availability slots. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [doctorId]);

  // A slot is "booked" if there's an active appointment at that weekday+time
  const isSlotBooked = (slot) => {
    const hh = slot.start_time.substring(0, 5); // "HH:MM"
    return bookedDateTimes.has(`${slot.weekday}|${hh}`);
  };

  const handleSlotClick = (slot) => {
    if (isSlotBooked(slot)) return;
    navigate("/patient/payment", {
      state: {
        doctorId,
        doctorName,
        slotId: slot.id,
        day: DAYS[slot.weekday] ?? slot.weekday_name ?? slot.weekday,
        weekday: slot.weekday,
        start_time: slot.start_time,
        end_time: slot.end_time,
      },
    });
  };

  if (loading) {
    return (
      <div className="pt-center-state">
        <div className="pt-spinner" />
        <p className="pt-spinner-text">Loading available slots…</p>
      </div>
    );
  }

  const availableCount = slots.filter((s) => !isSlotBooked(s)).length;

  return (
    <div className="pt-page">
      <button className="pt-back-link" onClick={() => navigate("/patient/dashboard")}>
        ← Back to Doctors
      </button>

      <div className="pt-page-header">
        <h1 className="pt-page-title">
          {doctorName ? `${doctorName}'s Schedule` : "Available Slots"}
        </h1>
        <p className="pt-page-subtitle">
          {availableCount} slot{availableCount !== 1 ? "s" : ""} available
        </p>
      </div>

      {error && (
        <div className="pt-error-box">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="pt-grid-sm">
        {slots.length === 0 ? (
          <div className="pt-empty">
            <span className="pt-empty-icon">📅</span>
            No slots have been set for this doctor yet.
          </div>
        ) : (
          slots.map((slot) => {
            const booked = isSlotBooked(slot);
            return (
              <div
                key={slot.id}
                className={`pt-card ${booked ? "pt-card-booked" : "pt-card-clickable"}`}
                onClick={() => handleSlotClick(slot)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <span className={`pt-badge ${booked ? "pt-badge-booked" : "pt-badge-available"}`}>
                    {booked ? "Booked" : "Available"}
                  </span>
                </div>

                <div className="pt-slot-time">
                  {formatTime(slot.start_time)}
                </div>
                <div className="pt-slot-day">
                  {slot.weekday_name ?? DAYS[slot.weekday] ?? slot.weekday} · until {formatTime(slot.end_time)}
                </div>

                {!booked && (
                  <button
                    className="pt-btn pt-btn-primary"
                    style={{ marginTop: "auto" }}
                    onClick={(e) => { e.stopPropagation(); handleSlotClick(slot); }}
                  >
                    Select →
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default DoctorSlots;