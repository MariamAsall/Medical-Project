import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./components/authslice";

import Login from "./components/login";
import Register from "./components/register";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import Unauthorized from "./pages/Unauthorized";
import AdminUsers from "./pages/AdminUsers";
import PatientAppointments from "./pages/PatientAppointments";
import DoctorAppointments from "./pages/DoctorAppointments";
import AddSpecialty from "./pages/AddSpecialty";

import DoctorLayout from "./layouts/DoctorLayout";
import AdminLayout from "./layouts/AdminLayout";
import PatientLayout from "./layouts/PatientLayout";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DoctorProfile from './pages/DoctorProfile';
import DoctorAvailability from './pages/DoctorAvailability';

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // 1. Keep your auth session persistence logic at the top
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (token && role) {
      dispatch(loginSuccess({
        user: null,
        role: role,
      }));
    }

    setLoading(false);
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // 2. Single, unified return statement for your layout and routing
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          {/* Nested under /admin, this resolves perfectly to /admin/specialties/create */}
          <Route path="specialties/create" element={<AddSpecialty />} />
        </Route>

        {/* Doctor Routes */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DoctorDashboard />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="availability" element={<DoctorAvailability />} />
          <Route path="appointments" element={<DoctorAppointments />} />
        </Route>

        {/* Patient Routes */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PatientDashboard />} />
          <Route path="appointments" element={<PatientAppointments />} />
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;