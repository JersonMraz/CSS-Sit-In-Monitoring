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
                        <i className='fa-solid fa-bullhorn'></i>Announcement
                    </a>
                </li>
                <li className={isActive("/Current-Sit-In")}>
                    <a className={isActive("/Current-Sit-In")} onClick={() => navigate("/Current-Sit-In")}>
                        <i class="fa-solid fa-code"></i>Current Sit-In
                    </a>
                </li>
                <li className={isActive("/Sitin-Records")}>
                    <a className={isActive("/Sitin-Records")} onClick={() => navigate("/Sitin-Records")}>
                        <i class="fa-solid fa-scroll"></i>Sit-in Records
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