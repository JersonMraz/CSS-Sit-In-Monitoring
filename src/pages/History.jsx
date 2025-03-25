import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Navbar from "../navbar";
import Sidebar from "../Sidebar"; 
import "./History.scss";
import axios from "axios";

function History() {
    const [history, setHistory] = useState([]); // Store sit-in records
    const [loading, setLoading] = useState(true); // Handle loading state

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user")); // Get user from localStorage
                if (!user || !user.idno) {
                    console.error("No user ID found in localStorage");
                    return;
                }

                const response = await axios.get(`http://localhost/Sit-In Monitor Backend/getHistory.php?idno=${user.idno}`);
                setHistory(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching history:", error);
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    function showFeedbackPopup(recordId, recordLab) {
        let selectedRating = 0;

        const formatTime = () => {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes();
            const ampm = hours >= 12 ? "PM" : "AM";
        
            hours = hours % 12 || 12; 
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        
            return `${hours}:${formattedMinutes} ${ampm}`;
        };
    
        Swal.fire({
            title: "Rate your experience",
            html: `
                <style>
                    .swal-title {
                        text-align: left !important;
                        cursor: default;
                        color: #E9BE5F;
                    }
                    #star-rating {
                        font-size: 30px;
                        cursor: pointer;
                        display: flex;
                        justify-content: start;
                        gap: 5px;
                        width: 41%;
                    }
                    .star {
                        color: gray;
                        transition: color 0.3s;
                    }
                    .star.selected,
                    .star.hovered {
                        color: #E9BE5F;
                    }
                    h4 {
                        font-family: 'Poppins-Regular';
                        font-size: 20px;
                        margin-bottom: 3px;
                        text-align: left;
                        color: #E9BE5F;
                    }
                    #feedback-text {
                        font-family: 'Poppins-Medium';
                        resize: none;
                        width: 100% !important;
                        margin: 0 !important;
                        display: block !important;
                    }
                    .confirm-btn {
                        background-color: transparent;
                        border: 1px solid #E9BE5F;
                        font-family: 'Poppins-Regular';
                        font-size: 15px;
                        color: #E9BE5F;
                    }
                    .confirm-btn:hover {
                        transition: 0.3s ease;
                        background-color: #E9BE5F;
                        color: #fff;
                    }
                    .cancel-btn {
                        background-color: tomato;
                        border: 1px solid tomato;
                        font-family: 'Poppins-Regular';
                        font-size: 15px;
                    }
                </style>
                <div id="star-rating">
                    <span class="star" data-value="1"><i class="fa-solid fa-star"></i></span>
                    <span class="star" data-value="2"><i class="fa-solid fa-star"></i></span>
                    <span class="star" data-value="3"><i class="fa-solid fa-star"></i></span>
                    <span class="star" data-value="4"><i class="fa-solid fa-star"></i></span>
                    <span class="star" data-value="5"><i class="fa-solid fa-star"></i></span>
                </div>
                <h4>Review:</h4>
                <textarea id="feedback-text" class="swal2-textarea" placeholder="Enter your feedback here..."></textarea>
            `,
            showCancelButton: true,
            confirmButtonText: "Submit",
            cancelButtonText: "Cancel",
            customClass: {
                title: "swal-title",
                confirmButton: "confirm-btn",
                cancelButton: "cancel-btn"
            },
            didOpen: () => {
                document.querySelector('.swal2-container').style.backdropFilter = "blur(10px)";
                document.querySelector('.swal2-container').style.background = "rgba(0, 0, 0, 0.5)";
                const stars = document.querySelectorAll(".star");
    
                stars.forEach((star, index) => {
                    star.addEventListener("click", () => {
                        selectedRating = index + 1;
                        stars.forEach((s, i) => {
                            s.classList.toggle("selected", i < selectedRating);
                        });
                    });
    
                    star.addEventListener("mouseover", () => {
                        stars.forEach((s, i) => {
                            s.classList.toggle("hovered", i <= index);
                        });
                    });
    
                    star.addEventListener("mouseout", () => {
                        stars.forEach((s) => s.classList.remove("hovered"));
                    });
                });
            },
            preConfirm: () => {
                const feedback = document.getElementById("feedback-text").value;
                if (!selectedRating) {
                    Swal.showValidationMessage("Please select a rating!");
                }
                return { rating: selectedRating, feedback: feedback };
            }
        }).then((result) => {
            const created_at = formatTime();
            if (result.isConfirmed) {
                const user = JSON.parse(localStorage.getItem("user"));
                const feedbackData = {
                    idno: user.idno,
                    studentname: user.firstname + ' ' + user.lastname,
                    record_id: recordId,
                    laboratory: recordLab,
                    rating: result.value.rating,
                    feedback: result.value.feedback,
                    created_at: created_at
                };

                // Send feedback to the backend via Axios
                axios.post("http://localhost/Sit-In Monitor Backend/insertFeedback.php", feedbackData)
                    .then(response => {
                        console.log("User IDNO: " + feedbackData.idno);
                        console.log("Student Name: " + feedbackData.studentname);
                        console.log("Record ID: " + feedbackData.record_id);
                        console.log("Laboratory: " + feedbackData.laboratory);
                        console.log("Rating: " + feedbackData.rating);
                        console.log("Feedback: " + feedbackData.feedback);
                        Swal.fire("Thank you!", "Your feedback has been submitted.", "success");
                    })
                    .catch(error => {
                        console.error("Error submitting feedback:", error);
                        Swal.fire("Error", "Something went wrong. Please try again.", "error");
                    });
            }
        });
    }

    return (
        <div>
            <Sidebar />
            <Navbar />
            <div className="historybody">
                <h1>Sit-In History</h1>
                <div className="historycont">
                    <table>
                        <thead>
                            <tr>
                                <th>Record ID</th>
                                <th>ID Number</th>
                                <th>Name</th>
                                <th>Purpose</th>
                                <th>Laboratory</th>
                                <th>Date</th>
                                <th>Logged In</th>
                                <th>Logged Out</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8">Loading...</td></tr>
                            ) : history.length > 0 ? (
                                history.map((record, index) => {
                                    const isStillInSession = !record.time_out; // Check if session is still ongoing

                                    return (
                                        <tr key={index}>
                                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                                            <td>{record.idno}</td>
                                            <td>{record.fullname}</td>
                                            <td>{record.purpose}</td>
                                            <td>{record.lab}</td>
                                            <td>{record.date}</td>
                                            <td>{record.time_in}</td>

                                            {/* Change text color if session is ongoing */}
                                            <td>
                                                {record.time_out ? (
                                                    record.time_out
                                                ) : (
                                                    <span style={{ color: "red", fontWeight: "bold" }}>Still in session</span>
                                                )}
                                            </td>

                                            {/* Disable feedback button if session is still ongoing */}
                                            <td>
                                                <button
                                                    className="feedBack"
                                                    onClick={() => showFeedbackPopup(index + 1, record.lab)}
                                                    disabled={isStillInSession}
                                                    style={{
                                                        backgroundColor: isStillInSession ? "#ccc" : "rgb(76, 175, 80)", 
                                                        color: isStillInSession ? "#888" : "#fff",
                                                        cursor: isStillInSession ? "not-allowed" : "pointer"
                                                    }}
                                                >
                                                    Feedback
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr><td colSpan="8">No records found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default History;
