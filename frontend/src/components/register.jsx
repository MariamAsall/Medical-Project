import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
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

            navigate("/login");
        } catch (error) {
            console.log(error.response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label> username </label>
            <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
            />
<label> email </label>
            <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
            />

        <label> password </label>
            <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
            />

            <label> password_confirm </label>
            <input type="password" name="password_confirm" placeholder="Confirm Password" onChange={handleChange} />


<label> first_name </label>
            <input type ="text" name="first_name" placeholder="First Name" onChange={handleChange} />
            <label> last_name </label>
            <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} />


<label> role </label>
            <select
                name="role"
                onChange={handleChange}
            >
                <option value="PATIENT">
                    Patient
                </option>

                <option value="DOCTOR">
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