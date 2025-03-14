import { useState, useEffect } from "react";
import Sidebar from "../Admin-Sidebar.jsx";
import Navbar from "../Admin-Navbar.jsx";
import Swal from "sweetalert2";
import "./Announcement.scss";

function Announcement() {
    const [announcement, setAnnouncement] = useState("");
    const [postedAnnouncements, setPostedAnnouncements] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [originalAnnouncement, setOriginalAnnouncement] = useState("");

    const fetchAnnouncements = async () => {
        try {
            const response = await fetch("http://localhost/Sit-In Monitor Backend/get_announcements.php");
            const data = await response.json();

            if (data.status === "success") {
                setPostedAnnouncements(data.announcements);
            } else {
                console.error("Failed to fetch announcements.");
            }
        } catch (error) {
            console.error("Error fetching announcements:", error);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handlePostAnnouncement = async () => {
        if (!announcement.trim()) {
            Swal.fire("Oops...", "Please enter an announcement message!", "warning");
            return;
        }

        Swal.fire({
            title: editingId ? "Update Announcement?" : "Post Announcement?",
            text: editingId ? "Are you sure you want to update this announcement?" : "Do you want to post this announcement?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: editingId ? "Yes, Update" : "Yes, Post",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user || !user.username) {
                    Swal.fire("Error", "Admin not logged in!", "error");
                    return;
                }

                const url = editingId
                    ? "http://localhost/Sit-In Monitor Backend/update_announcement.php"
                    : "http://localhost/Sit-In Monitor Backend/post_announcement.php";

                const formatTime = () => {
                    const now = new Date();
                    let hours = now.getHours();
                    const minutes = now.getMinutes();
                    const ampm = hours >= 12 ? "PM" : "AM";
                
                    hours = hours % 12 || 12; 
                    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
                
                    return `${hours}:${formattedMinutes} ${ampm}`;
                };

                const newAnnouncement = {
                    announcement_id: editingId || null, 
                    username: user.username,
                    message: announcement,
                    date: new Date().toISOString().split("T")[0],
                    time: formatTime(),
                };

                console.log("Sending data:", newAnnouncement);

                try {
                    const response = await fetch(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(newAnnouncement),
                    });

                    const data = await response.json();
                    if (data.status === "success") {
                        Swal.fire("Success!", editingId ? "Announcement updated!" : "Announcement posted!", "success");
                        setAnnouncement("");
                        setEditingId(null);
                        await fetchAnnouncements();
                    } else {
                        Swal.fire("Error", "Failed to save announcement.", "error");
                    }
                } catch (error) {
                    console.error("Error:", error);
                    Swal.fire("Error", "Something went wrong!", "error");
                }
            }
        });
    };

    const handleEditAnnouncement = (item) => {
        if (editingId === item.announcement_id) {
            setEditingId(null);
            setAnnouncement(""); 
        } else {
            setEditingId(item.announcement_id);
            setOriginalAnnouncement(item.message);
            setAnnouncement(item.message);
        }
    };

    const handleDeleteAnnouncement = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This announcement will be deleted permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            console.log("Announcement ID: ", id);
            if (result.isConfirmed) {
                try {
                    const response = await fetch("http://localhost/Sit-In Monitor Backend/delete_announcement.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id }),
                    });

                    const data = await response.json();
                    if (data.status === "success") {
                        Swal.fire("Deleted!", "Announcement has been removed.", "success");
                        await fetchAnnouncements();
                    } else {
                        Swal.fire("Error", "Failed to delete announcement.", "error");
                    }
                } catch (error) {
                    console.error("Error deleting announcement:", error);
                    Swal.fire("Error", "Something went wrong!", "error");
                }
            }
        });
    };

    return (
        <div>
            <Sidebar />
            <Navbar />
            <div className="AnnouncementContainer">
                <h1>Announcement</h1>
                <div className="announcementContainer">
                    <div className="CreateAnnouncement">
                        <h5>{editingId ? "Edit Announcement" : "Post new Announcement"}</h5>
                        <textarea
                            name="announcement"
                            value={announcement}
                            onChange={(e) => setAnnouncement(e.target.value)}
                            placeholder="Enter new announcement here..."
                        ></textarea>
                        <div className="action-btn-announcement">
                            <button className={`edit-butt ${editingId ? "active" : "disabled"}`} disabled={!editingId} onClick={handlePostAnnouncement}>Edit Announcement</button>
                            <button className="post-butt" onClick={handlePostAnnouncement}>Post Announcement</button>
                        </div>
                    </div>
                    <div className="PostedAnnouncement">
                        <h5>Posted Announcements</h5>
                        <div className="container">
                            {postedAnnouncements.length === 0 ? (
                                <p style={{ fontFamily: "Poppins-Light", fontSize: "17px" }}>No announcements yet.</p>
                            ) : (
                                postedAnnouncements.map((item) => (
                                    <div className="context" key={item.announcement_id}>
                                        <div className="announce">
                                            <h6>
                                                <strong>{item.admin_username} | {item.date} at {item.time}</strong>
                                            </h6>
                                            <div className="action-btn">
                                                <button className={`edit-btn ${editingId === item.announcement_id ? "editing-mode" : ""}`} onClick={() => handleEditAnnouncement(item)}>
                                                    {editingId === item.announcement_id ? "Cancel" : "Edit"} <i className="fa-solid fa-pencil"></i>
                                                </button>
                                                <button className="del-btn" onClick={() => handleDeleteAnnouncement(item.announcement_id)}>
                                                    Delete <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <p>{item.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Announcement;
