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

function Unauthorized() {
  return <h1>🚫 Unauthorized Access</h1>;
}

function App() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "doctor",
              "patient",
            ]}
          >
            <h1>Protected Content</h1>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App