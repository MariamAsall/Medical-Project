import { useEffect, useState } from "react";
import api from "../api/axios";

function PatientDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        doctor: "",
        date_time: "",
        reason: "",
    });

    // =========================
    // FETCH DATA
    // =========================
    const fetchData = async () => {
        try {
            const doctorsRes = await api.get("doctors/profiles/all/");
            const appointmentsRes = await api.get("appointments/");

            console.log("DOCTORS:", doctorsRes.data);
            console.log("APPOINTMENTS:", appointmentsRes.data);

            setDoctors(Array.isArray(doctorsRes.data) ? doctorsRes.data : []);

            const data =
                appointmentsRes.data?.results ||
                appointmentsRes.data ||
                [];

            setAppointments(Array.isArray(data) ? data : []);

        } catch (err) {
            console.log("ERROR:", err.response?.data || err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // =========================
    // FORM CHANGE
    // =========================
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // =========================
    // BOOK APPOINTMENT
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("appointments/", form);

            setForm({
                doctor: "",
                date_time: "",
                reason: "",
            });

            fetchData();

        } catch (err) {
            console.log("BOOK ERROR:", err.response?.data || err);
        }
    };

    if (loading) {
        return <h3 className="text-center mt-5">Loading...</h3>;
    }

    return (
        <div className="container mt-4">

            <h2>Patient Dashboard</h2>

            {/* ========================= */}
            {/* BOOK APPOINTMENT */}
            {/* ========================= */}
            <div className="card p-3 mb-4">

                <h5>Book Appointment</h5>

                <form onSubmit={handleSubmit}>

                    <select
                        name="doctor"
                        className="form-control mb-2"
                        value={form.doctor}
                        onChange={handleChange}
                    >
                        <option value="">Select Doctor</option>

                        {doctors.length === 0 ? (
                            <option disabled>No doctors found</option>
                        ) : (
                            doctors.map((doc) => (
                                <option key={doc.id} value={doc.id}>
                                    {doc.user_data
                                        ? `Dr. ${doc.user_data.first_name} ${doc.user_data.last_name}`
                                        : `Doctor ${doc.id}`}
                                </option>
                            ))
                        )}
                    </select>

                    <input
                        type="datetime-local"
                        name="date_time"
                        className="form-control mb-2"
                        value={form.date_time}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="reason"
                        className="form-control mb-2"
                        placeholder="Reason"
                        value={form.reason}
                        onChange={handleChange}
                    />

                    <button className="btn btn-primary w-100">
                        Book Appointment
                    </button>

                </form>
            </div>

            {/* ========================= */}
            {/* APPOINTMENTS */}
            {/* ========================= */}
            <h5>My Appointments</h5>

            <table className="table table-bordered mt-3">

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Reason</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {appointments.map((app) => (
                        <tr key={app.id}>
                            <td>{app.id}</td>

                            <td>
                                {typeof app.doctor === "object"
                                    ? `${app.doctor?.first_name || ""} ${app.doctor?.last_name || ""}`
                                    : app.doctor}
                            </td>

                            <td>{app.date_time}</td>
                            <td>{app.reason}</td>

                            <td>
                                <span className={`badge ${
                                    app.status === "pending"
                                        ? "bg-warning"
                                        : app.status === "approved"
                                        ? "bg-success"
                                        : "bg-danger"
                                }`}>
                                    {app.status}
                                </span>
                            </td>

                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    );
}

export default PatientDashboard;