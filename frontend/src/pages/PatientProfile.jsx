import { useState, useEffect } from "react";
import api from "../api/axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../components/authslice"; // Check case matches file tree
import { toast } from "react-toastify";
import "./patient.css";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function PatientProfile() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverBackup, setServerBackup] = useState(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    address: "",
    emergency_contact: "",
    blood_type: "",
  });

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("patients/profile/");
      
      let fName = "";
      let lName = "";
      if (data.full_name) {
        const parts = data.full_name.trim().split(" ");
        fName = parts[0] || "";
        lName = parts.slice(1).join(" ") || "";
      }

      const loadedData = {
        first_name: fName,
        last_name: lName,
        email: data.email || "",
        phone_number: data.phone_number || "",
        date_of_birth: data.date_of_birth || "",
        address: data.address || "",
        emergency_contact: data.emergency_contact || "",
        blood_type: data.blood_type || "",
      };

      setForm(loadedData);
      setServerBackup(loadedData);

      // Save into sessionStorage to keep sidebar robust on reloads
      const savedRole = localStorage.getItem("role") || "patient";
      const userPayload = {
        email: loadedData.email,
        first_name: loadedData.first_name,
        last_name: loadedData.last_name,
        role: savedRole.toUpperCase()
      };

      localStorage.setItem("user", JSON.stringify(userPayload));
      dispatch(
        loginSuccess({
          user: userPayload,
          role: savedRole
        })
      );

    } catch (err) {
      toast.error("Failed to load your profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReset = () => {
    if (serverBackup) {
      setForm(serverBackup);
      toast.info("Form fields reverted to saved values.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const flatPayload = {
      phone_number: form.phone_number,
      date_of_birth: form.date_of_birth,
      address: form.address,
      emergency_contact: form.emergency_contact,
      blood_type: form.blood_type,
    };

    try {
      const { data } = await api.put("patients/profile/", flatPayload);
      
      let fName = form.first_name;
      let lName = form.last_name;
      if (data.full_name) {
        const parts = data.full_name.trim().split(" ");
        fName = parts[0] || form.first_name;
        lName = parts.slice(1).join(" ") || form.last_name;
      }

      const updatedData = {
        first_name: fName,
        last_name: lName,
        email: data.email || form.email,
        phone_number: data.phone_number || form.phone_number,
        date_of_birth: data.date_of_birth || form.date_of_birth,
        address: data.address || form.address,
        emergency_contact: data.emergency_contact || form.emergency_contact,
        blood_type: data.blood_type || form.blood_type,
      };

      setForm(updatedData);
      setServerBackup(updatedData);

      const savedRole = localStorage.getItem("role") || "patient";
      const updatedUserPayload = {
        email: updatedData.email,
        first_name: updatedData.first_name,
        last_name: updatedData.last_name,
        role: savedRole.toUpperCase()
      };

      localStorage.setItem("user", JSON.stringify(updatedUserPayload));
      
      dispatch(
        loginSuccess({
          user: updatedUserPayload,
          role: savedRole
        })
      );

      toast.success("Profile saved and synced successfully!");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update profile values.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-center-state">
        <div className="pt-spinner" />
        <p className="pt-spinner-text">Loading profile information…</p>
      </div>
    );
  }

  return (
    <div className="pt-page">
      <div className="pt-page-header">
        <h1 className="pt-page-title">My Personal Profile</h1>
        <p className="pt-page-subtitle">Manage your credentials, medical records, and contact cards</p>
      </div>

      <div className="pt-card" style={{ maxWidth: "680px", margin: "0 auto", padding: "30px" }}>
        <form onSubmit={handleSave}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <h3 style={{ margin: "0 0 4px 0", color: "#0d9488", fontSize: "15px", borderBottom: "1px dashed #e2e8f0", paddingBottom: "8px" }}>
              🔒 Account Identity (Read-Only)
            </h3>

            <div style={{ display: "flex", gap: "16px" }}>
              <div className="pt-field" style={{ flex: 1 }}>
                <label className="pt-label">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  disabled
                  className="pt-input"
                  style={{ backgroundColor: "#f1f5f9", color: "#64748b", cursor: "not-allowed" }}
                />
              </div>
              <div className="pt-field" style={{ flex: 1 }}>
                <label className="pt-label">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  disabled
                  className="pt-input"
                  style={{ backgroundColor: "#f1f5f9", color: "#64748b", cursor: "not-allowed" }}
                />
              </div>
            </div>

            <div className="pt-field">
              <label className="pt-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                disabled
                className="pt-input"
                style={{ backgroundColor: "#f1f5f9", color: "#64748b", cursor: "not-allowed" }}
              />
            </div>

            <h3 style={{ margin: "10px 0 4px 0", color: "#0d9488", fontSize: "15px", borderBottom: "1px dashed #e2e8f0", paddingBottom: "8px" }}>
              📋 Medical Settings & Contact Details
            </h3>

            <div className="pt-field">
              <label className="pt-label">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                className="pt-input"
                placeholder="Enter your mobile number"
              />
            </div>

            <div className="pt-field">
              <label className="pt-label">Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                value={form.date_of_birth}
                onChange={handleChange}
                className="pt-input"
              />
            </div>

            <div className="pt-field">
              <label className="pt-label">Home Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="pt-input"
                placeholder="Street address, City, Country"
              />
            </div>

            <div className="pt-field">
              <label className="pt-label">Emergency Contact Info</label>
              <input
                type="text"
                name="emergency_contact"
                value={form.emergency_contact}
                onChange={handleChange}
                className="pt-input"
                placeholder="Name — Relationship — Contact Number"
              />
            </div>

            <div className="pt-field">
              <label className="pt-label">Blood Type</label>
              <select
                name="blood_type"
                value={form.blood_type}
                onChange={handleChange}
                className="pt-input"
                style={{ appearance: "auto" }}
              >
                <option value="">Select blood type…</option>
                {BLOOD_TYPES.map((bt) => (
                  <option key={bt} value={bt}>{bt}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "35px" }}>
            <button
              type="button"
              onClick={handleReset}
              className="pt-btn"
              style={{ border: "1px solid #cbd5e1", background: "#fff", color: "#475569" }}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={saving}
              className="pt-btn pt-btn-primary"
              style={{ backgroundColor: "#0d9488" }}
            >
              {saving ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}