import { useEffect, useState } from "react";
import api from "../api/axios";

function DoctorProfile() {

const [list, setList] = useState([]);

    const [form, setForm] = useState({
        weekday: 0,
        start_time: "",
        end_time: "",
    });

   const fetchAvailability = async () => {
    try {
        const res = await api.get("availability/");

        console.log(res.data);

setList(res.data.results);

    } catch (err) {
        console.log(err);
    }
};

    useEffect(() => {
        fetchAvailability();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("availability/", form);
            fetchAvailability();
        } catch (err) {
            console.log(err.response?.data);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`availability/${id}/`);
            fetchAvailability();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="container mt-4">

            <h2>Doctor Availability</h2>

            {/* FORM */}
            <form className="card p-3 mb-4" onSubmit={handleSubmit}>

                <select
                    className="form-select mb-2"
                    name="weekday"
                    onChange={handleChange}
                >
                    <option value={0}>Monday</option>
                    <option value={1}>Tuesday</option>
                    <option value={2}>Wednesday</option>
                    <option value={3}>Thursday</option>
                    <option value={4}>Friday</option>
                    <option value={5}>Saturday</option>
                    <option value={6}>Sunday</option>
                </select>

                <input
                    type="time"
                    className="form-control mb-2"
                    name="start_time"
                    onChange={handleChange}
                />

                <input
                    type="time"
                    className="form-control mb-2"
                    name="end_time"
                    onChange={handleChange}
                />

                <button className="btn btn-primary w-100">
                    Add Availability
                </button>

            </form>

            {/* LIST */}
           <div className="card p-3">

    <h4>Current Schedule</h4>

    {list.length === 0 ? (
        <p>No availability added yet.</p>
    ) : (
        list.map((item) => (
            <div
                key={item.id}
                className="d-flex justify-content-between border p-2 mb-2"
            >
                <div>
                    <strong>
                        {item.weekday_name}
                    </strong>

                    <div>
                        {item.start_time} - {item.end_time}
                    </div>
                </div>

                <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(item.id)}
                >
                    Delete
                </button>
            </div>
        ))
    )}

</div>
        </div>
    );
}

export default DoctorProfile;