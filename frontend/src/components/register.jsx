import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "patient",
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

            navigate("/login");
        } catch (error) {
            console.log(error.response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
            />

            <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
            />

            <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
            />

            <select
                name="role"
                onChange={handleChange}
            >
                <option value="patient">
                    Patient
                </option>

                <option value="doctor">
                    Doctor
                </option>
            </select>

            <button type="submit">
                Register
            </button>
        </form>
    );
}

export default Register;