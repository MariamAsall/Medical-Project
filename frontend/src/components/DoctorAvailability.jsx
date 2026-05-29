import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function DoctorAvailability() {

    const [list, setList] = useState([]);
    const navigate = useNavigate();

    const fetchAvailability = async () => {
        try {
            const res = await api.get("availability/");

            setList(res.data.results); // 🔥 FIX HERE

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {

        const check = async () => {
            try {
                await api.get("availability/");
                fetchAvailability();
            } catch (err) {
                navigate("/doctor/profile");
            }
        };

        check();

    }, []);

    return (
        <div className="container mt-4">

            <h2>Doctor Availability</h2>

            {list.length === 0 ? (
                <p>No availability yet</p>
            ) : (
                list.map((item) => (
                    <div
                        key={item.id}
                        className="border p-2 mb-2"
                    >
                        <strong>
                            {item.weekday_name}
                        </strong>

                        <div>
                            {item.start_time} - {item.end_time}
                        </div>
                    </div>
                ))
            )}

        </div>
    );
}

export default DoctorAvailability;