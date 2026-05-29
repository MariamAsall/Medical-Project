import { useEffect, useState } from "react";
import api from "../api/axios";

function AppointmentsPage() {

  const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [form, setForm] = useState({
        doctor: "",
        date_time: "",
        reason: ""
    });

    // 🔥 GET APPOINTMENTS
useEffect(() => {
    api.get("appointments/manage/")
        .then((res) => {
            console.log("API RESPONSE:", res.data);

            setAppointments(res.data.appointments || []);
        })
        .catch((err) => {
            console.log(err);
            setAppointments([]); // مهم جدًا
        });
}, []);


    // 🔥 GET DOCTORS
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await api.get("doctors/profiles/all");
                setDoctors(res.data.res);
            } catch (err) {
                console.log(err);
            }
        };

        fetchDoctors();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // 🔥 BOOK APPOINTMENT
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("appointments/book/", form);

            alert("Appointment booked!");

            // refresh list
            const res = await api.get("appointments/");
            setAppointments(res.data);

        } catch (err) {
            console.log(err.response?.data);
        }
    };

    return (
        <div className="container mt-4">

            <h3>Appointments</h3>

            {/* FORM */}
            <div className="card p-3 mb-4">

                <h5>Book Appointment</h5>

                <form onSubmit={handleSubmit}>

                    {/* DOCTOR */}
                    <select
                        className="form-control mb-2"
                        name="doctor"
                        value={form.doctor}
                        onChange={handleChange}
                    >
                        <option value="">
                            Select Doctor
                        </option>

                        {doctors.map(doc => (
                            <option
                                key={doc.id}
                                value={doc.id}
                            >
                                {doc.user?.username || "Doctor"}
                            </option>
                        ))}
                    </select>

                    {/* DATE TIME */}
                    <input
                        type="datetime-local"
                        className="form-control mb-2"
                        name="date_time"
                        value={form.date_time}
                        onChange={handleChange}
                    />

                    {/* REASON */}
                    <textarea
                        className="form-control mb-2"
                        name="reason"
                        placeholder="Reason"
                        value={form.reason}
                        onChange={handleChange}
                    />

                    <button className="btn btn-primary w-100">
                        Book Appointment
                    </button>

                </form>

            </div>

            {/* LIST */}
            <div className="card p-3">

                <h5>Your Appointments</h5>

                {appointments.length === 0 ? (
                    <p>No appointments yet</p>
                ) : (
                    appointments.map(app => (
                        <div
                            key={app.id}
                            className="border p-2 mb-2"
                        >

                            <div>
                                <b>Doctor:</b> {app.doctor_name}
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

                        </div>
                    ))
                )}

            </div>

        </div>
    );
}

export default AppointmentsPage;