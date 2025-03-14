import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './navbar.scss'

function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);
    const profileRef = useRef(null);
    
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
        <div className="user-navbar">
            {user ? (
                <div className="user-nav-container">
                    <a><i className='fa-solid fa-bell'></i></a>
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