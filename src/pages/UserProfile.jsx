import Navbar from "../navbar";
import Sidebar from "../Sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./UserProfile.scss";

function UserProfile() {
    const navigate = useNavigate();

    const defaultAvatar = "../Images/default.png";
    const [avatar, setAvatar] = useState(defaultAvatar);
    const maxSession = 30;
    const [sessionProgress, setSessionProgress] = useState(""); 
    const progressPercentage = (sessionProgress / maxSession) * 100;

    const [user, setUser] = useState({
        idno: '',
        firstname: '',
        midname: '',
        lastname: '',
        session: '',
        course: '',
        email: '',
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
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
            setSessionProgress(Number(user.session) || 0);
        }
    }, []);

    return (
        <div>
            <Sidebar />
            <Navbar />
            <div className="UserProfile">
                <h1>My Profile</h1>
                <div className="UserProfileContainer">
                    <div className="ProfileHeader">
                        <div className="userinfo">
                            <img src={avatar} alt="Profile Picture" onError={(e) => e.target.src = defaultAvatar} />
                            <div className="user-details">
                                <h5>Jerson Sullano</h5>
                                <h6>JersonMraz</h6>
                                <p>Student</p>
                            </div>
                        </div>
                        <div className="progress-bar" style={{ width: 190, height: 190 }}>
                            <CircularProgressbarWithChildren value={progressPercentage} styles={buildStyles({ pathColor: "green", trailColor: "#d6d6d6", pathTransitionDuration: 1 })}>
                                <div style={{ fontSize: "14px", textAlign: "center", fontFamily: 'Poppins-Regular' }}>
                                    <strong style={{fontSize: "19px", fontFamily: 'Poppins-Regular'}}>Session</strong>
                                    <br />
                                    <span style={{ fontSize: "21px", fontFamily: 'Poppins-Regular' }}>{sessionProgress}</span>
                                </div>
                            </CircularProgressbarWithChildren>
                        </div>
                    </div>

                    <div className="ProfileBody">
                        <div className="DataContainer">
                            <div className="titleAndEdit">
                                <h3>Personal Details</h3>
                                <a onClick={() => navigate("/settings")}>Edit <i class="fa-solid fa-pencil"></i></a>
                            </div>
                            <div className="firstRow">
                                <div className="firstname">
                                    <label>First Name</label>
                                    <input type="text" value={user.firstname} readOnly/>
                                </div>
                                <div className="midname">
                                    <label>Middle Name</label>
                                    <input type="text" value={user.midname} readOnly/>
                                </div>
                                <div className="lastname">
                                    <label>Last Name</label>
                                    <input type="text" value={user.lastname} readOnly/>
                                </div>
                            </div>
                            <div className="secondRow">
                                <div className="email">
                                    <label>Email Address</label>
                                    <input type="text" value={user.email} readonly/>
                                </div>
                                <div className="idno">
                                    <label>ID Number</label>
                                    <input className="idno" value={user.idno} readOnly/>
                                </div>
                            </div>
                            <div className="thirdRow">
                                <div className="course">
                                    <label>Course</label>
                                    <input type="text" value={user.course} readOnly/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default UserProfile;