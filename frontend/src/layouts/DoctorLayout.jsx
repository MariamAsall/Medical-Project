import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";

function DoctorLayout() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, role } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login", { replace: true });
    };

    return (
        <div className="d-flex">

            {/* Sidebar */}
            <div
                className="bg-dark text-white p-3"
                style={{ width: "250px", minHeight: "100vh" }}
            >
                <h4 className="mb-4">Doctor Panel</h4>

                <ul className="list-unstyled">

                    <li className="mb-2">
                        <NavLink
                            to="/doctor"
                            end
                            className={({ isActive }) =>
                                isActive
                                    ? "text-warning fw-bold text-decoration-none"
                                    : "text-white text-decoration-none"
                            }
                        >
                            Dashboard
                        </NavLink>
                    </li>
                    <li className="mb-2">
                        <NavLink
                            to="/doctor/availability"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-warning fw-bold text-decoration-none"
                                    : "text-white text-decoration-none"
                            }
                        >
                            Availability
                        </NavLink>
                    </li>
                    <li className="mb-2">
                        <NavLink
                            to="/doctor/appointments"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-warning fw-bold text-decoration-none"
                                    : "text-white text-decoration-none"
                            }
                        >
                            Appointments
                        </NavLink>
                    </li>

                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1">

                {/* Navbar */}
                <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">

                    <h5>
                        Welcome Dr. {user?.first_name || "Doctor"}
                    </h5>

                    <div className="d-flex align-items-center gap-3">

                        <span className="badge bg-primary">
                            {role}
                        </span>

                        <button
                            className="btn btn-danger btn-sm"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </div>

                </div>

                {/* Page Content */}
                <div className="p-4">
                    <Outlet />
                </div>

            </div>

        </div>
    );
}

export default DoctorLayout;