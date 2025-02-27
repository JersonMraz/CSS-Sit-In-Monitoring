import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import './sidebar.scss';

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? "active" : "";

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
                        navigate("/login"); // Redirect to login
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
        <nav>
            <div className="logo">
                <img src="../Images/CCS Logo.png" alt="" />
                <h1>CCS</h1>
                <div className="sublogo">
                    <p>Sit-In Monitoring <br />System</p>
                </div>
            </div>
            <ul>
                <li className={isActive("/dashboard")}>
                    <a className={isActive("/dashboard")} onClick={() => navigate("/dashboard")}>
                        <i className="fa-solid fa-house"></i> Home
                    </a>
                </li>
                <li>
                    <a>
                        <i className="fa-solid fa-user-clock"></i> Reservations
                    </a>
                </li>
                <li className={isActive("/settings")}>
                    <a className={isActive("/settings")} onClick={() => navigate("/settings")}>
                        <i className="fa-solid fa-gear"></i> Settings
                    </a>
                </li>
                <li>
                    <a onClick={handleLogout}><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</a>
                </li>
            </ul>
        </nav>
    );
}

export default Sidebar;