import { useEffect, useState } from "react";
import api from "../api/axios";
import { notifySuccess, notifyError } from "../utils/notify";

function DoctorAppointments() {

    const [appointments, setAppointments] = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [loadingId,    setLoadingId]    = useState(null);
    const [notes, setNotes] = useState({});

    const fetchAppointments = async () => {
        try {
            const res  = await api.get("appointments/manage/");
            const data = Array.isArray(res.data)
                ? res.data
                : res.data.results || res.data.appointments || [];
            setAppointments(data);
        } catch (err) {
            notifyError("Failed to load appointments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleAccept = async (id) => {
        try {
            setLoadingId(id);
            await api.patch(`appointments/manage/${id}/`, {
                status: "confirmed",
                notes:  notes[id] || "",
            });
            notifySuccess("Appointment confirmed");
            fetchAppointments();
        } catch (err) {
            notifyError("Failed to confirm");
        } finally {
            setLoadingId(null);
        }
    };

    const handleReject = async (id) => {
        try {
            setLoadingId(id);
            await api.patch(`appointments/manage/${id}/`, {
                status: "cancelled",
                notes:  notes[id] || "",
            });
            notifySuccess("Appointment rejected");
            fetchAppointments();
        } catch (err) {
            notifyError("Failed to reject");
        } finally {
            setLoadingId(null);
        }
    };

    if (loading) return <h4>Loading appointments...</h4>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">My Appointments</h2>

            <div className="row g-3">
                {appointments.length === 0 ? (
                    <p>No appointments found</p>
                ) : (
                    appointments.map((app) => (
                        <div className="col-md-4" key={app.id}>
                            <div className="card shadow-sm border-0 p-3">

                                <h5>Patient: {app.patient_name}</h5>

                                <p>📅 {new Date(app.date_time).toLocaleString()}</p>

                                <p>Reason: {app.reason || "—"}</p>

                                <p>
                                    Status:{" "}
                                    <span className={
                                        app.status === "confirmed" ? "text-success" :
                                        app.status === "cancelled" ? "text-danger"  :
                                        app.status === "completed" ? "text-primary" :
                                        "text-warning"
                                    }>
                                        {app.status}
                                    </span>
                                </p>

                                {app.notes && (
                                    <p>Notes: {app.notes}</p>
                                )}

                                {app.status === "pending" && (
                                    <>
                                        <textarea
                                            className="form-control mb-2"
                                            rows={2}
                                            placeholder="Add notes (optional)"
                                            value={notes[app.id] || ""}
                                            onChange={(e) =>
                                                setNotes({
                                                    ...notes,
                                                    [app.id]: e.target.value
                                                })
                                            }
                                        />

                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-success btn-sm"
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
                                    </>
                                )}

                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default DoctorAppointments;