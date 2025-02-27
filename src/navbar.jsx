import { useState, useEffect } from 'react';
import './navbar.scss'

function Navbar() {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const defaultAvatar = "../Images/default.png";
    const [avatar, setAvatar] = useState(defaultAvatar);

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

    return(
        <div className="navbar">
            {user ? (
                <div className="container">
                    <a><i className='fa-solid fa-bell'></i></a>
                    <a><img src={avatar} alt="Profile Picture" onError={(e) => e.target.src = defaultAvatar}/><p>{user.firstname} {user.lastname}</p></a>
                </div>
            ) : (
                <span>Loading...</span>
            )}
        </div>
    );
}
export default Navbar