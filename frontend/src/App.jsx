import { Routes, Route } from "react-router-dom";

import Login from "./components/login";
import Register from "./components/register";

import DoctorAvailability from "./components/DoctorAvailability";
import DoctorProfileForm from "./components/DoctorProfileForm";
import AppointmentsPage from "./components/AppointmentsPage";
import DoctorAppointments from "./components/DoctorAppointments";

import ProtectedRoute from "./components/ProtectedRoute";


import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import Unauthorized from "./pages/Unauthorized";
import AdminUsers from "./pages/AdminUsers";
import PatientAppointments from "./pages/PatientAppointments";
import DoctorAppointments from "./pages/DoctorAppointments";


import DoctorLayout from "./layouts/DoctorLayout";
import AdminLayout from "./layouts/AdminLayout";
import PatientLayout from './layouts/PatientLayout';



//Notification
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {

  return (
    <>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

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
        </Route>

        <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorAppointments />} />
          </Route>

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