import "./SitinRecords.scss"
import Sidebar from "../Admin-Sidebar.jsx";
import Navbar from "../Admin-Navbar.jsx";
import { useState, useEffect } from "react";

function SitinRecords() {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetch("http://localhost/Sit-In Monitor Backend/get_sitin_records.php")
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    setStudents(data.records);
                } else {
                    console.error("No records found");
                    setStudents([]);
                }
            })
            .catch(error => {
                console.error("Error fetching records:", error);
                setStudents([]); 
            });
    }, []);
    

    return(
        <div>
            <Sidebar />
            <Navbar />
            <div className="SitinRecord">
                <h1>Sit-in Records</h1>
                <div className="RecordContainer">
                    <div className="RecordTable">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID Number</th>
                                    <th>Name</th>
                                    <th>Purpose</th>
                                    <th>Laboratory Room</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Time Out</th>
                                </tr>
                            </thead>
                            <tbody>
                            {students.length > 0 ? (
                                    students.map((students, index) => (
                                        <tr key={index}>
                                            <td>{students.idno}</td>
                                            <td>{students.fullname}</td>
                                            <td>{students.purpose}</td>
                                            <td>{students.lab}</td>
                                            <td>{students.date}</td>
                                            <td>{students.time_in}</td>
                                            <td className={students.time_out ? "" : "Active"}>
                                                {students.time_out ? students.time_out : "Active"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">No records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SitinRecords;