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

function statusStrip(status) {
  const s = (status || "").toLowerCase();
  if (s === "confirmed") return "pt-strip-confirmed";
  if (s === "cancelled") return "pt-strip-cancelled";
  if (s === "pending")   return "pt-strip-pending";
  return "pt-strip-default";
}

function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(null);

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

  const getDoctorName = (appt) => {
    if (appt.doctor_name) return `Dr. ${appt.doctor_name}`;
    const first = appt.doctor?.user_data?.first_name || appt.doctor?.user?.first_name || "";
    const last  = appt.doctor?.user_data?.last_name  || appt.doctor?.user?.last_name  || "";
    if (first || last) return `Dr. ${first} ${last}`.trim();
    return `Doctor #${appt.doctor?.id ?? appt.doctor ?? "?"}`;
  };

  const getDay = (appt) => {
    if (appt.availability?.weekday !== undefined) {
      return DAYS[appt.availability.weekday] ?? "";
    }
    if (appt.date_time) {
      try {
        return new Date(appt.date_time).toLocaleDateString(undefined, {
          weekday: "long", year: "numeric", month: "short", day: "numeric",
        });
      } catch {}
    }
    return appt.date ?? "—";
  };

  const getTime = (appt) => {
    if (appt.availability?.start_time) return formatTime(appt.availability.start_time);
    if (appt.date_time) {
      try {
        return new Date(appt.date_time).toLocaleTimeString(undefined, {
          hour: "2-digit", minute: "2-digit",
        });
      } catch {}
    }
    return "";
  };

  if (loading) {
    return (
      <div className="pt-center-state">
        <div className="pt-spinner" />
        <p className="pt-spinner-text">Loading appointments…</p>
      </div>
    );
  }

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
                <div className={`pt-card-status-strip ${statusStrip(status)}`} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div className="pt-card-title">{getDoctorName(appt)}</div>
                  <span className={`pt-badge ${statusBadge(status)}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>

                {appt.doctor?.specialty?.name && (
                  <div className="pt-card-sub">{appt.doctor.specialty.name}</div>
                )}

                <div className="pt-card-meta">
                  <div className="pt-card-meta-row">
                    <span className="pt-card-meta-icon">📅</span>
                    {getDay(appt)}
                  </div>
                  {getTime(appt) && (
                    <div className="pt-card-meta-row">
                      <span className="pt-card-meta-icon">🕐</span>
                      {getTime(appt)}
                    </div>
                  )}
                  {appt.reason && (
                    <div className="pt-card-meta-row">
                      <span className="pt-card-meta-icon">📝</span>
                      {appt.reason}
                    </div>
                  )}
                  {appt.approved_at && (
                    <div className="pt-card-meta-row">
                      <span className="pt-card-meta-icon">✅</span>
                      Approved At:
                      {" "}
                      {new Date(appt.approved_at).toLocaleString()}
                    </div>
                  )}
                </div>

                {!isCancelled && (
                  <button
                    className="pt-btn pt-btn-cancel"
                    disabled={cancelling === appt.id}
                    onClick={() => handleCancel(appt.id)}
                  >
                    {cancelling === appt.id ? "Cancelling…" : "Cancel Appointment"}
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

export default PatientAppointments;
