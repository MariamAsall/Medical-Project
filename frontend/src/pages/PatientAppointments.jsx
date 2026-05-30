import { useEffect, useState } from "react";
import api from "../api/axios";
import { notifyError } from "../utils/notify";

function PatientAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            const res = await api.get("appointments/manage/");
            // ✅ paginated response — data is inside results
            const data = res.data.results || res.data || [];
            setAppointments(data);
        } catch (err) {
            console.log(err.response?.data || err);
            notifyError("Failed to load appointments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    if (loading) return <div className="text-center mt-5"><h4>Loading appointments...</h4></div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">My Appointments</h2>
            <div className="row g-3">
                {appointments.length === 0 ? (
                    <p className="text-center">No appointments found</p>
                ) : (
                    appointments.map((app) => (
                        <div className="col-md-4" key={app.id}>
                            <div className="card shadow-sm border-0 p-3">

                                <h5>
                                    Dr. {app.doctor?.user_data?.first_name || "Unknown"}{" "}
                                    {app.doctor?.user_data?.last_name || ""}
                                </h5>

                                <p>🩺 {app.doctor?.specialty || "N/A"}</p>

                                <p>🩺 {app.doctor?.specialty?.name || app.doctor?.specialty || "N/A"}</p>

                                <p>📅 {app.date_time ? new Date(app.date_time).toLocaleString() : "Not set"}</p>

                                <p>📋 {app.reason || "No reason provided"}</p>

                                {app.notes && <p>📝 {app.notes}</p>}

                                <p>
                                    Status:{" "}
                                    <span className={
                                        app.status === "approved" || app.status === "confirmed"
                                            ? "text-success"
                                            : app.status === "cancelled"
                                            ? "text-danger"
                                            : "text-warning"
                                    }>
                                        {app.status || "pending"}
                                    </span>
                                </p>

                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default PatientAppointments;