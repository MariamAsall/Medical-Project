import { useEffect, useState } from "react";
import api from "../api/axios";
import { notifyError } from "../utils/notify";

const DAYS = [
    { value: "0", label: "Monday" },
    { value: "1", label: "Tuesday" },
    { value: "2", label: "Wednesday" },
    { value: "3", label: "Thursday" },
    { value: "4", label: "Friday" },
    { value: "5", label: "Saturday" },
    { value: "6", label: "Sunday" },
];

function DoctorAvailability() {

    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        weekday: 0,
        start_time: "",
        end_time: "",
        is_available: true,
    });

    const fetchSlots = async () => {
        try {
            const res = await api.get("availability/");
            setSlots(res.data.results || res.data);
        } catch (err) {
            notifyError("Failed to load availability slots.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, []);


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await api.post("availability/", form);
            setForm({
                weekday: 0,
                start_time: "",
                end_time: "",
                is_available: true,
            });
            fetchSlots(); 
        } catch (err) {
            const data = err.response?.data;
            if (data) {
                notifyError("End time must be after start time.");
                
            } else {
                notifyError("Something went wrong.");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`availability/${id}/`);
            setSlots(slots.filter((slot) => slot.id !== id));
        } catch (err) {
            notifyError("Failed to delete slot.");
        }
    };

    if (loading) return <h3>Loading...</h3>;

    return (
        <div>
            <h2>My Availability</h2>

            <form onSubmit={handleAdd} className="my-4">
                <h5>Add New Slot</h5>

                <div className="row g-3 mb-3">

                    <div className="col-md-3">
                        <label>Day</label>
                        <select
                            name="weekday"
                            value={form.weekday}
                            onChange={handleChange}
                            className="form-select"
                        >
                            {DAYS.map((d) => (
                                <option key={d.value} value={d.value}>
                                    {d.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-3">
                        <label>Start Time</label>
                        <input
                            type="time"
                            name="start_time"
                            value={form.start_time}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="col-md-3">
                        <label>End Time</label>
                        <input
                            type="time"
                            name="end_time"
                            value={form.end_time}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                >
                    {saving ? "Adding..." : "Add Slot"}
                </button>
            </form>

            {slots.length === 0 ? (
                <p>No availability slots yet.</p>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Available</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {slots.map((slot) => (
                            <tr key={slot.id}>
                                <td>{slot.weekday_name}</td>
                                <td>{slot.start_time}</td>
                                <td>{slot.end_time}</td>
                                <td>{slot.is_available ? "Yes" : "No"}</td>
                                <td>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(slot.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default DoctorAvailability;