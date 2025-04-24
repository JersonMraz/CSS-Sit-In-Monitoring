import { useNavigate, useLocation } from 'react-router-dom';
import './sidebar.scss';

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
                <li className={isActive("/dashboard")}>
                    <a className={isActive("/dashboard")} onClick={() => navigate("/dashboard")}>
                        <i className="fa-solid fa-house"></i> Home
                    </a>
                </li>
                <li className={isActive("/reservation")}>
                    <a className={isActive("/reservation")} onClick={() => navigate("/reservation")}>
                        <i className="fa-solid fa-user-clock"></i> Reservation
                    </a>
                </li>
                <li className={isActive("/history")}>
                    <a className={isActive("/history")} onClick={() => navigate("/history")}>
                        <i className='fa-solid fa-clock-rotate-left'></i> History
                    </a>
                </li>
                <li className={isActive("/lab-resources")}>
                    <a className={isActive("/lab-resources")} onClick={() => navigate("/lab-resources")}>
                        <i className="fa-solid fa-folder-open"></i> Resources
                    </a>
                </li>
                <li className={isActive("/schedule")}>
                    <a className={isActive("/schedule")} onClick={() => navigate("/schedule")}>
                        <i className="fa-solid fa-calendar"></i> Lab Schedule
                    </a>
                </li>
                <li className={isActive("/leaderboard")}>
                    <a className={isActive("/leaderboard")} onClick={() => navigate("/leaderboard")}>
                        <i className='fa-solid fa-trophy'></i> Leaderboard
                    </a>
                </li>
                <li className={isActive("/settings")}>
                    <a className={isActive("/settings")} onClick={() => navigate("/settings")}>
                        <i className="fa-solid fa-gear"></i> Settings
                    </a>
                </li>
            </ul>
        </nav>
    );
}

export default Sidebar;