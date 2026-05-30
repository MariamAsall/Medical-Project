import { useEffect, useState } from "react";
import api from "../api/axios";

function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        doctors: 0,
        patients: 0,
        appointments: 0,
    });

    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const [usersRes, appointmentsRes] = await Promise.all([
                api.get("auth/admin/users/"),
                api.get("appointments/")
            ]);

            const users = usersRes.data.users;

            const appointmentsData =
                appointmentsRes.data?.results ||
                appointmentsRes.data?.appointments ||
                appointmentsRes.data ||
                [];

            const appointments = Array.isArray(appointmentsData)
                ? appointmentsData
                : [];

            setStats({
                users: users.length,
                doctors: users.filter(u => u.role === "DOCTOR").length,
                patients: users.filter(u => u.role === "PATIENT").length,
                appointments: appointments.length,
            });

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return <h3 className="text-center mt-5">Loading dashboard...</h3>;
    }

    return (
        <div className="container mt-4">

            <h2 className="mb-4">Admin Dashboard</h2>

            <div className="row g-3">

                <div className="col-md-3">
                    <div className="card p-3 shadow text-center border-0">
                        <h6 className="text-muted">Total Users</h6>
                        <h2>{stats.users}</h2>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card p-3 shadow text-center border-0">
                        <h6 className="text-muted">Doctors</h6>
                        <h2>{stats.doctors}</h2>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card p-3 shadow text-center border-0">
                        <h6 className="text-muted">Patients</h6>
                        <h2>{stats.patients}</h2>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card p-3 shadow text-center border-0">
                        <h6 className="text-muted">Appointments</h6>
                        <h2>{stats.appointments}</h2>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;