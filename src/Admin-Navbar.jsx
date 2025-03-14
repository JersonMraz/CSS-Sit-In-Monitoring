import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './admin-navbar.scss'

function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);
    const profileRef = useRef(null);
    const [searchId, setSearchId] = useState("");
    
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const defaultAvatar = "../Images/default.png";
    const [avatar, setAvatar] = useState(defaultAvatar);

    const toggleDropdown = () => {
        setDropdownVisible(prev => !prev);
    };

    const handleClickOutside = (e) => {
        if (
            dropdownRef.current && !dropdownRef.current.contains(e.target) &&
            profileRef.current && !profileRef.current.contains(e.target)
        ) {
            setDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            fetch(`http://localhost/Sit-In Monitor Backend/get_avatar.php?username=${user.username}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success" && data.profile_url) {
                        setAvatar(`http://localhost/Sit-In Monitor Backend/uploads/${data.profile_url}`);
                    } else {
                        setAvatar(defaultAvatar);
                    }
                })
                .catch(error => {
                    console.error("Error fetching avatar:", error);
                    setAvatar(defaultAvatar);
                });
        }
    }, []);

    const handleSearch = async (event) => {
        if (event.key === "Enter") {
            if (searchId.trim() === "") {
                Swal.fire("Oops!", "Please enter a student ID number.", "warning");
                return;
            }

            try {
                const response = await fetch(`http://localhost/Sit-In Monitor Backend/search_student.php?idno=${searchId}`);
                const data = await response.json();

                if (data.status === "success" && data.student) {
                    const formatTime = () => {
                        const now = new Date();
                        let hours = now.getHours();
                        const minutes = now.getMinutes();
                        const ampm = hours >= 12 ? "PM" : "AM";
                    
                        hours = hours % 12 || 12; 
                        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
                    
                        return `${hours}:${formattedMinutes} ${ampm}`;
                    };

                    Swal.fire({
                        title: "Sit-In Form",
                        html: `
                            <style>
                                .control-form {
                                    display: flex;
                                    justify-content: start;
                                    flex-direction: column;
                                }
                                .control-form .swal-input, .control-form .swal-select { 
                                    width: 90%; 
                                    padding: 10px; 
                                    border: 1px solid #ccc; 
                                    border-radius: 5px; 
                                    margin-bottom: 10px;
                                    font-family: 'Poppins-Regular';
                                    font-size: 16px; 
                                    background-color: white; 
                                    outline-color: #E9BE5F;
                                }
                            </style>
                            <div class="control-form">
                                <input type="text" id="idno" class="swal-input" value="${data.student.idno}" readonly>
                                <input type="text" id="fullname" class="swal-input" value="${data.student.fullname}" readonly>
                                <select id="purpose" class="swal-select">
                                    <option value="" disabled selected>Purpose</option>
                                    <option value="C++">C++</option>
                                    <option value="C#">C#</option>
                                    <option value="Java">Java</option>
                                    <option value="HTML & CSS">HTML & CSS</option>
                                    <option value="JavaScript">JavaScript</option>
                                    <option value="Python">Python</option>
                                </select>
                                <select id="lab" class="swal-select">
                                    <option value="" disabled selected>Laboratory Room</option>
                                    <option value="544">Room 544</option>
                                    <option value="542">Room 542</option>
                                    <option value="530">Room 530</option>
                                </select>
                                <input type="text" class="swal-input" value="${data.student.remaining_session}" readonly>
                            </div>
                        `,
                        icon: "question",
                        confirmButtonText: "Yes, Sit in",
                        showCancelButton: true,
                        preConfirm: () => {
                            const idno = document.getElementById("idno").value;
                            const fullname = document.getElementById("fullname").value;
                            const purpose = document.getElementById("purpose").value;
                            const lab = document.getElementById("lab").value;
                            const time_in = formatTime();
                
                            if (!purpose) {
                                Swal.showValidationMessage("What's the purpose?");
                                return false;
                            } else if(!lab) {
                                Swal.showValidationMessage("Don't forget what room.");
                                return false;
                            }
                
                            return { idno, fullname, purpose, lab, time_in };
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const studentData = result.value;
                
                            fetch("http://localhost/Sit-In Monitor Backend/sit-in_student.php", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(studentData)
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.status === "error" && data.message === "User already checked in.") {
                                    Swal.fire("Oops!", "This student has already checked in.", "warning");
                                    setSearchId("");
                                    return;
                                }
                                
                                if (data.status === "success") {
                                    Swal.fire("Success!", "Student added successfully.", "success");
                                    setSearchId("");
                                    
                                } else {
                                    Swal.fire("Oops!", "This student has already checked in.", "warning");
                                    setSearchId("");
                                }
                            })
                            .catch(error => {
                                console.error("Error:", error);
                                Swal.fire("Error!", "Something went wrong.", "error");
                            });
                        }
                    });
                } else {
                    Swal.fire("Not Found!", "No student found with this ID.", "error");
                }
            } catch (error) {
                console.error("Error fetching student data:", error);
                Swal.fire("Error", "Something went wrong. Try again later.", "error");
            }
        }
    };

    const handleLogout = () => {
            Swal.fire({
                title: 'Are you sure?',
                text: 'You will log out.',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: "#E9BE5F",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, log out"
            }).then((result) => {
                if(result.isConfirmed) {
                    const userString = localStorage.getItem("user");
                    if (!userString) {
                        console.error("No user found in localStorage!");
                        Swal.fire({
                            title: "Error",
                            text: "You are already logged out!",
                            icon: "error",
                            confirmButtonText: "OK",
                        }).then(() => {
                            navigate("/"); // Redirect to login
                        });
                        return;
                    }
    
                    const user = JSON.parse(userString);
                    console.log("📌 Full User Data from localStorage:", user);
                    console.log("📌 Sending username for logout:", user.username);
                    var url = "http://localhost/Sit-In Monitor Backend/logout.php";
                    var headers = {
                        "Accept": "application/json",
                        "Content-type": "application/json"
                    };
    
                    fetch(url, {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify({ username: user.username })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Logout Response:", data);
            
                        Swal.fire({
                            title: data.resultStatus.includes("successfully") ? "Success" : "Error",
                            text: data.resultStatus,
                            icon: data.resultStatus.includes("successfully") ? "success" : "error",
                            confirmButtonText: "OK",
                        }).then(() => {
                            // Clear user data from localStorage and redirect
                            localStorage.removeItem("user");
                            navigate("/");
                        });
                    })
                    .catch(error => {
                        console.error("Logout Error: ", error);
                        Swal.fire({
                            title: "Server Error",
                            text: "Check console for details.",
                            icon: "error",
                            confirmButtonText: "OK"
                        });
                    });
                }
            })
        };

    return(
        <div className="navbar">
            <div className="search">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" value={searchId} onChange={(e) => setSearchId(e.target.value)} onKeyDown={handleSearch} placeholder='Search student ID Number'/>
            </div>
            {user ? (
                <div className="container">
                    <a><i className='fa-solid fa-bell'></i></a>
                    <a ref={profileRef} onClick={toggleDropdown}><img src={avatar} alt="Profile Picture" onError={(e) => e.target.src = defaultAvatar}/><p>{user.firstname} {user.lastname}</p><p className='role'>{user.role}</p></a>
                    {dropdownVisible && (
                        <div ref={dropdownRef} className="dropdown-menu">
                            <ul>
                                <li><a onClick={() => navigate("/Admin-Profile")}>View Profile</a></li>
                                <li><a onClick={handleLogout}>Log Out</a></li>
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <span>Loading...</span>
            )}
        </div>
    );
}
export default Navbar