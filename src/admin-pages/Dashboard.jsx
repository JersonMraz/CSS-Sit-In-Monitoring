import "./Dashboard.scss";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Admin-Sidebar.jsx";
import Navbar from "../Admin-Navbar.jsx";
import Swal from 'sweetalert2';
import axios from "axios";

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

    const addStudent = () => {
        Swal.fire({
            title: "Add New Student",
            html: `
                <style>
                    .personalInformation {
                        padding: 10px;
                        width: 90%;
                        border-bottom: 1px solid #ccc;
                    }
                    .persinfo {
                        margin: 0px;
                        font-size: 18px;
                        margin-bottom: 5px;
                        font-family: 'Poppins-Regular';
                    }
                    .inputContainer {
                        width: 100%;
                        margin: 0px;
                        padding: 0px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                    }
                    .inputControl1 {
                        width: 100%;
                        margin-bottom: 20px;
                        display: flex;
                        justify-content: space-between;
                    }
                    .input1 {
                        margin-top: 10px;
                        width: 47%;
                        padding: 8px;
                        font-size: 16px;
                        display: block;
                        border: none;
                        background-color: rgba(245, 232, 182, .40);
                        color: #282823;
                        outline: none;
                        border-bottom: 2px solid #F5E8B6;
                        box-sizing: border-box;
                        font-family: 'Poppins-Regular';
                    }
                    .inputControl2 {
                        margin-bottom: 10px;
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                    }
                    .input2 {
                        width: 47%;
                        padding: 8px;
                        font-size: 16px;
                        display: block;
                        border: none;
                        background-color: rgba(245, 232, 182, .40);
                        color: #282823;
                        outline: none;
                        border-bottom: 2px solid #F5E8B6;
                        box-sizing: border-box;
                        font-family: 'Poppins-Regular';
                    }


                    .courseandyear {
                        padding: 10px;
                        width: 90%;
                        border-bottom: 1px solid #ccc;
                    }
                    .courseUGyear {
                        margin: 0px;
                        font-size: 18px;
                        margin-bottom: 5px;
                        font-family: 'Poppins-Regular';
                    }
                    .selectContainer {
                        margin-bottom: 10px;
                        width: 100%;
                        margin-top: 15px;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .select1 {
                        width: 47%;
                        padding: 8px;
                        font-size: 16px;
                        display: block;
                        border: none;
                        background-color: rgba(245, 232, 182, .40);
                        color: #282823;
                        outline: none;
                        border-bottom: 2px solid #F5E8B6;
                        box-sizing: border-box;
                        font-family: 'Poppins-Regular';
                    }


                    .accountInformation {
                        padding: 10px;
                        width: 90%;
                        border-bottom: 1px solid #ccc;
                    }
                    .accinfo {
                        margin: 0px;
                        font-size: 18px;
                        margin-bottom: 5px;
                        font-family: 'Poppins-Regular';
                    }
                    .inputContainer {
                        width: 100%;
                        margin: 0px;
                        padding: 0px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                    }
                    .inputControl1 {
                        width: 100%;
                        margin-bottom: 20px;
                        display: flex;
                        justify-content: space-between;
                    }
                    .inputAcc1 {
                        margin-top: 10px;
                        width: 47%;
                        padding: 8px;
                        font-size: 16px;
                        display: block;
                        border: none;
                        background-color: rgba(245, 232, 182, .40);
                        color: #282823;
                        outline: none;
                        border-bottom: 2px solid #F5E8B6;
                        box-sizing: border-box;
                        font-family: 'Poppins-Regular';
                    }
                    .inputControl2 {
                        margin-bottom: 10px;
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                    }
                    .inputAcc2 {
                        width: 47%;
                        padding: 8px;
                        font-size: 16px;
                        display: block;
                        border: none;
                        background-color: rgba(245, 232, 182, .40);
                        color: #282823;
                        outline: none;
                        border-bottom: 2px solid #F5E8B6;
                        box-sizing: border-box;
                        font-family: 'Poppins-Regular';
                    }
                </style>
                <div class="personalInformation">
                    <p class="persinfo">Personal Information</p>
                    <div class="inputContainer">
                        <div class="inputControl1">
                            <input class="input1" type="text" name="idno" placeholder="IDNO"/>
                            <input class="input1" type="text" name="firstname" placeholder="Firstname" />
                        </div>
                        <div class="inputControl2">
                            <input class="input2" type="text" name="midname" placeholder="Middlename"/>
                            <input class="input2" type="text" name="lastname" placeholder="Lastname"/>
                        </div>
                    </div>
                </div>
                <div class="courseandyear">
                    <p class="courseUGyear">Course & Year Level</p>
                    <div class="selectContainer">
                        <select name="course" class="select1">
                            <option value="" disabled selected>Course</option>
                            <option value="Bachelor of Science in Information Technology">Bachelor of Science in Information Technology</option>
                            <option value="Bachelor of Science in Computer Science">Bachelor of Science in Computer Science</option>
                            <option value="Bachelor of Science in Information System">Bachelor of Science in Information System</option>
                            <option value="Bachelor of Science in Accountancy">Bachelor of Science in Accountancy</option>
                            <option value="Bachelor of Science in Custom Administration">Bachelor of Science in Custom Administration</option>
                        </select>
                        <select name="yearlvl" class="select1">
                            <option value="" disabled selected>School Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                    </div>
                </div>
                <div class="accountInformation">
                    <p class="accinfo">Account Information</p>
                    <div class="inputControl">
                        <div class="inputContainer">
                            <div class="inputControl1">
                                <input type="text" class="inputAcc1" name="username" placeholder="Username"/>
                                <input type="text" class="inputAcc1" name="email" placeholder="Email address"/>
                            </div>
                            <div class="inputControl2">
                                <input type="password" class="inputAcc2" name="password" placeholder="Password"/>
                                <input type="password" class="inputAcc2" name="confirmPassword" placeholder="Confirm password"/>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: "Add",
            cancelButtonText: "Cancel",
            preConfirm: () => {
                const idno = document.getElementById("idno").value.trim();
                const fullname = document.getElementById("fullname").value.trim();
                const course = document.getElementById("course").value.trim();
                const yearlvl = document.getElementById("yearlvl").value.trim();

                if (!idno || !fullname || !course || !yearlvl) {
                    Swal.showValidationMessage("All fields are required!");
                    return false;
                }

                return { idno, fullname, course, yearlvl };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post("http://localhost/Sit-In Monitor Backend/addStudent.php", result.value)
                .then(response => {
                    Swal.fire("Success!", "Student added successfully!", "success");
                    fetchStudents(); // Refresh student list
                })
                .catch(error => {
                    console.error("Error adding student:", error);
                    Swal.fire("Error", "Could not add student. Try again!", "error");
                });
            }
        });
    };

    const resetAllSessions = () => {
        Swal.fire({
            title: "Reset All Sessions?",
            text: "This will set all students' sessions to 30.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Reset",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post("http://localhost/Sit-In Monitor Backend/resetSessions.php")
                    .then(response => {
                        Swal.fire("Success!", "All students' sessions have been reset.", "success");
                        fetchStudents();
                    })
                    .catch(error => {
                        console.error("Error resetting sessions:", error);
                        Swal.fire("Error", "Failed to reset sessions.", "error");
                    });
            }
        });
    };

    return (
        <div>
            <Sidebar />
            <Navbar />
            <div className="DashboardBody">
                <h1>Dashboard</h1>
                <div className="dashboardContainer">
                    <div className="studentLists">
                        <h2>Student List</h2>
                        <div className="buttons">
                            <button className="AddStudent-btn" onClick={addStudent}>Add Student</button>
                            <button className="ResetSession-btn" onClick={resetAllSessions}>Reset all session</button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID Number</th>
                                        <th>Name</th>
                                        <th>Course</th>
                                        <th>Year Level</th>
                                        <th>Session</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.length > 0 ? (
                                        students.map((student, index) => (
                                            <tr key={index}>
                                                <td>{student.idno}</td>
                                                <td>{student.fullname}</td>
                                                <td>{student.course}</td>
                                                <td>{student.yearlvl}</td>
                                                <td>{student.remaining_session}</td>
                                                <td style={{display: "flex", gap: "20px"}}>
                                                    <button className="btn-edit">Edit</button>
                                                    <button className="btn-delete">Delete</button>
                                                </td>
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