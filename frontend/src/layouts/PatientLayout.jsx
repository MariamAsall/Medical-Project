import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { FiLogOut, FiGrid, FiCalendar, FiUser } from "react-icons/fi";
import "../layouts/layout.css";

const NAV_LINKS = [
  { to: "/patient/dashboard",    icon: <FiGrid />,     label: "Dashboard" },
  { to: "/patient/appointments", icon: <FiCalendar />, label: "My Appointments" },
  { to: "/patient/profile",      icon: <FiUser />,     label: "My Profile" },
];

function PatientLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const initials = user?.first_name
    ? `${user.first_name[0]}${user.last_name?.[0] || ""}`.toUpperCase()
    : "PT";

  return (
    <div className="layout-wrapper">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="sidebar-brand">
          <div className="brand-icon">✚</div>
          <div className="brand-text">
            <span className="brand-name">MediBook</span>
            <span className="brand-role">Patient Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_LINKS.map(({ to, icon, label }) => (
            <NavLink key={to} to={to}>
              {icon} {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <p className="user-name">
                {user?.first_name
                  ? `${user.first_name} ${user.last_name || ""}`
                  : "Patient"}
              </p>
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
            <h5>
              Welcome,{" "}
              <span>
                {user?.first_name
                  ? `${user.first_name} ${user.last_name || ""}`
                  : "Patient"}
              </span>
            </h5>
          </div>
          <div className="topbar-right">
            <span className="role-badge">patient</span>
          </div>
        </header>

        <div className="layout-content">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default PatientLayout;
