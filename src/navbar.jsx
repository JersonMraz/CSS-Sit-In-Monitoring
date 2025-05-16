import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './navbar.scss'

function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [notificationFilter, setNotificationFilter] = useState("all"); // "all" or "unread"
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);
    const profileRef = useRef(null);
    
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const defaultAvatar = "../Images/default.png";
    const [avatar, setAvatar] = useState(defaultAvatar);

    const toggleNotification = () => {
        setNotificationVisible((prev) => !prev);
        if (notificationVisible) {
            markNotificationsAsRead();
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
            prev.map((notif) => ({ ...notif, status: "read" }))
        );
        setUnreadCount(0);
    
        fetch("http://localhost/Sit-In Monitor Backend/mark_notifications_read.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        }).catch((error) => {
            console.error("Error marking notifications as read:", error);
        });
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
                            navigate("/");
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
                            timerProgressBar: true,
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
        <div className="user-navbar">
            {user ? (
                <div className="user-nav-container">
                    <a className="notification"
                    onClick={toggleNotification} 
                    >
                        <i className='fa-solid fa-bell'></i>
                        {unreadCount > 0 && (<span className="badge">{unreadCount}</span>)}
                    </a>
                    {notificationVisible && (
                        <div ref={notificationRef} className="notif-dropdown">
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
                            <ul>
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
                                    <li className='no-notif'>No notifications</li>
                                )}
                            </ul>
                        </div>
                    )}
                    <a ref={profileRef} onClick={toggleDropdown}><img src={avatar} alt="Profile Picture" onError={(e) => e.target.src = defaultAvatar}/><p>{user.firstname} {user.lastname}</p><p className='role'>{user.role}</p></a>
                    {dropdownVisible && (
                        <div ref={dropdownRef} className="dropdown-menu">
                            <ul>
                                <li><a onClick={() => navigate("/profile")}>View Profile</a></li>
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