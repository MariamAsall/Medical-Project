import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./patient.css";

function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

 const fetchDoctors = async () => {
  setLoading(true);
  setError(null);

  try {
    const [doctorsRes, specialtiesRes] = await Promise.all([
      api.get("doctors/profiles/all/"),
      api.get("doctors/specialties/")
    ]);


    setDoctors(Array.isArray(doctorsRes.data) ? doctorsRes.data : []);
setSpecialties(specialtiesRes.data.results || []);

  } catch (err) {
    setError("Failed to load doctors. Please try again.");
  } finally {
    setLoading(false);
  }
};

const getSpecialtyName = (specialtyId) => {
  const specialty = specialties.find(
    (item) => item.id === specialtyId
  );

  return specialty?.name || "General Practitioner";
};

  useEffect(() => {
    fetchDoctors();
  }, []);

  const getInitials = (doc) => {
    const first = doc.user_data?.first_name?.[0] || "";
    const last = doc.user_data?.last_name?.[0] || "";
    return (first + last).toUpperCase() || "Dr";
  };

  const getDoctorName = (doc) => {
    const first = doc.user_data?.first_name || "";
    const last = doc.user_data?.last_name || "";
    return `Dr. ${first} ${last}`.trim();
  };

  if (loading) {
    return (
      <div className="pt-center-state">
        <div className="pt-spinner" />
        <p className="pt-spinner-text">Loading doctors…</p>
      </div>
    );
  }

  return (
    <div className="pt-page">
      <div className="pt-page-header">
        <h1 className="pt-page-title">Find a Doctor</h1>
        <p className="pt-page-subtitle">Browse available doctors and book your appointment</p>
      </div>

      {error && (
        <div className="pt-error-box">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="pt-grid">
        {doctors.length === 0 ? (
          <div className="pt-empty">
            <span className="pt-empty-icon">🩺</span>
            No doctors available at the moment.
          </div>
        ) : (
          doctors.map((doc) => (
            <div
              key={doc.id}
              className="pt-card pt-card-clickable"
              onClick={() => navigate(`/patient/doctors/${doc.id}/slots`)}
            >
              <div className="pt-card-avatar">{getInitials(doc)}</div>
              <div className="pt-card-title">{getDoctorName(doc)}</div>
              <div className="pt-card-sub">
                {getSpecialtyName(doc.specialty)}
              </div>
              <div className="pt-card-meta">
                <div className="pt-card-meta-row">
                  <span className="pt-card-meta-icon">🎓</span>
                  {doc.experience_years ?? 0} years experience
                </div>
                {doc.consultation_fees && (
                  <div className="pt-card-meta-row">
                    <span className="pt-card-meta-icon">💳</span>
                    ${parseFloat(doc.consultation_fees).toFixed(2)} consultation
                  </div>
                )}
              </div>
              <button
                className="pt-btn pt-btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/patient/doctors/${doc.id}/slots`);
                }}
              >
                Book Now →
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;
