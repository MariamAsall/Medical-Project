import { useEffect, useState } from "react";
import api from "../api/axios";

function DoctorDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            const res = await api.get("appointments/");

            console.log("API RESPONSE:", res.data);

            // 🔥 handling different backend shapes
            const data =
                res.data?.results ||
                res.data?.appointments ||
                res.data ||
                [];

            // 🔥 ensure it's always array
            setAppointments(Array.isArray(data) ? data : []);

        } catch (err) {
            console.log("ERROR:", err.response?.data || err);
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Accept appointment
    const handleAccept = async (id) => {
        try {
            await api.patch(`appointments/${id}/`, {
                status: "accepted",
            });

            fetchAppointments();
        } catch (err) {
            console.log(err);
        }
    };

    // Reject appointment
    const handleReject = async (id) => {
        try {
            await api.patch(`appointments/${id}/`, {
                status: "rejected",
            });

            fetchAppointments();
        } catch (err) {
            console.log(err);
        }
    };

    if (loading) {
        return <h3 className="text-center mt-5">Loading...</h3>;
    }

    return (
        <div className="container mt-4">

            <h2 className="mb-4">Doctor Dashboard</h2>

            {appointments.length === 0 ? (
                <h5>No Appointments Found</h5>
            ) : (
                <table className="table table-bordered">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Patient</th>
                            <th>Date</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {appointments.map((app) => (
                            <tr key={app.id}>
                                <td>{app.id}</td>
                                <td>{app.patient}</td>
                                <td>{app.date_time}</td>
                                <td>{app.reason}</td>

                                <td>
                                    <span className={`badge ${
                                        app.status === "pending"
                                            ? "bg-warning"
                                            : app.status === "accepted"
                                            ? "bg-success"
                                            : "bg-danger"
                                    }`}>
                                        {app.status}
                                    </span>
                                </td>

                                <td>
                                    <button
                                        className="btn btn-success btn-sm me-2"
                                        onClick={() => handleAccept(app.id)}
                                        disabled={app.status !== "pending"}
                                    >
                                        Accept
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleReject(app.id)}
                                        disabled={app.status !== "pending"}
                                    >
                                        Reject
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            )}
        </div>
    );
}

export default DoctorDashboard;