import "./Dashboard.scss";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Admin-Sidebar.jsx";
import Navbar from "../Admin-Navbar.jsx";
import Swal from 'sweetalert2';

function Dashboard() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user.id) {
            console.log("🔴 No user found. Redirecting to login...");
            Swal.fire({
                title: 'Oops...',
                text: 'You must logged in first.',
                icon: 'warning',
                confirmButtonText: 'Ok'
            });
            navigate("/");
        } else {
            console.log("🟢 User is logged in:", user.username);
        }

        fetch("http://localhost/Sit-In Monitor Backend/getStudents.php")
            .then(response => response.json())
            .then(data => {
                console.log("📌 Students fetched:", data);
                setStudents(data);
            })
            .catch(error => console.error("❌ Error fetching students:", error));
    }, [navigate]);

    return (
        <div>
            <Sidebar />
            <Navbar />
            <div className="DashboardBody">
                <h1>Dashboard</h1>
                <div className="dashboardContainer">
                    <div className="studentLists">
                        <h3>Student List</h3>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>ID Number</th>
                                        <th>Course</th>
                                        <th>Email Address</th>
                                        <th>Year Level</th>
                                        <th>Session</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.length > 0 ? (
                                        students.map((student, index) => (
                                            <tr key={index}>
                                                <td>{student.fullname}</td>
                                                <td>{student.idno}</td>
                                                <td>{student.course}</td>
                                                <td>{student.email}</td>
                                                <td>{student.yearlvl}</td>
                                                <td>{student.remaining_session}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6">No students found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;