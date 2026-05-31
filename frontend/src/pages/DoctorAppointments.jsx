import { useEffect, useState } from "react";
import api from "../api/axios";
import { notifySuccess, notifyError } from "../utils/notify";

function DoctorAppointments() {

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);

    // =========================
    // GET APPOINTMENTS
    // =========================
    const fetchAppointments = async () => {
        try {
            const res = await api.get("appointments/manage/");

            console.log("APPOINTMENTS:", res.data);

            const data = Array.isArray(res.data)
                ? res.data
                : res.data.results || res.data.appointments || [];

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

    // =========================
    // ACCEPT APPOINTMENT
    // =========================
    const handleAccept = async (id) => {
        try {
            setLoadingId(id);

            await api.patch(`appointments/manage/${id}/`, {
                status: "confirmed"
            });

            notifySuccess("Appointment confirmed");
            fetchAppointments();

        } catch (err) {
            notifyError("Failed to confirmed");

        } finally {
            setLoadingId(null);
        }
    };

    // =========================
    // REJECT APPOINTMENT
    // =========================
    const handleReject = async (id) => {
        try {
            setLoadingId(id);

            await api.patch(`appointments/manage/${id}/`, {
                status: "cancelled"
            });

            notifySuccess("Appointment rejected");
            fetchAppointments();

        } catch (err) {
            notifyError("Failed to reject");

        } finally {
            setLoadingId(null);
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <h4>Loading appointments...</h4>
            </div>
        );
    }

    return (
        <div className="container mt-4">

            <h2 className="mb-4">Doctor Appointments</h2>

            <div className="row g-3">

                {appointments.length === 0 ? (
                    <p className="text-center">No appointments found</p>
                ) : (
                    appointments.map((app) => (
                        <div className="col-md-4" key={app.id}>

                            <div className="card shadow-sm border-0 p-3">

                                {/* PATIENT NAME */}
                              <h5>
    Patient: {app.patient_name}
</h5>

                                {/* DATE */}
                              <p>
    📅 {new Date(app.date_time).toLocaleString()}
</p>

                                {/* STATUS */}
                                <p>
                                    Status:{" "}
                                    <span className={
                                        app.status === "confirmed"
                                            ? "text-success"
                                            : app.status === "cancelled"
                                                ? "text-danger"
                                                : "text-warning"
                                    }>
                                        {app.status || "pending"}
                                    </span>
                                </p>

                                {/* ACTIONS */}
                                <button
                                    className="btn btn-success btn-sm me-2"
                                    disabled={loadingId === app.id}
                                    onClick={() => handleAccept(app.id)}
                                >
                                    Accept
                                </button>

                                <button
                                    className="btn btn-danger btn-sm"
                                    disabled={loadingId === app.id}
                                    onClick={() => handleReject(app.id)}
                                >
                                    Reject
                                </button>

                            </div>

                        </div>
                    ))
                )}

            </div>

        </div>
    );
}

export default DoctorAppointments;