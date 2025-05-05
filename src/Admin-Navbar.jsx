import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './admin-navbar.scss'

function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [notificationFilter, setNotificationFilter] = useState("all");
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);
    const profileRef = useRef(null);
    const [searchId, setSearchId] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
    const [studentData, setStudentData] = useState(null); // Student data for the modal
    const [formData, setFormData] = useState({
        idno: "",
        fullname: "",
        purpose: "",
        lab: "",
        pc_num: "",
        session: "",
    });
    const [pcs, setPcs] = useState([]);
    const [selectedPcs, setSelectedPcs] = useState([]);
    
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const defaultAvatar = "../Images/default.png";
    const [avatar, setAvatar] = useState(defaultAvatar);   

    const toggleNotification = () => {
        setNotificationVisible(prev => !prev);
        if (notificationVisible) {
            markNotificationsAsRead();
        }
    };

    const togglePcSelection = (pc) => {
        // Prevent selection if the PC status is not allowed
        if (["maintenance", "occupied", "pending"].includes(pc.pc_status.toLowerCase())) {
            return;
        }
    
        if (selectedPcs.some((selected) => selected.pc_num === pc.pc_num)) {
            setSelectedPcs([]);
            setFormData((prev) => ({ ...prev, pc_num: "" }));
        } else {
            // Select the PC and update formData
            setSelectedPcs([pc]);
            setFormData((prev) => ({ ...prev, pc_num: pc.pc_num }));
        }
    };

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
        if (
            notificationRef.current && !notificationRef.current.contains(e.target) &&
            !e.target.closest('.notification')
        ) {
            setNotificationVisible(false);
            markNotificationsAsRead();
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

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            fetch(`http://localhost/Sit-In Monitor Backend/get_notifications.php?for_idno=${user.idno}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === "success") {
                        setNotifications(data.notifications);
                        const unread = data.notifications.filter((notif) => notif.status === "unread").length;
                        setUnreadCount(unread);
                    } else {
                        console.error("Failed to fetch notifications:", data.message);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching notifications:", error);
                });
        }
    }, []);

    const markNotificationsAsRead = () => {
        setNotifications((prev) =>
            prev.map((notif) => ({ ...notif, read: true }))
        );
        setUnreadCount(0);

        fetch("http://localhost/Sit-In Monitor Backend/mark_notifications_read.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        }).catch((error) => {
            console.error("Error marking notifications as read:", error);
        });
    };

    const handleSearch = async (event) => {
        if (event.key === "Enter") {
            if (searchId.trim() === "") {
                alert("Please enter a student ID number.");
                return;
            }

            try {
                const response = await fetch(`http://localhost/Sit-In Monitor Backend/search_student.php?idno=${searchId}`);
                const data = await response.json();

                if (data.status === "success" && data.student) {
                    setStudentData(data.student);
                    setFormData({
                        idno: data.student.idno,
                        fullname: data.student.fullname,
                        purpose: "",
                        lab: "",
                        session: data.student.remaining_session,
                        time_in: formatTime(),
                    });
                    setIsModalOpen(true); // Open the modal
                } else {
                    alert("No student found with this ID.");
                }
            } catch (error) {
                console.error("Error fetching student data:", error);
                alert("Something went wrong. Try again later.");
            }
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "lab" && value) {
            fetch(`http://localhost/Sit-In Monitor Backend//getPCs.php?lab_room=${value}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === "success") {
                        setPcs(data.pcs); // Update PCs state
                    } else {
                        console.error("Failed to fetch PCs:", data.message);
                        setPcs([]); // Clear PCs if fetch fails
                    }
                })
                .catch((error) => {
                    console.error("Error fetching PCs:", error);
                    setPcs([]); // Clear PCs on error
                });
        }
    };

    const handleFormSubmit = () => {
        const { idno, fullname, purpose, lab, pc_num, time_in } = formData;

        if (!purpose) {
            Swal.fire({
                title: "Failed to sit-in!",
                icon: "error",
                text: "Don't forget your purpose.",
                showConfirmButton: false,
                timer: 2200,
                timerProgressBar: true
            });
            return;
        }
        if (!lab) {
            Swal.fire({
                title: "Failed to sit-in!",
                icon: "error",
                text: "Don't forget what room.",
                showConfirmButton: false,
                timer: 2200,
                timerProgressBar: true
            });
            return;
        }
        if(!pc_num) {
            Swal.fire({
                title: "Failed to sit-in!",
                icon: "error",
                text: "Don't forget to choose a PC.",
                showConfirmButton: false,
                timer: 2200,
                timerProgressBar: true
            });
            return;
        }

        const studentData = { idno, fullname, purpose, lab, pc_num, time_in };

        fetch("http://localhost/Sit-In Monitor Backend/sit-in_student.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(studentData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "error" && data.message === "User already checked in.") {
                    Swal.fire({
                        title: "Failed to sit-in!",
                        icon: "error",
                        text: "This student has already checked in.",
                        showConfirmButton: false,
                        timer: 2200,
                        timerProgressBar: true
                    }).then(() => {
                        setSearchId("");
                    })
                    return;
                }

                if (data.status === "success") {
                    Swal.fire({
                        title: "Successfully sit-in!",
                        icon: "success",
                        text: "Student successfully sit-in",
                        showConfirmButton: false,
                        timer: 1700,
                        timerProgressBar: true
                    }).then(() => {
                        setSearchId("");
                        setIsModalOpen(false);
                        window.location.reload();
                    })
                } else {
                    Swal.fire({
                        title: "Failed to sit-in!",
                        icon: "error",
                        text: "This student has already checked in.",
                        showConfirmButton: false,
                        timer: 2200,
                        timerProgressBar: true
                    }).then(() => {
                        setSearchId("");
                    })
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Something went wrong.");
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
                        timer: 1200,
                        timerProgressBar: true
                    }).then(() => {
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
                    <a className="notification"
                      onClick={toggleNotification}
                    >
                        <i className='fa-solid fa-bell'></i>
                        {unreadCount > 0 && (<span className="badge">{unreadCount}</span>)}
                    </a>
                    {notificationVisible && (
                        <div ref={notificationRef} className="notif-dropdown">
                            <ul>
                                <div className="notif-header">
                                    <p className='notif-big'>Notifications</p>
                                </div>
                                <div className="filter">
                                    <button
                                        className={`all-btn ${notificationFilter === "all" ? "active" : ""}`}
                                        onClick={() => setNotificationFilter("all")}
                                    >
                                        All
                                    </button>
                                    <button
                                        className={`unread-btn ${notificationFilter === "unread" ? "active" : ""}`}
                                        onClick={() => setNotificationFilter("unread")}
                                    >
                                        Unread
                                    </button>
                                </div>
                                {notifications.length > 0 ? (
                                    notifications
                                        .filter((notif) => notificationFilter === "all" || notif.status === "unread")
                                        .map((notif) => (
                                            <li key={notif.id} className={notif.status}>
                                                <span className="sirkol-unread"></span>
                                                {notif.message}
                                            </li>
                                            
                                        ))
                                ) : (
                                    <li>No notifications</li>
                                )}
                            </ul>
                        </div>
                    )}
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
            {/* Modal */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2 className="sitin-Title">Sit-In Form</h2>
                        <div className="control-form">
                            <div className="idnoName">
                                <div className="idnoo">
                                    <label>IDNO:</label>
                                    <input
                                        type="text"
                                        name="idno"
                                        value={formData.idno}
                                        className="modal-input"
                                        readOnly
                                    />
                                </div>
                                <div className="studname">
                                    <label>Name:</label>
                                    <input
                                    type="text"
                                    name="fullname"
                                    value={formData.fullname}
                                    className="modal-input"
                                    readOnly
                                    />
                                </div>
                            </div>

                            <div className="purposeLab">
                                <div className="purposee">
                                    <label>Purpose:</label>
                                    <select
                                        name="purpose"
                                        value={formData.purpose}
                                        onChange={handleFormChange}
                                        className="modal-select"
                                    >
                                        <option value="" disabled>
                                            Purpose
                                        </option>
                                        <option value="C# Programming">C# Programming</option>
                                        <option value="C Programming">C Programming</option>
                                        <option value="Java Programming">Java Programming</option>
                                        <option value="Systems Integration & Architecture">
                                            Systems Integration & Architecture
                                        </option>
                                        <option value="Embedded Systems & IoT">Embedded Systems & IoT</option>
                                        <option value="Digital Logic & Design">Digital Logic & Design</option>
                                        <option value="Computer Application">Computer Application</option>
                                        <option value="Database">Database</option>
                                        <option value="Project Management">Project Management</option>
                                        <option value="Python Programming">Python Programming</option>
                                        <option value="Mobile Application">Mobile Application</option>
                                        <option value="Others">Others..</option>
                                    </select>
                                </div>
                                <div className="labb">
                                    <label>Laboratory:</label>
                                    <select
                                        name="lab"
                                        value={formData.lab}
                                        onChange={handleFormChange}
                                        className="modal-select"
                                    >
                                        <option value="" disabled>
                                            Laboratory Room
                                        </option>
                                        <option value="Lab 524">Lab 524</option>
                                        <option value="Lab 526">Lab 526</option>
                                        <option value="Lab 528">Lab 528</option>
                                        <option value="Lab 530">Lab 530</option>
                                        <option value="Lab 542">Lab 542</option>
                                        <option value="Lab 544">Lab 544</option>
                                        <option value="Lab 517">Lab 517</option>
                                    </select>
                                </div>
                            </div>

                            <div className="sessionSelectedPC">
                                <div className="sessionn">
                                    <label>Remaining session:</label>
                                    <input
                                        type="text"
                                        name="session"
                                        value={formData.session}
                                        className="modal-input"
                                        readOnly
                                    />
                                </div>
                                <div className="selectedPc">
                                    <label>Selected:</label>
                                    <input 
                                        type="text" 
                                        name="pc_num"
                                        value={selectedPcs.map((pc) => pc.pc_num).join(", ")}
                                        className='modal-input'
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="pc-container">
                            {pcs.length > 0 ? (
                                pcs.map((pc) => (
                                    <div
                                        key={pc.pc_num}
                                        className={`pc-item pc-item-${pc.pc_status.toLowerCase()} ${
                                            selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "selected" : ""
                                        }`}
                                        onClick={() => togglePcSelection(pc)} // Handle PC selection
                                        style={{
                                            backgroundColor: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "#2196F3" : "",
                                            color: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "#fff" : "",
                                            border: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "1px solid #2196F3" : "",
                                            cursor: ["maintenance", "occupied", "pending"].includes(pc.pc_status.toLowerCase())
                                                ? "not-allowed"
                                                : "pointer",
                                        }}
                                    >
                                        <i className="fa-solid fa-desktop"></i>
                                        <p className="pc-num">{pc.pc_num}</p>
                                        <p className="status">{pc.pc_status}</p>
                                    </div>
                                ))
                            ) : (
                                <p className='nopc-text'>No PCs available for the selected laboratory.</p>
                            )}
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleFormSubmit} className="modal-btn">
                                Yes, Sit in
                            </button>
                            <button onClick={() => setIsModalOpen(false)} className="modal-btn cancel">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Navbar