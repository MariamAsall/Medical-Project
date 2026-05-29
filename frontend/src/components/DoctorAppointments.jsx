import { useEffect, useState } from "react";
import api from "../api/axios";

function DoctorAppointments() {

    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await api.get("appointments/manage/");
            setAppointments(res.data.results);
        } catch (err) {
            console.log(err);
        }
    };

    // 🔥 UPDATE STATUS (CONFIRM / CANCEL)
    const updateStatus = async (id, status) => {
        try {
            await api.patch(`appointments/manage/${id}/`, {
                status: status
            });

            fetchAppointments(); // refresh

        } catch (err) {
            console.log(err.response?.data);
        }
    };

    return (
        <div className="container mt-4">

            <h3>Doctor Appointments</h3>

            {appointments.map(app => (
                <div key={app.id} className="card p-3 mb-2">

                    <div>
                        <b>Patient:</b> {app.patient}
                    </div>

                    <div>
                        <b>Date:</b> {app.date_time}
                    </div>

                    <div>
                        <b>Status:</b>{" "}
                        <span className="badge bg-info">
                            {app.status}
                        </span>
                    </div>

                    {/* 🔥 ACTION BUTTONS */}
                    <div className="mt-2 d-flex gap-2">

                        {app.status === "pending" && (
                            <>
                                <button
                                    className="btn btn-success"
                                    onClick={() =>
                                        updateStatus(app.id, "confirmed")
                                    }
                                >
                                    Confirm
                                </button>

                                <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                        updateStatus(app.id, "cancelled")
                                    }
                                >
                                    Cancel
                                </button>
                            </>
                        )}

                        {app.status === "confirmed" && (
                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    updateStatus(app.id, "completed")
                                }
                            >
                                Mark Completed
                            </button>
                        )}

                    </div>

                </div>
            ))}

        </div>
    );
}

export default DoctorAppointments;