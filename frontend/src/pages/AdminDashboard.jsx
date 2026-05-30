import { Outlet } from "react-router-dom";


function AdminDashboard() {
    return (
        <div className="container mt-5">
            <h1>Admin Dashboard</h1>
            <Outlet />
            
        </div>
    );
}

export default AdminDashboard;