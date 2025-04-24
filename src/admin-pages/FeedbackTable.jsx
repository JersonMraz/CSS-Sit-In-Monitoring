import "./FeedbackTable.scss";
import Sidebar from "../Admin-Sidebar";
import Navbar from "../Admin-Navbar";
import { useEffect, useState } from "react";

function FeedbackTable() {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?.id) {
            console.log("🔴 No user found. Redirecting to login...");
            Swal.fire({
                title: 'Oops...',
                text: 'You must log in first.',
                icon: 'warning',
                confirmButtonText: 'Ok'
            }).then(() => {
                navigate("/");
            });
        } else {
            console.log("🟢 User is logged in:", user.username);
            fetchFeedback();
        }
    }, []);

    const fetchFeedback = () => {
        fetch("http://localhost/Sit-In Monitor Backend/getFeedback.php")
            .then(response => response.json())
            .then(data => {
                setStudents(data.feedbacks);
            })
            .catch(error => {
                console.error("Error fetching feedbacks: ", error)
                setStudents([]);
            });
    };

    const containsProfanity = (message) => {
        const profanityList = ["shit", "shet", "bushit", "bullshit", "bullshet", "yawa", "peste", "giatay", "animal", "wtf"]; 
        const lowerCaseMessage = message.toLowerCase();
        
        return profanityList.some(word => lowerCaseMessage.includes(word));
    };

    return (
        <div>
            <Sidebar/>
            <Navbar/>
            <div className="feedbackbody">
                <h1>Users Feedbacks</h1>
                <div className="fbcontainer">
                    <div className="fbtable">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID Number</th>
                                    <th>Student Name</th>
                                    <th>Laboratory</th>
                                    <th>Ratings</th>
                                    <th>Date</th>
                                    <th>Message</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length > 0 ? (
                                    students.map((students, index) => (
                                        <tr key={index}>
                                            <td>{students.user_idno}</td>
                                            <td>{students.studentname}</td>
                                            <td>{students.laboratory}</td>
                                            <td>{students.rating}/5</td>
                                            <td>{students.date}</td>
                                            <td style={{ color: containsProfanity(students.feedback) ? "red" : "black" }}>{students.feedback}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">No feedbacks</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeedbackTable