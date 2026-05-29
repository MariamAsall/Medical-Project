import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function DoctorProfileForm() {

    const navigate = useNavigate();

    const [profileExists, setProfileExists] = useState(false);

    const [specialties, setSpecialties] = useState([]);

    const [form, setForm] = useState({
        bio: "",
        phone: "",
        experience_years: 0,
        consultation_fees: 0,
        specialty: "",
    });

    // fetch specialties
    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const res = await api.get("doctors/specialties/");
               setSpecialties(res.data.results);
            } catch (err) {
                console.log(err);
            }
        };

        fetchSpecialties();
    }, []);

    // check profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("doctors/profiles/");

                if (res.data.length > 0) {
                    setProfileExists(true);
                    setForm(res.data[0]);
                }

            } catch (err) {
                console.log(err);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

   const handleSubmit = async (e) => {
    e.preventDefault();

    try {

        // 🔥 نجرب نجيب البروفيال الحالي
        const res = await api.get("doctors/profiles/");

        if (res.data.length > 0) {

            // UPDATE
            const profile = res.data[0];

            await api.put(
                `doctors/profiles/${profile.id}/`,
                form
            );

        } else {

            // CREATE
            await api.post(
                "doctors/profiles/",
                form
            );
        }

        navigate("/availability");

    } catch (err) {

        console.log(err.response?.data);

        // fallback safety
        if (
            err.response?.data?.detail
            === "Profile already exists"
        ) {
            navigate("/availability");
        }

    }
};

    return (
        <div className="container mt-4">

            <div className="card p-4">

                <h3 className="mb-3">
                    {profileExists ? "Update Profile" : "Create Profile"}
                </h3>

                <form onSubmit={handleSubmit}>

                    {/* BIO */}
                    <label className="form-label">
                        Bio
                    </label>

                    <textarea
                        className="form-control mb-3"
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        placeholder="Write your bio..."
                    />

                    {/* PHONE */}
                    <label className="form-label">
                        Phone
                    </label>

                    <input
                        className="form-control mb-3"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                    />

                    {/* EXPERIENCE */}
                    <label className="form-label">
                        Experience Years
                    </label>

                    <input
                        type="number"
                        className="form-control mb-3"
                        name="experience_years"
                        value={form.experience_years}
                        onChange={handleChange}
                        placeholder="Years of experience"
                    />

                    {/* FEES */}
                    <label className="form-label">
                        Consultation Fees
                    </label>

                    <input
                        type="number"
                        className="form-control mb-3"
                        name="consultation_fees"
                        value={form.consultation_fees}
                        onChange={handleChange}
                        placeholder="Enter fees"
                    />

                    {/* SPECIALTY */}
                    <label className="form-label">
                        Specialty
                    </label>

                    <select
                        className="form-control mb-3"
                        name="specialty"
                        value={form.specialty}
                        onChange={handleChange}
                    >

                        <option value="">
                            Select Specialty
                        </option>

                        {specialties.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.name}
                            </option>
                        ))}

                    </select>

                    {/* BUTTON */}
                    <button className="btn btn-primary w-100">
                        {profileExists ? "Update Profile" : "Create Profile"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default DoctorProfileForm;