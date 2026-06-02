import { useEffect, useState } from "react";
import api from "../api/axios";
import "./patient.css";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${m} ${ampm}`;
}

function statusBadge(status) {
  const s = (status || "").toLowerCase();
  if (s === "confirmed") return "pt-badge-confirmed";
  if (s === "cancelled") return "pt-badge-cancelled";
  return "pt-badge-pending";
}

// Fixed buildDateTime to cleanly append future dates matching slot values
function buildDateTime(dayIndex, timeStr) {
  if (dayIndex === undefined || !timeStr) return null;
  const now = new Date();
  const todayDay = now.getDay(); 
  const targetDay = dayIndex === 6 ? 0 : dayIndex + 1; 
  
  let daysAhead = targetDay - todayDay;
  if (daysAhead <= 0) daysAhead += 7;

  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + daysAhead);
  
  const [h, m] = timeStr.split(":");
  targetDate.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
  
  return targetDate.toISOString();
}

function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  // Modal Dynamic States
  const [showModal, setShowModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState("");
  const [rescheduling, setRescheduling] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("appointments/manage/");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.results ?? res.data?.appointments ?? [];
      setAppointments(data);
    } catch (err) {
      setError("Failed to load appointments. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    setCancelling(id);
    try {
      await api.patch(`appointments/manage/${id}/`, { status: "cancelled" });
      await fetchAppointments();
    } catch (err) {
      setError("Could not cancel appointment. Please try again.");
    } finally {
      setCancelling(null);
    }
  };

  const openReschedule = async (appt) => {
    setSelectedAppt(appt);
    setSelectedSlotIndex("");
    setSlots([]);
    setShowModal(true);
    setLoadingSlots(true);

    const doctorId = appt.doctor?.id || appt.doctor;
    if (!doctorId) {
      setError("Could not retrieve details for this doctor.");
      setLoadingSlots(false);
      return;
    }

    try {
      // FIX: Matches backend expected query structure: availability/?doctor=ID
      const res = await api.get(`availability/?doctor=${doctorId}`);
      const rawData = res.data;
      setSlots(Array.isArray(rawData) ? rawData : rawData.results ?? []);
    } catch (err) {
      console.error("Failed fetching valid doctor schedules", err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleReschedule = async () => {
    if (selectedSlotIndex === "") return;
    setRescheduling(true);
    setError(null);

    const slot = slots[selectedSlotIndex];
    const computedIsoString = buildDateTime(slot.weekday, slot.start_time);

    try {
      await api.patch(`appointments/manage/${selectedAppt.id}/`, {
        date_time: computedIsoString
      });
      setShowModal(false);
      await fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.detail || "Selected slot validation failed on server.");
    } finally {
      setRescheduling(false);
    }
  };

  const getDoctorName = (appt) => {
    if (appt.doctor_name) return `Dr. ${appt.doctor_name}`;
    const first = appt.doctor?.user_data?.first_name || appt.doctor?.user?.first_name || "";
    const last  = appt.doctor?.user_data?.last_name  || appt.doctor?.user?.last_name  || "";
    if (first || last) return `Dr. ${first} ${last}`.trim();
    return `Doctor #${appt.doctor?.id ?? appt.doctor ?? "?"}`;
  };

  return (
    <div className="pt-page">
      <div className="pt-page-header">
        <h1 className="pt-page-title">My Appointments</h1>
        <p className="pt-page-subtitle">
          {appointments.length} appointment{appointments.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {error && (
        <div className="pt-error-box">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="pt-grid">
        {appointments.length === 0 ? (
          <div className="pt-empty">
            <span className="pt-empty-icon">📋</span>
            You have no appointments yet.
          </div>
        ) : (
          appointments.map((appt) => {
            const status = (appt.status || "pending").toLowerCase();
            const isCancelled = status === "cancelled";
            return (
              <div key={appt.id} className="pt-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div className="pt-card-title">{getDoctorName(appt)}</div>
                  <span className={`pt-badge ${statusBadge(status)}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>

                <div className="pt-card-meta">
                  <div className="pt-card-meta-row">
                    <span className="pt-card-meta-icon">📅</span>
                    {appt.date_time ? new Date(appt.date_time).toLocaleDateString() : "—"}
                  </div>
                  <div className="pt-card-meta-row">
                    <span className="pt-card-meta-icon">🕐</span>
                    {appt.date_time ? new Date(appt.date_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "—"}
                  </div>
                </div>

                {!isCancelled && (
                  <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                    <button
                      className="pt-btn pt-btn-cancel"
                      disabled={cancelling === appt.id}
                      onClick={() => handleCancel(appt.id)}
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                    <button
                      className="pt-btn pt-btn-primary"
                      onClick={() => openReschedule(appt)}
                      style={{ flex: 1, backgroundColor: "#2563eb" }}
                    >
                      Reschedule
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {showModal && selectedAppt && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.4)", display: "flex",
          justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div className="pt-card" style={{ width: "90%", maxWidth: "420px", padding: "24px", background: "#fff", borderTop: "none" }}>
            <h3 className="pt-card-title" style={{ marginBottom: "6px" }}>Reschedule Appointment</h3>
            <p className="pt-card-sub" style={{ marginBottom: "20px" }}>Select a verified availability slot for {getDoctorName(selectedAppt)}</p>
            
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", color: "#666", marginBottom: "6px" }}>
                Available Openings
              </label>
              
              {loadingSlots ? (
                <div style={{ padding: "10px 0", fontSize: "13px", color: "#666" }}>Fetching doctor slots...</div>
              ) : slots.length === 0 ? (
                <div style={{ padding: "10px", background: "#f8fafc", borderRadius: "8px", fontSize: "13px", color: "#ef4444" }}>
                  No open active slots found for this professional.
                </div>
              ) : (
                <select
                  value={selectedSlotIndex}
                  onChange={(e) => setSelectedSlotIndex(e.target.value)}
                  className="pt-input"
                  style={{ appearance: "auto" }}
                >
                  <option value="">Choose a slot…</option>
                  {slots.map((slot, index) => (
                    <option key={slot.id || index} value={index}>
                      {DAYS[slot.weekday]}s at {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button 
                className="pt-btn" 
                style={{ border: "1px solid #cbd5e1", background: "#fff", color: "#475569" }}
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button 
                className="pt-btn pt-btn-primary"
                disabled={rescheduling || selectedSlotIndex === ""}
                onClick={handleReschedule}
                style={{ backgroundColor: "#1e293b" }}
              >
                {rescheduling ? "Updating..." : "Confirm Slot"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientAppointments;