import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useSelector } from "react-redux";

function DoctorDashboard() {

    const { user } = useSelector((state) => state.auth);

    const [doctor, setDoctor] = useState(null);
    const [specialty, setSpecialty] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDoctor = async () => {
        try {
            const res = await api.get("doctors/profiles/");

            const doctors = Array.isArray(res.data)
                ? res.data
                : res.data.results || [];

            const myDoctor = doctors[0];

            setDoctor(myDoctor);

            const specialtiesRes =
                await api.get("doctors/specialties/");

            const specialty = specialtiesRes.data.results.find(
                (s) => s.id === myDoctor.specialty
            );

            setSpecialty(specialty);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctor();
    }, []);

    if (loading) return <h3>Loading...</h3>;
    if (!doctor) return <h3>No profile found</h3>;

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center">
                <h2>Doctor Profile</h2>
                <Link to="/doctor/profile"
                    className="btn btn-danger btn-sm py-2"
                >
                    Edit my profile
                </Link>
            </div>

            <div className="card p-3 shadow mt-3">

                <h4>
                    Dr. {doctor.user_data?.first_name} {doctor.user_data?.last_name}
                </h4>
                <p>Phone number: {doctor.phone}</p>

                <p>Specialty: {specialty?.name}</p>

                <p>Bio: {doctor.bio}</p>

                <p>Consultation fees: {doctor.consultation_fees} EGP</p>

                <p>Years of experience: {doctor.experience_years}</p>

            </div>

        </div>
    );
}

export default DoctorDashboard;