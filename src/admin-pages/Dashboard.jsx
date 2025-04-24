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
    const [totalStudent, setTotalStudent] = useState();
    const [totalCurrentSitin, setTotalCurrentSitin] = useState();
    const [totalSitin, setTotalSitin] = useState();
    const fetchStudents = () => {
        fetch("http://localhost/Sit-In Monitor Backend/getStudents.php")
            .then(response => response.json())
            .then(data => {
                setStudents(data.students);
                setTotalStudent(data.totalstudent)
            })
            .catch(error => console.error("❌ Error fetching students:", error));
    };

    const fetchTotalCurrentSitin = () => {
        fetch("http://localhost/Sit-In Monitor Backend/Get_SitIn.php")
            .then(response => response.json())
            .then(data => {
                setTotalCurrentSitin(data.count);
            })
            .catch(error => {console.error("❌ Error fetching students:", error);});
    };

    const fetchTotalSitin = () => {
        fetch("http://localhost/Sit-In Monitor Backend/getTotalSitin.php")
            .then(response => response.json())
            .then(data =>  {
                setTotalSitin(data.totalsitin);
            }).catch(error => {console.error("❌ Error fetching students:", error);});
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?.id) {
            console.log("🔴 No user found. Redirecting to login...");
            Swal.fire({
                title: 'Oops...',
                text: 'You must be logged in first.',
                icon: 'warning',
                confirmButtonText: 'Ok'
            });
            navigate("/");
        } else {
            console.log("🟢 User is logged in:", user.username);
        }

        fetchStudents();
        fetchTotalCurrentSitin();
        fetchTotalSitin();
    }, [navigate]);

    const addStudent = () => {
        Swal.fire({
            title: "Add New Student",
            width: "40vw",
            html: `
                <style>
                    .tibuok-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    }
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
                <div class="tibuok-container">
                    <div class="personalInformation">
                        <p class="persinfo">Personal Information</p>
                        <div class="inputContainer">
                            <div class="inputControl1">
                                <input class="input1" type="text" id="idno" placeholder="IDNO"/>
                                <input class="input1" type="text" id="firstname" placeholder="Firstname" />
                            </div>
                            <div class="inputControl2">
                                <input class="input2" type="text" id="midname" placeholder="Middlename"/>
                                <input class="input2" type="text" id="lastname" placeholder="Lastname"/>
                            </div>
                        </div>
                    </div>
                    <div class="courseandyear">
                        <p class="courseUGyear">Course & Year Level</p>
                        <div class="selectContainer">
                            <select id="course" class="select1">
                                <option value="" disabled selected>Course</option>
                                <option value="Bachelor of Science in Information Technology">Bachelor of Science in Information Technology</option>
                                <option value="Bachelor of Science in Computer Science">Bachelor of Science in Computer Science</option>
                                <option value="Bachelor of Science in Information System">Bachelor of Science in Information System</option>
                                <option value="Bachelor of Science in Accountancy">Bachelor of Science in Accountancy</option>
                                <option value="Bachelor of Science in Custom Administration">Bachelor of Science in Custom Administration</option>
                            </select>
                            <select id="yearlvl" class="select1">
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
                                    <input type="text" class="inputAcc1" id="username" placeholder="Username"/>
                                    <input type="text" class="inputAcc1" id="email" placeholder="Email address"/>
                                </div>
                                <div class="inputControl2">
                                    <input type="password" class="inputAcc2" id="password" placeholder="Password"/>
                                    <input type="password" class="inputAcc2" id="confirmPassword" placeholder="Confirm password"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: "Add student",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#E9BE5F",
            cancelButtonColor: "#e74c3c",
            didOpen: () => {
                document.querySelector('.swal2-container').style.backdropFilter = "blur(10px)";
                document.querySelector('.swal2-container').style.background = "rgba(0, 0, 0, 0.5)";
            },
            preConfirm: () => {
                const popup = Swal.getPopup();
                const idno = popup.querySelector("#idno")?.value.trim();
                const firstname = popup.querySelector("#firstname")?.value.trim();
                const midname = popup.querySelector("#midname")?.value.trim();
                const lastname = popup.querySelector("#lastname")?.value.trim();
                const course = popup.querySelector("#course")?.value;
                const yearlvl = popup.querySelector("#yearlvl")?.value;
                const username = popup.querySelector("#username")?.value.trim();
                const email = popup.querySelector("#email")?.value.trim();
                const password = popup.querySelector("#password")?.value.trim();
                const confirmPassword = popup.querySelector("#confirmPassword")?.value.trim();

                if (!idno || !firstname || !lastname || !course || !yearlvl || !username || !email || !password || !confirmPassword) {
                    Swal.showValidationMessage("All fields are required!");
                    return false;
                }
                if (password !== confirmPassword) {
                    Swal.showValidationMessage("Passwords do not match!");
                    return false;
                }
    
                return { idno, firstname, midname, lastname, course, yearlvl, username, email, password };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post("http://localhost/Sit-In Monitor Backend/register.php", result.value)
                    .then(response => {
                        if (response.data.success) {
                            Swal.fire("Success!", "Student added successfully!", "success");
                            fetchStudents();
                            fetchTotalCurrentSitin();
                            fetchTotalSitin();
                        } else {
                            Swal.fire("Error", response.data.message || "Could not add student. Try again!", "error");
                        }
                    })
                    .catch(error => {
                        console.error("Error adding student:", error);
                        Swal.fire("Error", "Could not add student. Try again!", "error");
                    });
            }
        });
    };

    const editStudent = (student) => {
        Swal.fire({
            title: "Edit Student",
            width: "40vw",
            html: `
                <style>
                    .tibuok-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    }
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
                <div class="tibuok-container">
                    <div class="personalInformation">
                        <p class="persinfo">Personal Information</p>
                        <div class="inputContainer">
                            <div class="inputControl1">
                                <input class="input1" type="text" id="idno" value="${student.idno}" placeholder="IDNO" disabled/>
                                <input class="input1" type="text" id="firstname" value="${student.firstname}" />
                            </div>
                            <div class="inputControl2">
                                <input class="input2" type="text" id="midname" value="${student.midname}"/>
                                <input class="input2" type="text" id="lastname" value="${student.lastname}"/>
                            </div>
                        </div>
                    </div>
                    <div class="courseandyear">
                        <p class="courseUGyear">Course & Year Level</p>
                        <div class="selectContainer">
                            <select id="course" class="select1">
                                <option value="" disabled>Course</option>
                                <option value="Bachelor of Science in Information Technology" ${student.course === "Bachelor of Science in Information Technology" ? "selected" : ""}>Bachelor of Science in Information Technology</option>
                                <option value="Bachelor of Science in Computer Science" ${student.course === "Bachelor of Science in Computer Science" ? "selected" : ""}>Bachelor of Science in Computer Science</option>
                                <option value="Bachelor of Science in Information System" ${student.course === "Bachelor of Science in Information System" ? "selected" : ""}>Bachelor of Science in Information System</option>
                                <option value="Bachelor of Science in Accountancy" ${student.course === "Bachelor of Science in Accountancy" ? "selected" : ""}>Bachelor of Science in Accountancy</option>
                                <option value="Bachelor of Science in Custom Administration" ${student.course === "Bachelor of Science in Custom Administration" ? "selected" : ""}>Bachelor of Science in Custom Administration</option>
                            </select>
                            <select id="yearlvl" class="select1">
                                <option value="" disabled>School Year</option>
                                <option value="1" ${student.yearlvl === "1" ? "selected" : ""}>1st Year</option>
                                <option value="2" ${student.yearlvl === "2" ? "selected" : ""}>2nd Year</option>
                                <option value="3" ${student.yearlvl === "3" ? "selected" : ""}>3rd Year</option>
                                <option value="4" ${student.yearlvl === "4" ? "selected" : ""}>4th Year</option>
                            </select>
                        </div>
                    </div>
                    <div class="accountInformation">
                        <p class="accinfo">Account Information</p>
                        <div class="inputControl">
                            <div class="inputContainer">
                                <div class="inputControl1">
                                    <input type="text" class="inputAcc1" id="username" value="${student.username}"/>
                                    <input type="text" class="inputAcc1" id="email" value="${student.email}"/>
                                </div>
                                <div class="inputControl2">
                                    <input type="password" class="inputAcc2" id="password" value="${student.password}"/>
                                    <input type="password" class="inputAcc2" id="confirmPassword" placeholder="Confirm password"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: "Edit student",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#E9BE5F",
            cancelButtonColor: "#e74c3c",
            didOpen: () => {
                const popup = Swal.getPopup();

                const fields = {
                    firstname: popup.querySelector("#firstname"),
                    midname: popup.querySelector("#midname"),
                    lastname: popup.querySelector("#lastname"),
                    course: popup.querySelector("#course"),
                    yearlvl: popup.querySelector("#yearlvl"),
                    username: popup.querySelector("#username"),
                    email: popup.querySelector("#email"),
                    password: popup.querySelector("#password"),
                    confirmPassword: popup.querySelector("#confirmPassword"),
                };

                const originalValues = {
                    firstname: student.firstname,
                    midname: student.midname,
                    lastname: student.lastname,
                    course: student.course,
                    yearlvl: student.yearlvl,
                    username: student.username,
                    email: student.email,
                    password: student.password,
                    confirmPassword: "",
                };

                const confirmBtn = Swal.getConfirmButton();
                confirmBtn.disabled = true;

                const checkIfChanged = () => {
                    const isChanged = Object.keys(fields).some(key => {
                        return fields[key].value.trim() !== (originalValues[key] || "");
                    });

                    confirmBtn.disabled = !isChanged;
                };

                Object.values(fields).forEach(field => {
                    field.addEventListener("input", checkIfChanged);
                });

                document.querySelector('.swal2-container').style.backdropFilter = "blur(10px)";
                document.querySelector('.swal2-container').style.background = "rgba(0, 0, 0, 0.5)";
            },
            preConfirm: () => {
                const popup = Swal.getPopup();
                const idno = popup.querySelector("#idno")?.value.trim();
                const firstname = popup.querySelector("#firstname")?.value.trim();
                const midname = popup.querySelector("#midname")?.value.trim();
                const lastname = popup.querySelector("#lastname")?.value.trim();
                const course = popup.querySelector("#course")?.value;
                const yearlvl = popup.querySelector("#yearlvl")?.value;
                const username = popup.querySelector("#username")?.value.trim();
                const email = popup.querySelector("#email")?.value.trim();
                const password = popup.querySelector("#password")?.value.trim();
                const confirmPassword = popup.querySelector("#confirmPassword")?.value.trim();

                if (!idno || !firstname || !lastname || !course || !yearlvl || !username || !email || !password || !confirmPassword) {
                    Swal.showValidationMessage("All fields are required!");
                    return false;
                }
                if (password !== confirmPassword) {
                    Swal.showValidationMessage("Passwords do not match!");
                    return false;
                }
    
                return { idno, firstname, midname, lastname, course, yearlvl, username, email, password };
            }
        })
    };

    const deleteStudent = () => {
        Swal.fire({
            icon: 'question',
            title: 'Delete Student?',
            text: 'Are you sure you want to delete this student?',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, delete',
            confirmButtonColor: '#e74c3c'
        })
    };

    const resetAllSessions = () => {
        Swal.fire({
            title: "Reset All Sessions?",
            text: "This will set all students' sessions to 30.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Reset",
            cancelButtonText: "Cancel",
            confirmButtonColor: '#e74c3c'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post("http://localhost/Sit-In%20Monitor%20Backend/resetSessions.php")
                    .then(response => {
                        Swal.fire("Success!", "All students' sessions have been reset.", "success");
                        fetchStudents();
                        fetchTotalCurrentSitin();
                    })
                    .catch(error => {
                        console.error("Error resetting sessions:", error.response ? error.response.data : error);
                        Swal.fire("Error", `Failed to reset sessions: ${error.response ? error.response.data.error : "Unknown error"}`, "error");
                    });
            }
        });
    };

    const resetStudentSession = (idno) => {
        Swal.fire({
            title: "Reset Student Session?",
            text: `Are you sure you want to reset the session for student with an ID ${idno}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Reset",
            confirmButtonColor: '#e74c3c',
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post("http://localhost/Sit-In Monitor Backend/resetStudentSession.php", { idno })
                    .then(response => {
                        console.log(response.data);
                        if (response.data.success) {
                            Swal.fire("Success!", "Student's session has been reset.", "success");
                            fetchStudents();
                            fetchTotalCurrentSitin();
                        } else {
                            Swal.fire("Error", response.data.message || "Failed to reset session. as", "error");
                        }
                    })
                    .catch(error => {
                        console.error("Error resetting session:", error.response ? error.response.data : error);
                        Swal.fire("Error", "Could not reset session. Try again!", "error");
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
                    <div className="statistics">
                        <div className="totalStudents">
                            <div className="content">
                                <div className="content-details">
                                    <h2>{totalStudent}</h2>
                                    <p>Total no. of students</p>
                                </div>
                            </div>
                            <div className="icon"><i class="fa-solid fa-users"></i></div>
                        </div>
                        <div className="totalsitin">
                            <div className="content">
                                <div className="content-details">
                                    <h2>{totalCurrentSitin}</h2>
                                    <p>Total no. of current sit-in</p>
                                </div>
                            </div>
                            <div className="icon"><i class="fa-solid fa-code"></i></div>
                        </div>
                        <div className="currentsitin">
                            <div className="content">
                                <div className="content-details">
                                    <h2>{totalSitin}</h2>
                                    <p>Total no. of sit-in</p>
                                </div>
                            </div>
                            <div className="icon"><i class="fa-solid fa-code"></i></div>
                        </div>
                    </div>
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
                                                    <button className="btn-edit" onClick={() => editStudent(student)}>Edit</button>
                                                    <button className="btn-delete" onClick={() => deleteStudent(student.idno)}>Delete</button>
                                                    <button className="btn-reset" onClick={() => resetStudentSession(student.idno)}>Reset session</button>
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