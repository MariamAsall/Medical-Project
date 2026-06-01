import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { notifySuccess, notifyError } from "../utils/notify";

function AddSpecialty() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        discription: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("doctors/specialties/", formData);

            notifySuccess("Specialty added successfully");

            navigate("/admin");

        } catch (error) {
            console.log(error.response?.data);
            notifyError("This specialty already exists.");
        }
    };

    return (
        <div className="container mt-5">

            <div className="d-flex justify-content-between align-items-center mb-3">

                <h3 className="mb-0">Add Specialty</h3>

                {/* BACK BUTTON */}
                <Link to="/admin" className="btn btn-outline-secondary">
                    ← Back to Dashboard
                </Link>

            </div>

            <div
                className="card shadow p-4 mx-auto"
                style={{ maxWidth: "500px" }}
            >
                <form onSubmit={handleSubmit}>

                    <div className="mb-3">
                        <label className="form-label">Name</label>

                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>

                        <textarea
                            name="discription"
                            className="form-control"
                            rows="4"
                            value={formData.discription}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Save Specialty
                    </button>

                </form>
            </div>

        </div>
    );
}

export default AddSpecialty;