import { useEffect, useState } from "react";
import api from "../api/axios";
import { useSelector } from "react-redux";

function DoctorDashboard() {

    const { user } = useSelector((state) => state.auth);

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDoctor = async () => {
        try {
            const res = await api.get("doctors/all/");

            const doctors = Array.isArray(res.data)
                ? res.data
                : res.data.results || [];

            const myDoctor = doctors.find(
                (d) => d.user_data?.id === user?.id
            );

            setDoctor(myDoctor);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctor();
    }, [user]);

    if (loading) return <h3>Loading...</h3>;
    if (!doctor) return <h3>No profile found</h3>;

    return (
        <div className="container mt-4">

            <h2>Doctor Profile</h2>

            <div className="card p-3 shadow mt-3">

                <h4>
                    Dr. {doctor.user_data?.first_name} {doctor.user_data?.last_name}
                </h4>

                <p>{doctor.specialty?.name}</p>

                <p>{doctor.bio}</p>

                <p>{doctor.consultation_fees}</p>

                <p>{doctor.experience_years}</p>

            </div>

        </div>
    );
}

export default DoctorDashboard;