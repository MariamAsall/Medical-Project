import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../utils/notify";


function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        password_confirm: "",
        first_name: "",
        last_name: "",
        role: "PATIENT",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("auth/register/", formData);
            notifySuccess("register successfully");

            navigate("/login");

        } catch (error) {
            
         notifyError("Passwords do not match.");

        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center my-5">

            <div className="card shadow p-4" style={{ width: "450px" }}>

                <h3 className="text-center mb-4">Register</h3>

                <form onSubmit={handleSubmit}>

                    <input className="form-control mb-2" name="username" placeholder="Username" onChange={handleChange} />

                    <input className="form-control mb-2" name="email" placeholder="Email" onChange={handleChange} />

                    <input className="form-control mb-2" type="password" name="password" placeholder="Password" onChange={handleChange} />

                    <input className="form-control mb-2" type="password" name="password_confirm" placeholder="Confirm Password" onChange={handleChange} />

                    <input className="form-control mb-2" name="first_name" placeholder="First Name" onChange={handleChange} />

                    <input className="form-control mb-2" name="last_name" placeholder="Last Name" onChange={handleChange} />

                    <select className="form-select mb-3" name="role" onChange={handleChange}>
                        <option value="PATIENT">Patient</option>
                        <option value="DOCTOR">Doctor</option>
                    </select>

                    <button className="btn btn-success w-100">
                        Register
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Register;