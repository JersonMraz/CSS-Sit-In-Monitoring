import { useNavigate, useLocation } from 'react-router-dom';
import './admin-sidebar.scss';

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? "active" : "";

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
                <li className={isActive("/Admin-Dashboard")}>
                    <a className={isActive("/Admin-Dashboard")} onClick={() => navigate("/Admin-Dashboard")}>
                        <i className="fa-solid fa-house"></i> Home
                    </a>
                </li>
                <li className={isActive("/Admin-Announcement")}>
                    <a className={isActive("/Admin-Announcement")} onClick={() => navigate("/Admin-Announcement")}>
                        <i className='fa-solid fa-bullhorn'></i> Announcement
                    </a>
                </li>
                <li className={isActive("/Reservation-Request")}>
                    <a className={isActive("/Reservation-Request")} onClick={() => navigate("/Reservation-Request")}>
                        <i class="fa-solid fa-code-pull-request"></i> Reservation Request
                    </a>
                </li>
                <li className={isActive("/CompLab-Management")}>
                    <a className={isActive("/CompLab-Management")} onClick={() => navigate("/CompLab-Management")}>
                        <i className="fa-solid fa-scroll"></i> Computer Management
                    </a>
                </li>
                <li className={isActive("/Current-Sit-In")}>
                    <a className={isActive("/Current-Sit-In")} onClick={() => navigate("/Current-Sit-In")}>
                        <i className="fa-solid fa-code"></i> Current Sit-In
                    </a>
                </li>
                <li className={isActive("/Sitin-Records")}>
                    <a className={isActive("/Sitin-Records")} onClick={() => navigate("/Sitin-Records")}>
                        <i className="fa-solid fa-scroll"></i> Sit-in Records
                    </a>
                </li>
                <li className={isActive("/View-Feedback")}>
                    <a className={isActive("/View-Feedback")} onClick={() => navigate("/View-Feedback")}>
                        <i class="fa-solid fa-comments"></i> View Feedback
                    </a>
                </li>
                <li className={isActive("/Resources")}>
                    <a className={isActive("/Resources")} onClick={() => navigate("/Resources")}>
                        <i class="fa-solid fa-folder-open"></i> Upload Resources
                    </a>
                </li>
                <li className={isActive("/View-Resources")}>
                    <a className={isActive("/View-Resources")} onClick={() => navigate("/View-Resources")}>
                        <i class="fa-solid fa-folder-open"></i> View Resources
                    </a>
                </li>
                <li className={isActive("/Lab-Schedule")}>
                    <a className={isActive("/Lab-Schedule")} onClick={() => navigate("/Lab-Schedule")}>
                        <i className="fa-solid fa-calendar"></i> Lab Schedule
                    </a>
                </li>
                <li className={isActive("/Leaderboard-Admin")}>
                    <a className={isActive("/Leaderboard-Admin")} onClick={() => navigate("/Leaderboard-Admin")}>
                        <i className='fa-solid fa-trophy'></i> Leaderboard
                    </a>
                </li>
                <li className={isActive("/Admin-Settings")}>
                    <a className={isActive("/Admin-Settings")} onClick={() => navigate("/Admin-Settings")}>
                        <i className="fa-solid fa-gear"></i> Settings
                    </a>
                </li>
            </ul>
        </nav>
    );
}

export default Sidebar;