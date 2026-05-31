import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"
import api from "../api/axios";
import { notifySuccess, notifyError } from "../utils/notify";


function DoctorProfile() {

    const [profile, setProfile] = useState(null);
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        bio: "",
        phone: "",
        experience_years: "",
        consultation_fees: "",
        specialty: "",
    });

    const navigate = useNavigate();
    

    const fetchProfile = async () => {
        try {
            const res = await api.get("doctors/profiles/");
            const data = res.data.results?.[0] || null;
            setProfile(data);

            if (data) {
                setForm({
                    bio: data.bio || "",
                    phone: data.phone || "",
                    experience_years: data.experience_years || "",
                    consultation_fees: data.consultation_fees || "",
                    specialty: data.specialty || "",
                });
            }
        } catch (err) {
            setError("Failed to load profile.");
        }
    };

    const fetchSpecialties = async () => {
        try {
            const res = await api.get("doctors/specialties/");
            setSpecialties(res.data.results || res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await Promise.all([fetchProfile(), fetchSpecialties()]);
            setLoading(false);
        };
        load();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!profile) return;

        setSaving(true);
        setError(null);

        try {
            await api.patch(`doctors/profiles/${profile.id}/`, form);
            fetchProfile(); 
            notifySuccess("Profile updated successfully")
            navigate('/doctor')
        } catch (err) {
            const data = err.response?.data;
            if (data) {
                const messages = Object.entries(data)
                    .map(([field, msgs]) => `${field}: ${msgs}`)
                    .join(" | ");
                setError(messages);
            } else {
                setError("Something went wrong.");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <h3>Loading...</h3>;
    if (!profile) return <h3>No profile found.</h3>;

    return (
        <div>
            <h2>My Profile</h2>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label>Bio</label>
                    <textarea
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        rows={4}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label>Experience Years</label>
                    <input
                        type="number"
                        name="experience_years"
                        value={form.experience_years}
                        onChange={handleChange}
                        className="form-control"
                        min={0}
                    />
                </div>

                <div className="mb-3">
                    <label>Consultation Fee</label>
                    <input
                        type="number"
                        name="consultation_fees"
                        value={form.consultation_fees}
                        onChange={handleChange}
                        className="form-control"
                        min={0}
                    />
                </div>

                <div className="mb-3">
                    <label>Specialty</label>
                    <select
                        name="specialty"
                        value={form.specialty}
                        onChange={handleChange}
                        className="form-select"
                    >
                        <option value="">-- Select Specialty --</option>
                        {specialties.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save Profile"}
                </button>

            </form>
        </div>
    );
}

export default DoctorProfile;