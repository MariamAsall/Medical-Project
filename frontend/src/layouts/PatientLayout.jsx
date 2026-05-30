import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";

function PatientLayout() {

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
                <h4 className="mb-4">Patient Panel</h4>

                <ul className="list-unstyled">

                    <li className="mb-2">
                        <NavLink to="/patient">
                            Dashboard
                        </NavLink>
                    </li>

                    <li className="mb-2">
                        <NavLink to="/patient/appointments">
                            My Appointments
                        </NavLink>
                    </li>

                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1">

                {/* Navbar */}
                <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">

                    <h5>
                        Welcome, {user?.first_name || "Patient"}
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

export default PatientLayout;