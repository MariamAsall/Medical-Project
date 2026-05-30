import { useEffect, useState } from "react";
import api from "../api/axios";
//notification for Approve and Block
import { notifySuccess, notifyError } from "../utils/notify";

function AdminUsers() {

    const [users, setUsers] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    const fetchUsers = () => {
        api.get("auth/admin/users/")
            .then((res) => {
                setUsers(res.data.users);
            })
            .catch((err) => {
                console.log(err);
                notifyError("Failed to fetch users");
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Approve user
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

    // Block user
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

            <h2>Admin Users</h2>

            <table className="table table-bordered mt-3">

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Approved</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {users.map((user) => (
                        <tr key={user.id}>

                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>{user.username}</td>
                            <td>{user.role}</td>

                            <td>
                                {user.is_approved ? "Yes" : "No"}
                            </td>

                            <td>

                                {/* Approve */}
                                <button
                                    className="btn btn-success btn-sm me-2"
                                    onClick={() => handleApprove(user.id)}
                                    disabled={loadingId === user.id}
                                >
                                    {loadingId === user.id ? "Loading..." : "Approve"}
                                </button>

                                {/* Block */}
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleBlock(user.id)}
                                    disabled={loadingId === user.id}
                                >
                                    {loadingId === user.id ? "Loading..." : "Block"}
                                </button>

                            </td>

                        </tr>
                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default AdminUsers;