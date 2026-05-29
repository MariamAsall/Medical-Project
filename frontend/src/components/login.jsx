import { useState } from "react";
import api from "../api/axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "./authslice.jsx";
import { Link } from "react-router-dom";
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

            localStorage.setItem(
                "access_token",
                response.data.tokens.access
            );

            localStorage.setItem(
                "refresh_token",
                response.data.tokens.refresh
            );

            dispatch(
                loginSuccess({
                    isAuthenticated: true,
                    role: response.data.user.role.toLowerCase(),
                })
            );

            navigate("/");
        } catch (error) {
            console.log(error.response?.data);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">

            <div className="card shadow p-4" style={{ width: "400px" }}>

                <h3 className="text-center mb-4">Login</h3>

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </div>

                    <button className="btn btn-primary w-100">
                        Login
                    </button>
                    <div className="text-center mt-3">

    <p className="mb-1">
        Don't have an account?
    </p>

    <Link to="/register" className="btn btn-link">
        Create account
    </Link>

</div>

                </form>

            </div>
        </div>
    );
}

export default Login;