import Sidebar from "../Admin-Sidebar";
import Navbar from "../Admin-Navbar";
import { useState, useEffect } from "react";
import "./AdminProfile.scss";

function AdminProfile() {
    const defaultAvatar = "../Images/default.png";
    const [avatar, setAvatar] = useState(defaultAvatar);

    const [user, setUser] = useState({
        idno: '',
        firstname: '',
        midname: '',
        lastname: '',
        session: '',
        course: '',
        email: '',
        username: '',
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
                                <h5>{`${user?.firstname || ""} ${user?.midname || ""} ${user?.lastname || ""}`.trim()}</h5>
                                <h6>{user?.username || ""}</h6>
                                <p>Admin</p>
                            </div>
                        </div>
                    </div>

                    <div className="ProfileBody">
                        <div className="DataContainer">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AdminProfile;