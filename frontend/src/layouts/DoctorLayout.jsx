import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { FiLogOut, FiGrid, FiCalendar, FiClock, FiUser } from "react-icons/fi";
import "../layouts/layout.css";

function DoctorLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const initials = user?.first_name
    ? `${user.first_name[0]}${user.last_name?.[0] || ""}`.toUpperCase()
    : "DR";

  return (
    <div className="layout-wrapper">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="sidebar-brand">
          <div className="brand-icon">✚</div>
          <div className="brand-text">
            <span className="brand-name">MediBook</span>
            <span className="brand-role">Doctor Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/doctor" end>
            <FiGrid /> Dashboard
          </NavLink>
          <NavLink to="/doctor/profile">
            <FiUser /> My Profile
          </NavLink>
          <NavLink to="/doctor/availability">
            <FiClock /> Availability
          </NavLink>
          <NavLink to="/doctor/appointments">
            <FiCalendar /> Appointments
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <p className="user-name">Dr. {user?.first_name || "Doctor"}</p>
              <p className="user-email">{user?.email || ""}</p>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            <FiLogOut size={14} /> Sign out
          </button>
        </div>

      </aside>

      {/* Main */}
      <div className="layout-main">

        <header className="topbar">
          <div className="topbar-left">
            <h5>Welcome, <span>Dr. {user?.first_name || "Doctor"}</span></h5>
          </div>
          <div className="topbar-right">
            <span className="role-badge">{role}</span>
          </div>
        </header>

        <div className="layout-content">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default DoctorLayout;
