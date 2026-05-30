import { Outlet } from "react-router-dom";

import AdminUsers from "./AdminUsers";

function AdminDashboard() {
    return (
        <div className="container mt-5">
            <h1>Admin Dashboard</h1>
            <AdminUsers />
            
        </div>
    );
}

export default AdminDashboard;