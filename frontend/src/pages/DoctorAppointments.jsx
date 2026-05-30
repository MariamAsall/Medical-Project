import { useEffect, useState } from "react";
import api from "../api/axios";
import { notifyError, notifySuccess } from "../utils/notify";
import { useSelector } from "react-redux";

function DoctorAppointments() {

    const { user } = useSelector((state) => state.auth);

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {

        try {

            const res = await api.get("appointments/");

            const data = Array.isArray(res.data)
                ? res.data
                : res.data.results || res.data.appointments || [];

            const validAppointments = data.filter(
                (app) => app.doctor
            );

            const doctorAppointments = validAppointments.filter(
                (app) => app.doctor?.user_data?.id === user?.id
            );

            setAppointments(doctorAppointments);

        } catch (err) {

            console.log(err.response?.data || err);
            notifyError("Failed to load appointments");

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        if (user) {
            fetchAppointments();
        }

    }, [user]);

    const updateStatus = async (id, status) => {

        try {

            await api.patch(`appointments/${id}/`, {
                status,
            });

            notifySuccess("Appointment updated");

            setAppointments((prev) =>
                prev.map((app) =>
                    app.id === id
                        ? { ...app, status }
                        : app
                )
            );

        } catch (err) {

            console.log(err.response?.data || err);
            notifyError("Failed to update");
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <h3>Loading appointments...</h3>
            </div>
        );
    }

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>Doctor Appointments</h2>

                <span className="badge bg-primary">
                    {appointments.length} Appointments
                </span>

            </div>

            <div className="row g-3">

                {appointments.length === 0 ? (

                    <h5>No appointments found</h5>

                ) : (

                    appointments.map((app) => (

                        <div className="col-md-4" key={app.id}>

                            <div className="card shadow border-0 p-3">

                                <h5>
                                    Patient:
                                    {" "}
                                    {app.patient?.user_data?.first_name || "Unknown"}
                                </h5>

                                <p className="mb-1">
                                    📅 {app.date || "No Date"}
                                </p>

                                <p className="mb-3">
                                    Status:
                                    {" "}
                                    <span
                                        className={
                                            app.status === "approved"
                                                ? "text-success"
                                                : app.status === "cancelled"
                                                    ? "text-danger"
                                                    : "text-warning"
                                        }
                                    >
                                        {app.status}
                                    </span>
                                </p>

                                <div className="d-flex gap-2">

                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() =>
                                            updateStatus(app.id, "approved")
                                        }
                                    >
                                        Accept
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() =>
                                            updateStatus(app.id, "cancelled")
                                        }
                                    >
                                        Reject
                                    </button>

                                </div>

                            </div>

                        </div>
                    ))
                )}

            </div>

        </div>
    );
}

export default DoctorAppointments;