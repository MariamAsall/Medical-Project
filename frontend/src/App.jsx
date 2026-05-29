import { Routes, Route } from "react-router-dom";

import Login from "./components/login";
import Register from "./components/register";

import DoctorAvailability from "./components/DoctorAvailability";
import DoctorProfileForm from "./components/DoctorProfileForm";
import AppointmentsPage from "./components/AppointmentsPage";
import DoctorAppointments from "./components/DoctorAppointments";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Routes>

            {/* PUBLIC */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* PROTECTED GROUP */}
            <Route
                element={<ProtectedRoute allowedRoles={["patient", "doctor", "admin"]} />}
            >
                <Route
                    path="/appointments"
                    element={<AppointmentsPage />}
                />
            </Route>

            {/* DOCTOR ONLY */}
            <Route
                element={<ProtectedRoute allowedRoles={["doctor"]} />}
            >
                <Route
                    path="/doctor/profile"
                    element={<DoctorProfileForm />}
                />

                <Route
                    path="/doctor/availability"
                    element={<DoctorAvailability />}
                />

                <Route
                    path="/doctor/appointments"
                    element={<DoctorAppointments />}
                />
            </Route>

        </Routes>
    );
}

export default App;