import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { notifySuccess, notifyError } from "../utils/notify";


function EditSpecialty() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        discription: "",
    });

    useEffect(() => {
        fetchSpecialty();
    }, []);

    const fetchSpecialty = async () => {
        try {
            const res = await api.get(`doctors/specialties/${id}/`);

            setFormData({
                name: res.data.name,
                discription: res.data.discription,
            });
        } catch (error) {
            notifyError("Failed to load specialty");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.put(
                `doctors/specialties/${id}/`,
                formData
            );

            notifySuccess("Specialty updated successfully");
            navigate("/admin");

        } catch (error) {
            notifyError("This specialty already exists.");
        }
    };

    return (
        <div className="container py-5">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Edit Specialty</h3>

                <Link
                    to="/admin"
                    className="btn btn-outline-secondary rounded-pill px-4"
                >
                    Back
                </Link>
            </div>

            <div className="card border-0 shadow-lg rounded-4 mx-auto"
                 style={{ maxWidth: "650px" }}>

                <div className="card-body p-5">

                    <form onSubmit={handleSubmit}>

                        <div className="mb-4">
                            <label className="form-label fw-semibold">
                                Specialty Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                className="form-control form-control-lg rounded-3"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold">
                                Description
                            </label>

                            <textarea
                                name="discription"
                                rows="5"
                                className="form-control rounded-3"
                                value={formData.discription}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 py-3 rounded-3 fw-bold"
                        >
                            Update Specialty
                        </button>

                    </form>

                </div>
            </div>

        </div>
    );
}

export default EditSpecialty;