import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { FiLogOut, FiUsers, FiGrid } from "react-icons/fi";

function AdminLayout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, role } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login", { replace: true });
    };

    return (
        <div className="d-flex min-vh-100 bg-light">

            {/* Sidebar */}
            <div
                className="bg-dark text-white p-4 shadow-lg"
                style={{
                    width: "270px",
                    background: "linear-gradient(180deg, #111827, #0b1220)"
                }}
            >

                <h4 className="fw-bold text-info mb-4">
                    🏥 MedAdmin
                </h4>

                <div className="mb-3 text-secondary small">
                    Logged in as: <b className="text-white">{role}</b>
                </div>

                <ul className="list-unstyled">

                    <li className="mb-3">
                        <NavLink
                            to="/admin"
                            end
                            className={({ isActive }) =>
                                `d-flex align-items-center gap-2 p-2 rounded text-decoration-none ${
                                    isActive
                                        ? "bg-info text-dark fw-bold"
                                        : "text-white"
                                }`
                            }
                        >
                            <FiGrid />
                            Dashboard
                        </NavLink>
                    </li>

                    <li className="mb-3">
                        <NavLink
                            to="/admin/users"
                            className={({ isActive }) =>
                                `d-flex align-items-center gap-2 p-2 rounded text-decoration-none ${
                                    isActive
                                        ? "bg-info text-dark fw-bold"
                                        : "text-white"
                                }`
                            }
                        >
                            <FiUsers />
                            Users
                        </NavLink>
                    </li>

                </ul>

                <button
                    onClick={handleLogout}
                    className="btn btn-outline-info w-100 mt-4 d-flex align-items-center justify-content-center gap-2"
                >
                    <FiLogOut /> Logout
                </button>
            </div>

            {/* Main */}
            <div className="flex-grow-1">

                {/* Top bar */}
                <div className="bg-white shadow-sm px-4 py-3 d-flex justify-content-between align-items-center">

                    <h5 className="mb-0 fw-semibold">
                        Welcome, <span className="text-primary">{user?.first_name || "Admin"}</span>
                    </h5>

                    <span className="badge bg-primary px-3 py-2">
                        {role}
                    </span>

                </div>

                <div className="p-4">
                    <Outlet />
                </div>

            </div>
        </div>
    );
}

export default AdminLayout;