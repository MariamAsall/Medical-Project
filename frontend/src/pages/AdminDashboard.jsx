import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function AdminDashboard() {

    const [stats, setStats] = useState({
        users: 0,
        doctors: 0,
        patients: 0,
        appointments: 0,
    });

    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);

    // New search and filter states
    const [doctorSearch, setDoctorSearch] = useState("");
    const [patientSearch, setPatientSearch] = useState("");
    const [dayFilter, setDayFilter] = useState("");

    const fetchData = async () => {
        try {
            const [
                usersRes,
                appointmentsRes,
                doctorsRes,
                availabilityRes,
                specialtiesRes
            ] = await Promise.all([
                api.get("auth/admin/users/"),
                api.get("appointments/manage/"),
                api.get("doctors/profiles/all"),
                api.get("availability/"),
                api.get("doctors/specialties/"),
            ]);

            const users = usersRes.data.users || [];

            const appointmentsData =
                appointmentsRes.data?.results ||
                appointmentsRes.data?.appointments || [];

            const doctorsData =
                doctorsRes.data?.results || doctorsRes.data || [];

            const availabilityData =
                availabilityRes.data?.results || availabilityRes.data || [];

            const specialtiesData =
                specialtiesRes.data?.results || specialtiesRes.data || [];

            setAppointments(appointmentsData);
            setDoctors(doctorsData);
            setAvailability(availabilityData);
            setSpecialties(specialtiesData);

            setStats({
                users: users.length,
                doctors: users.filter(u => u.role === "DOCTOR").length,
                patients: users.filter(u => u.role === "PATIENT").length,
                appointments: appointmentsData.length,
            });

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getSpecialtyName = (id) => {
        const spec = specialties.find(s => s.id === id);
        return spec ? spec.name : "Unknown";
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" />
                <p className="mt-2">Loading dashboard...</p>
            </div>
        );
    }

    const cards = [
        { label: "Users", value: stats.users, color: "primary" },
        { label: "Doctors", value: stats.doctors, color: "success" },
        { label: "Patients", value: stats.patients, color: "info" },
        { label: "Appointments", value: stats.appointments, color: "warning" },
    ];

    // Filter logic to narrow down visible doctor items
    const filteredDoctors = doctors.filter(doctor => {
        const firstName = doctor.user_data?.first_name || "";
        const lastName = doctor.user_data?.last_name || "";
        const fullName = `${firstName} ${lastName}`.toLowerCase();
        
        // 1. Match doctor name
        const matchesDoctor = fullName.includes(doctorSearch.toLowerCase());
        if (!matchesDoctor) return false;

        const doctorAppointments = appointments.filter(app => app.doctor === doctor.id);
        const doctorAvailability = availability.filter(slot => slot.doctor === doctor.id);

        // 2. Match patient name within doctor's appointments
        const matchesPatient = patientSearch === "" ? true : doctorAppointments.some(app => 
            (app.patient_name || "").toLowerCase().includes(patientSearch.toLowerCase())
        );

        // 3. Match day filter within doctor's availability slots OR schedule dates
        const matchesDay = dayFilter === "" ? true : (
            doctorAvailability.some(slot => (slot.weekday_name || "").toLowerCase() === dayFilter.toLowerCase()) ||
            doctorAppointments.some(app => {
                const date = new Date(app.date_time);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                return dayName.toLowerCase() === dayFilter.toLowerCase();
            })
        );

        return matchesPatient && matchesDay;
    });

    const weekdays = [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ];

    return (
        <div className="container-fluid">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-0">Admin Dashboard</h2>
                    <small className="text-muted">Overview of system activity</small>
                </div>

                <Link to="/admin/specialties/create" className="btn btn-dark px-4">
                    + Add Specialty
                </Link>
            </div>

            {/* STATS CARDS */}
            <div className="row g-4 mb-5">
                {cards.map((c, i) => (
                    <div className="col-md-3" key={i}>
                        <div className={`card border-0 shadow-sm p-3 bg-${c.color} bg-opacity-10 rounded-4`}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted mb-1">{c.label}</h6>
                                    <h3 className="fw-bold mb-0">{c.value}</h3>
                                </div>
                                <div className={`fs-3 text-${c.color}`}>●</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* SEARCH AND FILTERS BAR */}
            <div className="card border-0 shadow-sm mb-5 rounded-4 bg-light">
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">Search & Filter Overview</h5>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label small text-muted fw-semibold">Search Doctor</label>
                            <input 
                                type="text" 
                                className="form-control rounded-3" 
                                placeholder="Enter doctor's name..." 
                                value={doctorSearch}
                                onChange={(e) => setDoctorSearch(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small text-muted fw-semibold">Search Patient</label>
                            <input 
                                type="text" 
                                className="form-control rounded-3" 
                                placeholder="Enter patient's name..." 
                                value={patientSearch}
                                onChange={(e) => setPatientSearch(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small text-muted fw-semibold">Filter by Weekday</label>
                            <select 
                                className="form-select rounded-3"
                                value={dayFilter}
                                onChange={(e) => setDayFilter(e.target.value)}
                            >
                                <option value="">All Days</option>
                                {weekdays.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {(doctorSearch || patientSearch || dayFilter) && (
                        <div className="mt-3 d-flex justify-content-end">
                            <button 
                                className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                                onClick={() => {
                                    setDoctorSearch("");
                                    setPatientSearch("");
                                    setDayFilter("");
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* DOCTORS SECTION */}
            <h4 className="fw-bold mb-3">Doctors Overview</h4>

            {filteredDoctors.length === 0 ? (
                <div className="card border-0 shadow-sm mb-5 p-5 text-center rounded-4 text-muted">
                    <h5>No doctors match your filtering criteria.</h5>
                </div>
            ) : (
                filteredDoctors.map(doctor => {

                    // Narrow down appointments under this doctor based on search filters
                    let doctorAppointments = appointments.filter(
                        app => app.doctor === doctor.id
                    );

                    if (patientSearch) {
                        doctorAppointments = doctorAppointments.filter(app => 
                            (app.patient_name || "").toLowerCase().includes(patientSearch.toLowerCase())
                        );
                    }

                    if (dayFilter) {
                        doctorAppointments = doctorAppointments.filter(app => {
                            const date = new Date(app.date_time);
                            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                            return dayName.toLowerCase() === dayFilter.toLowerCase();
                        });
                    }

                    // Narrow down availability under this doctor based on day filter
                    let doctorAvailability = availability.filter(
                        slot => slot.doctor === doctor.id
                    );

                    if (dayFilter) {
                        doctorAvailability = doctorAvailability.filter(slot => 
                            (slot.weekday_name || "").toLowerCase() === dayFilter.toLowerCase()
                        );
                    }

                    return (
                        <div key={doctor.id} className="card border-0 shadow-sm mb-4 rounded-4">

                            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center pt-3">
                                <div>
                                    <h5 className="mb-0 fw-bold">
                                        Dr. {doctor.user_data?.first_name} {doctor.user_data?.last_name}
                                    </h5>
                                    <small className="text-muted">
                                        {doctor.user_data?.email}
                                    </small>
                                </div>
                                <span className="badge bg-primary px-3 py-2">
                                    {doctor.experience_years} yrs exp
                                </span>
                            </div>

                            <div className="card-body">

                                <p className="mb-3">
                                    <strong>Specialty:</strong>{" "}
                                    {getSpecialtyName(doctor.specialty)}
                                </p>

                                {/* APPOINTMENTS TABLE */}
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">

                                        <thead className="table-light">
                                            <tr>
                                                <th>Patient</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Reason</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {doctorAppointments.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" className="text-center text-muted py-4">
                                                        No matching appointments found
                                                    </td>
                                                </tr>
                                            ) : (
                                                doctorAppointments.map(app => (
                                                    <tr key={app.id}>
                                                        <td className="fw-semibold">{app.patient_name}</td>
                                                        <td>{new Date(app.date_time).toLocaleString()}</td>
                                                        <td>
                                                            <span className={`badge rounded-pill px-3 py-2 ${
                                                                app.status === "confirmed"
                                                                    ? "bg-success"
                                                                    : app.status === "cancelled"
                                                                    ? "bg-danger"
                                                                    : "bg-warning text-dark"
                                                            }`}>
                                                                {app.status}
                                                            </span>
                                                        </td>
                                                        <td className="text-muted">{app.reason}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>

                                    </table>
                                </div>

                                {/* AVAILABILITY TABLE */}
                                <div className="mt-4">

                                    <h6 className="fw-bold mb-3">Availability</h6>

                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">

                                            <thead className="table-light">
                                                <tr>
                                                    <th>Day</th>
                                                    <th>From</th>
                                                    <th>To</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {doctorAvailability.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="3" className="text-center text-muted py-3">
                                                            No matching availability found
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    doctorAvailability.map(slot => (
                                                        <tr key={slot.id}>
                                                            <td className="fw-semibold">{slot.weekday_name}</td>
                                                            <td>{slot.start_time}</td>
                                                            <td>{slot.end_time}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>

                                        </table>
                                    </div>

                                </div>
                   

                            </div>
                        </div>
                    );
                })
            )}

            {/* SPECIALTIES TABLE */}
            <h4 className="fw-bold mb-3">Specialties</h4>

            <div className="card border-0 shadow-sm mb-5 rounded-4">
                <div className="card-body table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Specialty Name</th>
                                <th>Doctors Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {specialties.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center text-muted py-3">
                                        No specialties found
                                    </td>
                                </tr>
                            ) : (
                                specialties.map(spec => {
                                    const count = doctors.filter(
                                        d => d.specialty === spec.id
                                    ).length;

                                    return (
                                        <tr key={spec.id}>
                                            <td className="fw-semibold">{spec.id}</td>
                                            <td>{spec.name}</td>
                                            <td>
                                                <span className="badge bg-primary px-3 py-2">
                                                    {count}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

export default AdminDashboard;