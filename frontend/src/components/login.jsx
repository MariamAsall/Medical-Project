import { useState } from "react";
import api from "../api/axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "./authslice.jsx";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("auth/login/", formData);
            console.log(response.data);
            // Save tokens
            localStorage.setItem(
                "access_token",
                 response.data.tokens.access
);

            localStorage.setItem(
                "refresh_token",
                response.data.tokens.refresh );

            // Save user data in redux
            dispatch(
                loginSuccess({
                    isAuthenticated: true,   role: response.data.user.role.toLowerCase(),  })
            );

            navigate("/");
        } catch (error) {
            console.log(error.response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
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

            <button type="submit">
                Login
            </button>
        </form>
    );
}

export default Login;