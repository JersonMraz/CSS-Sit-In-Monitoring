import "./CurrentSitIn.scss";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from "../Admin-Sidebar.jsx";
import Navbar from "../Admin-Navbar.jsx";

function CurrentSitIn() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?.id) {
            console.log("🔴 No user found. Redirecting to login...");
            Swal.fire({
                title: 'Oops...',
                text: 'You must log in first.',
                icon: 'warning',
                confirmButtonText: 'Ok'
            }).then(() => {
                navigate("/");
            });
        } else {
            console.log("🟢 User is logged in:", user.username);
            fetchSitInRecords();
        }
    }, []);

    const fetchSitInRecords = () => {
        fetch("http://localhost/Sit-In Monitor Backend/Get_SitIn.php")
            .then(response => response.json())
            .then(data => {
                console.log("📌 Sit-ins fetched:", data);
                setStudents(data.sit_in);
            })
            .catch(error => {
                console.error("❌ Error fetching students:", error);
                setStudents([]);
                });
    };

    const formatTime = () => {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
    
        hours = hours % 12 || 12; 
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
        return `${hours}:${formattedMinutes} ${ampm}`;
    };

    const handleLogout = (idno, lab, pc_num) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You are about to log out this user.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#E9BE5F",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Logout"
        }).then((result) => {
            if (result.isConfirmed) {

                const time_out = formatTime();

                fetch("http://localhost/Sit-In Monitor Backend/Logout_Sitin.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idno, lab, pc_num, time_out })
                })
                .then(response => response.json())
                .then(data => {                    
                    if (data.status === "success") {
                        Swal.fire({
                            title: "Logged out successfully!",
                            text: "Do you want to reward this student a point?",
                            icon: "question",
                            showCancelButton: true,
                            confirmButtonText: "Yes",
                            cancelButtonText: "No",
                            confirmButtonColor: "#E9BE5F",
                            cancelButtonColor: "#d33",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                fetch("http://localhost/Sit-In Monitor Backend/Add_Point.php", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({idno})
                                })
                                .then(res => res.json())
                                .then(data => {
                                    if (data.status === "success") {
                                        fetchSitInRecords();
                                        Swal.fire({
                                            title: "Point Added", 
                                            text: "Student received a point.", 
                                            icon: "success",
                                            timerProgressBar: true,
                                            timer: 1100
                                        });
                                    } else {
                                        Swal.fire("Error", data.message || "Failed to add point.", "error");
                                    }
                                })
                                .catch(err => {
                                    console.error("Add Point Error:", err);
                                    Swal.fire("Error", "Failed to add point. Check console.", "error");
                                });
                            } else {
                                fetchSitInRecords();
                            }
                        })
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: data.message,
                            icon: "error",
                            confirmButtonText: "OK"
                        });
                    }
                })
                .catch(error => {
                    console.error("Logout Error:", error);
                    Swal.fire({
                        title: "Server Error",
                        text: "Check console for details.",
                        icon: "error",
                        confirmButtonText: "OK"
                    });
                });
            }
        });
    };

    return (
        <div>
            <Sidebar />
            <Navbar />
            <div className="currentbody">
                <h1>Current Sit-In</h1>
                <div className="sitInContainer">
                    <div className="SitinTable">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID Number</th>
                                    <th>Name</th>
                                    <th>Purpose</th>
                                    <th>Laboratory Room</th>
                                    <th>PC No.</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Action</th>
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
                                            <td>{students.pc_num}</td>
                                            <td>{students.date}</td>
                                            <td>{students.time_in}</td>
                                            <td>
                                                <button 
                                                    className="logout-btn" 
                                                    onClick={() => handleLogout(students.idno, students.lab, students.pc_num)}
                                                >
                                                    Logout
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">No students found</td>
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

export default CurrentSitIn;
