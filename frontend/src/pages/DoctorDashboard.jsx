import { useEffect, useState } from "react";
import api from "../api/axios";
import { useSelector } from "react-redux";

function DoctorDashboard() {

    const { user } = useSelector((state) => state.auth);

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {

        try {

            const res = await api.get("appointments/");

            const data = Array.isArray(res.data)
                ? res.data
                : res.data.results || [];

            setAppointments(data);

        } catch (err) {

            console.log(err.response?.data || err);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    if (loading) {
        return <h3 className="text-center mt-5">Loading...</h3>;
    }

    return (
        <div className="container mt-4">

            <h2 className="mb-4">
                Welcome Dr. {user?.first_name}
            </h2>

            <div className="row g-3">

                <div className="col-md-6">
                    <div className="card p-4 text-center shadow">
                        <h5>Total Appointments</h5>
                        <h2>{appointments.length}</h2>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card p-4 text-center shadow">
                        <h5>Pending</h5>
                        <h2>
                            {appointments.filter(a => a.status === "pending").length}
                        </h2>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default DoctorDashboard;