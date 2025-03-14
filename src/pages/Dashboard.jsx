import "./dashboard.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar.jsx";
import Navbar from "../navbar.jsx";
import Swal from 'sweetalert2';

function Dashboard() {
    const [activeSection, setActiveSection] = useState("RulesandRegulation");
    const [selectedComponent, setSelectedComponent] = useState("RulesandRegulation");
    const [announcements, setAnnouncements] = useState([]);

    let heading = "";
    if(selectedComponent === "RulesandRegulation") {
        heading = "Rules and Regulation";
    } else {
        heading = "Sit-In Laboratory Rules";
    }

    const navigate = useNavigate();

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
    }, [navigate]);

    useEffect(() => {
        fetch("http://localhost/Sit-In Monitor Backend/get_announcements.php")
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    setAnnouncements(data.announcements);
                } else {
                    console.error("No announcements found");
                }
            })
            .catch(error => console.error("Error fetching announcements:", error));
    }, []);

    return (
        <div>
            <Sidebar />
            <Navbar />
            <div className="dashboardPanel">
                <h1>Dashboard</h1>
                <div className="menuside">
                    <div className="menu">
                        <ul>
                            <li className={activeSection === "LabRules" ? "isActive" : ""}>
                                <a href="#" className={activeSection === "LabRules" ? "isActive" : ""}  onClick={() => {setSelectedComponent("LabRules"); setActiveSection("LabRules"); }}><i className="fa-solid fa-scroll"></i> Sit-In Lab Rules</a>
                            </li>
                            <li className={activeSection === "RulesandRegulation" ? "isActive" : ""}>
                                <a href="#" className={activeSection === "RulesandRegulation" ? "isActive" : ""}  onClick={() => {setSelectedComponent("RulesandRegulation"); setActiveSection("RulesandRegulation"); }}><i className="fa-solid fa-shield"></i> Rules and Regulations</a>
                            </li>
                        </ul>
                    </div>

                    {/* Announcement Container */}
                    <div className="announcements">
                        <p className="announcement-title"><i className="fa-solid fa-bullhorn"></i> Announcement</p>
                        <div className="container">
                            {announcements.length > 0 ? (
                                announcements.map((announcement, index) => (
                                    <div key={index} className="context">
                                        <h6><strong>{announcement.admin_username}</strong></h6>
                                        <p className="date_time">{announcement.date} at {announcement.time}</p>
                                        <p className="message">{announcement.message}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No announcements available.</p>
                            )}
                            {/*<div className="context">
                                <h6><strong>CCS Admin | 2025-Feb-03</strong></h6>
                                <p>The College of Computer Studies will open the registration of students for the Sit-in privilege starting tomorrow. Thank you! Lab Supervisor</p>
                            </div>
                            <div className="context">
                                <h6><strong>CCS Admin | 2024-May-08</strong></h6>
                                <p>Important Announcement We are excited to announce the launch of our new website! 🎉 Explore our latest products and services now!</p>
                            </div>
                            <div className="context">
                                <h6><strong>CCS Admin | 2025-Feb-03</strong></h6>
                                <p>The College of Computer Studies will open the registration of students for the Sit-in privilege starting tomorrow. Thank you! Lab Supervisor</p>
                            </div>
                            <div className="context">
                                <h6><strong>CCS Admin | 2024-May-08</strong></h6>
                                <p>Important Announcement We are excited to announce the launch of our new website! 🎉 Explore our latest products and services now!</p>
                            </div>*/}
                        </div>
                    </div>
                </div>
                <div className="RulesandRegulation">
                    <div className="header">
                        <h5>{heading}</h5>
                        <h6>University of Cebu</h6>
                        <p>College of Information & Computer Studies</p>
                    </div>
                    <div className="content">
                        {selectedComponent === "RulesandRegulation" && <RulesandRegulation />}
                        {selectedComponent === "LabRules" && <LabRules />}
                    </div>
                </div>
            </div>
        </div>
    );
}

function RulesandRegulation() {
    return(
        <>
        <div className="labrr">
            <h6>Laboratory Rules and Regulations</h6>
            <hr />
            <p>To avoid embarrassment and maintain camaraderie with your friends and superiors at our laboratories, please observe the following:</p>
            <p>1. Maintain silence, proper decorum, and discipline inside the laboratory. Mobile phones, walkmans and other personal pieces of equipment must be switched off.</p>
            <p>2. Games are not allowed inside the lab. This includes computer-related games, card games and other games that may disturb the operation of the lab.</p>
            <p>3. Surfing the Internet is allowed only with the permission of the instructor. Downloading and installing of software are strictly prohibited.</p>
            <p>4. Getting access to other websites not related to the course (especially pornographic and illicit sites) is strictly prohibited.</p>
            <p>5. Deleting computer files and changing the set-up of the computer is a major offense.</p>
            <p>6. Observe computer time usage carefully. A fifteen-minute allowance is given for each use. Otherwise, the unit will be given to those who wish to "sit-in".</p>
            <p>7. Observe proper decorum while inside the laboratory.</p>
            <ul>
                <li>Do not get inside the lab unless the instructor is present.</li>
                <li>All bags, knapsacks, and the likes must be deposited at the counter.</li>
                <li>Follow the seating arrangement of your instructor.</li>
                <li>At the end of class, all software programs must be closed.</li>
                <li>Return all chairs to their proper places after using.</li>
            </ul>
            <p>8. Chewing gum, eating, drinking, smoking, and other forms of vandalism are prohibited inside the lab.</p>
            <p>9. Anyone causing a continual disturbance will be asked to leave the lab. Acts or gestures offensive to the members of the community, including public display of physical intimacy, are not tolerated.</p>
            <p>10. Persons exhibiting hostile or threatening behavior such as yelling, swearing, or disregarding requests made by lab personnel will be asked to leave the lab.</p>
            <p>11. For serious offense, the lab personnel may call the Civil Security Office (CSU) for assistance.</p>
            <p>12. Any technical problem or difficulty must be addressed to the laboratory supervisor, student assistant or instructor immediately.</p>
            <hr />
            <p><strong>DISCIPLINARY ACTION</strong></p>
            <ul>
                <li>First Offense - The Head or the Dean or OIC recommends to the Guidance Center for a suspension from classes for each offender.</li>
                <li>Second and Subsequent Offenses - A recommendation for a heavier sanction will be endorsed to the Guidance Center.</li>
            </ul>
        </div>
        </>
    );
}
function LabRules() {
    return(
        <div className="labrr">
            <h6>Sit-In Laboratory Rules</h6>
            <hr />
            <p><strong>DISCIPLINARY ACTION</strong></p>
            <ul>
                <li>First Offense - The Head or the Dean or OIC recommends to the Guidance Center for a suspension from classes for each offender.</li>
                <li>Second and Subsequent Offenses - A recommendation for a heavier sanction will be endorsed to the Guidance Center.</li>
            </ul>
            <hr />
            <p>To avoid embarrassment and maintain camaraderie with your friends and superiors at our laboratories, please observe the following:</p>
            <p>1. Maintain silence, proper decorum, and discipline inside the laboratory. Mobile phones, walkmans and other personal pieces of equipment must be switched off.</p>
            <p>2. Games are not allowed inside the lab. This includes computer-related games, card games and other games that may disturb the operation of the lab.</p>
            <p>3. Surfing the Internet is allowed only with the permission of the instructor. Downloading and installing of software are strictly prohibited.</p>
            <p>4. Getting access to other websites not related to the course (especially pornographic and illicit sites) is strictly prohibited.</p>
            <p>5. Deleting computer files and changing the set-up of the computer is a major offense.</p>
            <p>6. Observe computer time usage carefully. A fifteen-minute allowance is given for each use. Otherwise, the unit will be given to those who wish to "sit-in".</p>
            <p>7. Observe proper decorum while inside the laboratory.</p>
            <ul>
                <li>Do not get inside the lab unless the instructor is present.</li>
                <li>All bags, knapsacks, and the likes must be deposited at the counter.</li>
                <li>Follow the seating arrangement of your instructor.</li>
                <li>At the end of class, all software programs must be closed.</li>
                <li>Return all chairs to their proper places after using.</li>
            </ul>
            <p>8. Chewing gum, eating, drinking, smoking, and other forms of vandalism are prohibited inside the lab.</p>
            <p>9. Anyone causing a continual disturbance will be asked to leave the lab. Acts or gestures offensive to the members of the community, including public display of physical intimacy, are not tolerated.</p>
            <p>10. Persons exhibiting hostile or threatening behavior such as yelling, swearing, or disregarding requests made by lab personnel will be asked to leave the lab.</p>
            <p>11. For serious offense, the lab personnel may call the Civil Security Office (CSU) for assistance.</p>
            <p>12. Any technical problem or difficulty must be addressed to the laboratory supervisor, student assistant or instructor immediately.</p>
        </div>
    );
}

export default Dashboard