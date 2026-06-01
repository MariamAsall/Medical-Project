import { useEffect, useState } from "react";
import api from "../api/axios";
import { notifySuccess, notifyError } from "../utils/notify";

function AdminUsers() {

    const [users, setUsers] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    const fetchUsers = () => {
        api.get("auth/admin/users/")
            .then(res => setUsers(res.data.users))
            .catch(() => notifyError("Failed to fetch users"));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleApprove = async (id) => {
        try {
            setLoadingId(id);
            await api.patch(`auth/admin/users/${id}/approve/`);
            notifySuccess("User approved successfully");
            fetchUsers();
        } catch (err) {
            notifyError("Something went wrong");
            console.log(err);
        } finally {
            setLoadingId(null);
        }
    };

    const handleBlock = async (id) => {
        try {
            setLoadingId(id);
            await api.patch(`auth/admin/users/${id}/block/`);
            notifySuccess("User blocked successfully");
            fetchUsers();
        } catch (err) {
            notifyError("Something went wrong");
            console.log(err);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="container mt-4">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold">Users Management</h3>

                <span className="badge bg-dark px-3 py-2">
                    Total: {users.length}
                </span>
            </div>

            {/* CARD WRAPPER */}
            <div className="card border-0 shadow-sm rounded-4">

                <div className="card-body p-0">

                    {/* TABLE */}
                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            {/* HEADER */}
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Email</th>
                                    <th>Username</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>

                            {/* BODY */}
                            <tbody>

                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (

                                    users.map(user => (
                                        <tr key={user.id}>

                                            {/* ID */}
                                            <td className="fw-semibold text-secondary">
                                                #{user.id}
                                            </td>

                                            {/* EMAIL */}
                                            <td>
                                                {user.email}
                                            </td>

                                            {/* USERNAME */}
                                            <td>
                                                {user.username}
                                            </td>

                                            {/* ROLE */}
                                            <td>
                                                <span className={`badge rounded-pill px-3 py-2 ${
                                                    user.role === "ADMIN"
                                                        ? "bg-danger"
                                                        : user.role === "DOCTOR"
                                                        ? "bg-primary"
                                                        : "bg-secondary"
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>

                                            {/* STATUS */}
                                            <td>
                                                {user.is_approved ? (
                                                    <span className="badge bg-success rounded-pill px-3 py-2">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-warning text-dark rounded-pill px-3 py-2">
                                                        Pending
                                                    </span>
                                                )}
                                            </td>

                                            {/* ACTIONS */}
                                            <td className="text-center">

                                                {user.role !== "ADMIN" ? (
                                                    <div className="d-flex justify-content-center gap-2">

                                                        {/* APPROVE */}
                                                        <button
                                                            className="btn btn-sm btn-outline-success px-3"
                                                            onClick={() => handleApprove(user.id)}
                                                            disabled={loadingId === user.id}
                                                        >
                                                            {loadingId === user.id ? "..." : "Approve"}
                                                        </button>

                                                        {/* BLOCK */}
                                                        <button
                                                            className="btn btn-sm btn-outline-danger px-3"
                                                            onClick={() => handleBlock(user.id)}
                                                            disabled={loadingId === user.id}
                                                        >
                                                            {loadingId === user.id ? "..." : "Block"}
                                                        </button>

                                                    </div>
                                                ) : (
                                                    <span className="text-muted small">
                                                        No actions
                                                    </span>
                                                )}

                                            </td>

                                        </tr>
                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminUsers;