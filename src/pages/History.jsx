import { useEffect, useState } from "react";
import Navbar from "../navbar";
import Sidebar from "../Sidebar"; 
import "./History.scss";
import axios from "axios"; // Ensure you have axios installed

function History() {
    const [history, setHistory] = useState([]); // Store sit-in records
    const [loading, setLoading] = useState(true); // Handle loading state

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user")); // Get user from localStorage
                if (!user || !user.idno) {
                    console.error("No user ID found in localStorage");
                    return;
                }

                const response = await axios.get(`http://localhost/Sit-In Monitor Backend/getHistory.php?idno=${user.idno}`);
                setHistory(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching history:", error);
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div>
            <Sidebar />
            <Navbar />
            <div className="historybody">
                <h1>Sit-In History</h1>
                <div className="historycont">
                    <table>
                        <thead>
                            <tr>
                                <th>ID Number</th>
                                <th>Name</th>
                                <th>Purpose</th>
                                <th>Laboratory</th>
                                <th>Date</th>
                                <th>Logged In</th>
                                <th>Logged Out</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8">Loading...</td></tr>
                            ) : history.length > 0 ? (
                                history.map((record, index) => (
                                    <tr key={index}>
                                        <td>{record.idno}</td>
                                        <td>{record.fullname}</td>
                                        <td>{record.purpose}</td>
                                        <td>{record.lab}</td>
                                        <td>{record.date}</td>
                                        <td>{record.time_in}</td>
                                        <td>{record.time_out ? record.time_out : "Still in session"}</td>
                                        <td>
                                            <button className="feedBack">Feedback</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="8">No records found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default History;
