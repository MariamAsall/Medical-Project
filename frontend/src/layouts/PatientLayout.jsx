import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";

const NAV_LINKS = [
  { to: "/patient/dashboard",     icon: "🏠", label: "Dashboard" },
  { to: "/patient/appointments",  icon: "📋", label: "My Appointments" },
];

function PatientLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: "#0f172a", color: "#94a3b8",
        display: "flex", flexDirection: "column", padding: "24px 0",
        flexShrink: 0,
      }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ color: "#0d9488", fontWeight: 700, fontSize: 18, letterSpacing: -0.3 }}>
            ⚕ MediCare
          </div>
          <div style={{ fontSize: 11, color: "#475569", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>
            Patient Portal
          </div>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {NAV_LINKS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 8, marginBottom: 4,
                textDecoration: "none", fontSize: 14, fontWeight: 500,
                color: isActive ? "#fff" : "#94a3b8",
                background: isActive ? "#0d9488" : "transparent",
                transition: "all 0.15s",
              })}
            >
              <span>{icon}</span> {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: "1px solid #1e293b" }}>
          <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500, marginBottom: 4 }}>
            {user?.first_name ? `${user.first_name} ${user.last_name || ""}` : "Patient"}
          </div>
          <div style={{ fontSize: 11, color: "#475569", marginBottom: 12 }}>
            {user?.email}
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: "100%", padding: "8px", border: "1px solid #1e293b",
              borderRadius: 8, background: "transparent", color: "#94a3b8",
              cursor: "pointer", fontSize: 13, fontFamily: "inherit",
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
            onMouseOut={(e)  => { e.currentTarget.style.borderColor = "#1e293b"; e.currentTarget.style.color = "#94a3b8"; }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, background: "#f0f4f8", overflow: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default PatientLayout;
