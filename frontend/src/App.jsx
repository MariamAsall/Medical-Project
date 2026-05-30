import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

import {
  Routes,
  Route,
} from "react-router-dom";

import Login from "./components/login";
import Register from "./components/register";
import ProtectedRoute from "./components/ProtectedRoute";


import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import Unauthorized from "./pages/Unauthorized";
import AdminUsers from "./pages/AdminUsers";

function App() {

  return (
    <Routes>

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/unauthorized" element={<Unauthorized />} />

    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
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
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App