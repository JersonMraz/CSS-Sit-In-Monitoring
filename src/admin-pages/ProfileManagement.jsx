import "./ProfileManagement.scss";
import { useState, useEffect } from "react";
import Sidebar from "../Admin-Sidebar.jsx";
import Navbar from "../Admin-Navbar.jsx";
import Swal from "sweetalert2";

function ProfileManagement() {
    const [user, setUser] = useState(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [activeSection, setActiveSection] = useState("profile");
    const [isChanged, setIsChanged] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const togglePasswordVisibility = (field) => {
        if (field === "current") {
            setShowCurrentPassword((prev) => !prev);
        } else if (field === "new") {
            setShowNewPassword((prev) => !prev);
        }
    };

    const [formData, setFormData] = useState({
        firstname: "",
        midname: "",
        lastname: "",
        email: "",
        username: "",
        idno: "",
        course: "",
        yearlvl: "",
    }); 
    const defaultAvatar = "../Images/default.png";
    const [avatar, setAvatar] = useState(defaultAvatar);

    const handleResetPassword = () => {
        setNewPassword("");
    };

    const handlePasswordChange = () => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) return;
    
        fetch("http://localhost/Sit-In Monitor Backend/update_password.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: storedUser.username,
                current_password: currentPassword,
                new_password: newPassword,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                Swal.fire("Success", "Password updated successfully!", "success");
                setCurrentPassword(newPassword);
                setNewPassword("");
            } else {
                Swal.fire("Error", data.message, "error");
            }
        })
        .catch(error => console.error("Password Update Error:", error));
    };
    
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.password) {
            setCurrentPassword(storedUser.password);
        }
    }, []);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
            setFormData({
                firstname: storedUser.firstname || "",
                midname: storedUser.midname || "",
                lastname: storedUser.lastname || "",
                email: storedUser.email || "",
                username: storedUser.username || "",
                idno: storedUser.idno || "",
                course: storedUser.course || "",
                yearlvl: storedUser.yearlvl || "",
            });
        }
    }, []);
    
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) return;

        const hasChanges = Object.keys(formData).some(
            (key) => formData[key] !== storedUser[key]
        );

        setIsChanged(hasChanges);
    }, [formData]);
    
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

    function ChangeAvatar(event) {
        const file = event.target.files[0];
        if (!file) return;
    
        const formData = new FormData();
        formData.append("profile_url", file);
        formData.append("username", JSON.parse(localStorage.getItem("user")).username);
    
        fetch("http://localhost/Sit-In Monitor Backend/change_avatar.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                document.getElementById("profilePic").src = `http://localhost/Sit-In Monitor Backend/uploads/${data.profile_url}`;
                window.location.reload();
                Swal.fire("Success", "Profile updated successfully!", "success");
            } else {
                Swal.fire("Error", data.message, "error");
            }
        })
        .catch(error => console.error("Upload Error:", error));
    }
    
    function DeleteAvatar() {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#E9BE5F",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if(result.isConfirmed) {
                fetch("http://localhost/Sit-In Monitor Backend/delete_avatar.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: user.username })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        setAvatar("http://localhost/Sit-In Monitor Backend/uploads/default.png");
                        document.getElementById("profilePic").src = "http://localhost/Sit-In Monitor Backend/uploads/default.png";
                        window.location.reload();
                        Swal.fire("Success", "Avatar deleted successfully!", "success");
                    } else {
                        Swal.fire("Error", data.message, "error");
                    }
                })
                .catch(error => console.error("Delete Error:", error));
            }
        });
    }
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value || prev[name],
        }));
    };

    const handleSaveChanges = () => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) return;
    
        fetch("http://localhost/Sit-In Monitor Backend/update_profile.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, oldUsername: storedUser.username }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                // Update localStorage with new username
                const updatedUser = { ...storedUser, ...formData }; 
                localStorage.setItem("user", JSON.stringify(updatedUser));
                Swal.fire("Success", "Profile updated successfully!", "success");
                setIsChanged(false);
            } else {
                Swal.fire("Error", data.message, "error");
            }
        })
        .catch(error => console.error("Update Error:", error));
    };    

    return (
        <div>
            <Sidebar />
            <Navbar />
            <div className="StudProfBody">
                <h1>Account settings</h1>
                <div className="menu">
                    <ul>
                        <li className={activeSection === "profile" ? "isActive" : ""}>
                            <a href="#" onClick={(e) => { e.preventDefault(); setActiveSection("profile"); }} className={activeSection === "profile" ? "isActive" : ""}>
                                <i className="fa-solid fa-user"></i> Profile Settings
                            </a>
                        </li>
                        <li className={activeSection === "password" ? "isActive" : ""}>
                            <a href="#" onClick={(e) => { e.preventDefault(); setActiveSection("password"); }} className={activeSection === "password" ? "isActive" : ""}>
                                <i className="fa-solid fa-lock"></i> Password
                            </a>
                        </li>
                    </ul>
                </div>
                {activeSection === 'profile' && (
                    <div className="StudProfContainer" style={{ display: activeSection === "profile" ? "block" : "none" }}>
                        <h1>Profile Settings</h1>
                        <div className="profilePicture">
                            <img id="profilePic" src={avatar} alt="Profile Picture" onError={(e) => e.target.src = defaultAvatar} />
                            <input type="file" id="fileInput" accept="image/*" hidden onChange={ChangeAvatar} />
                            <button className="upload-img" onClick={() => document.getElementById("fileInput").click()}>Upload New</button>
                            <button className="delete-img" onClick={DeleteAvatar}>Delete Avatar</button>
                        </div>
                        <div className="credentials">
                            <div className="name">
                                <div className="firstname">
                                    <label htmlFor="firstname">First Name</label>
                                    <input type="text" name="firstname" value={formData.firstname || ""} onChange={handleChange}  />
                                </div>
                                <div className="midname">
                                    <label htmlFor="midname">Middle Name</label>
                                    <input type="text" name="midname" value={formData.midname || ""} onChange={handleChange}  />
                                </div>
                                <div className="lastname">
                                    <label htmlFor="lastname">Last Name</label>
                                    <input type="text" name="lastname" value={formData.lastname || ""} onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="ikaduha">
                                <div className="email">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" name="email" value={formData.email || ""} onChange={handleChange}/>
                                </div>
                                <div className="username">
                                    <label htmlFor="username">Username</label>
                                    <input type="text" name="username" value={formData.username || ""} onChange={handleChange}/>
                                </div>
                                <div className="yearlvl">
                                    <label htmlFor="yearlvl">Year level</label>
                                    <select name="yearlvl" value={formData.yearlvl || ""} onChange={handleChange}>
                                        <option value="" disabled>Select Year Level</option>
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                        <option value="3">3rd Year</option>
                                        <option value="4">4th Year</option>
                                    </select>
                                </div>
                            </div>
                            <div className="ikatulo">
                                <div className="course">
                                    <label htmlFor="course">Course</label>
                                    <select name="course" value={formData.course || ""} onChange={handleChange}>
                                        <option value="" disabled>Select Course</option>
                                        <option value="Bachelor of Science in Information Technology">Bachelor of Science in Information Technology</option>
                                        <option value="Bachelor of Science in Computer Science">Bachelor of Science in Computer Science</option>
                                        <option value="Bachelor of Science in Information System">Bachelor of Science in Information System</option>
                                        <option value="Bachelor of Science in Accountancy">Bachelor of Science in Accountancy</option>
                                        <option value="Bachelor of Science in Custom Administration">Bachelor of Science in Custom Administration</option>
                                    </select>
                                </div>
                            </div>
                            <button className="SaveChanges" onClick={handleSaveChanges} disabled={!isChanged} style={{backgroundColor: isChanged ? "#E9BE5F" : "lightgray",cursor: isChanged ? "pointer" : "not-allowed",}}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}
                {activeSection === 'password' && (
                    <div className="StudPassContainer" style={{ display: activeSection === "password" ? "block" : "none" }}>
                        <h1>Password Settings</h1>
                        <div className="PasswordContainer">
                            <div className="oldpassword">
                                <label htmlFor="currentpassword">Current Password</label>
                                <input type={showCurrentPassword ? "text" : "password"} name="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} readOnly/>
                                <i className={`fa-solid ${showCurrentPassword ? "fa-eye" : "fa-eye-slash"}`} onClick={() => togglePasswordVisibility("current")}></i>
                            </div>
                            <div className="newpassword">
                                <label htmlFor="newPassword">New Password</label>
                                <input type={showNewPassword ? "text" : "password"} name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                <i className={`fa-solid ${showNewPassword ? "fa-eye" : "fa-eye-slash"}`} onClick={() => togglePasswordVisibility("new")} ></i>
                            </div>
                        </div>
                        <div className="ChangeButtons">
                            <button className="SavePassword" onClick={handlePasswordChange} disabled={!currentPassword || !newPassword}  style={{backgroundColor: newPassword ? "#E9BE5F" : "lightgray",cursor: newPassword ? "pointer" : "not-allowed",}}>
                                Update Password
                            </button>
                            <button className="ResetPassword" onClick={handleResetPassword}>
                                Reset
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileManagement;
