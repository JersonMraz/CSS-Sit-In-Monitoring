import { useState, useEffect } from "react";
import Sidebar from "../Admin-Sidebar.jsx";
import Navbar from "../Admin-Navbar.jsx";
import Swal from "sweetalert2";
import "./ReservationRequest.scss";

function ReservationRequest() {
    const [requests, setRequests] = useState([]);
    const [countRequest, setCountRequest] = useState(0);

    useEffect(() => {
        fetch("http://localhost/Sit-In Monitor Backend/get_reservation_request.php")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setRequests(data.requests);
                    setCountRequest(data.count);
                } else {
                    console.error("No records found");
                    setRequests();
                }
            })
            .catch((error) => {
                console.error("Error fetching reservation requests:", error);
                setStudents([]);
            });
    }, []);

    const formatTime = () => {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
    
        hours = hours % 12 || 12; 
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
        return `${hours}:${formattedMinutes} ${ampm}`;
    };

    const handleStatusUpdate = (reservation_id, studentName, purpose, date, timeIn, studentIdno, status, lab, pc_num, time = formatTime()) => {
        const payload = {
            reservation_id: reservation_id,
            name: studentName,
            purpose: purpose,
            date: date,
            timeIn: timeIn,
            idno: studentIdno,
            status: status,
            lab: lab,
            pc_num: pc_num,
            time: time,
        };  
        Swal.fire({
            icon: "question",
            title: `${payload.status.slice(0, -1)} this request?`,
            text: `Are you sure to ${payload.status.toLowerCase().slice(0, -1)} this request?`,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if(result.isConfirmed) {
                fetch("http://localhost/Sit-In Monitor Backend/update_reservation_status.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === "success") {
                        Swal.fire({
                            title: `Request ${payload.status.toLowerCase()}`,
                            text: 'This reservation request successfully reviewed.',
                            timer: 1500,
                            timerProgressBar: true
                        });
                        setRequests((prevRequests) =>
                            prevRequests.filter((request) => request.reservation_id !== reservation_id)
                        );
                    } else {
                        alert(data.message || "Failed to update reservation status");
                    }
                })
                .catch((error) => {
                    console.error("Error updating reservation status:", error);
                    alert("An error occurred while updating the reservation status");
                });
            }
        })
    };

    return (
    <div>
        <Sidebar />
        <Navbar />
        <div className="reservation-request-wrapper">
            <h1>Reservation Requests</h1>
            <div className="reservation-request-list">
                <p className="count">We have {requests.length} reservation requests</p>
                <div className="items">
                    {requests.map((request) => (
                            <div className="request-item" key={request.id}>
                                <p className="reserve-label">Reservation ID: {request.reservation_id}</p>
                                <div className="student-picture">
                                    <img
                                        src={request.profile_url ? `http://localhost/Sit-In Monitor Backend/uploads/${request.profile_url}` : "/public/Images/default.png"}
                                        alt="Student Picture"
                                        className="student-img"
                                    />
                                </div>
                                <div className="student-details">
                                    <div className="label">
                                        <p className="student-name-label">Student Name:</p>
                                        <p className="student-idno-label">Student IDNO:</p>
                                        <p className="purpose-label">Purpose:</p>
                                        <p className="lab-label">Lab Room:</p>
                                        <p className="pc-label">PC Num:</p>
                                        <p className="timein-label">Time In:</p>
                                        <p className="date-label">Date:</p>
                                        <p className="status-label">Status:</p>
                                    </div>
                                    <div className="real-details">
                                        <p className="student-name">{request.student_name}</p>
                                        <p className="student-idno">{request.student_idno}</p>
                                        <p className="purpose">{request.purpose}</p>
                                        <p className="lab">{request.lab}</p>
                                        <p className="pc">{request.pc_num}</p>
                                        <p className="timein">{request.time_in}</p>
                                        <p className="date">{request.date}</p>
                                        <p className="status" style={{color: "#E9BE5F"}}>{request.status}</p>
                                    </div>
                                </div>
                                <div className="action-btns">
                                <button
                                    className="decline-btn"
                                    onClick={() => handleStatusUpdate(request.reservation_id, request.student_name, request.purpose, request.date, request.time_in, request.student_idno, "Disapproved", request.lab, request.pc_num)}
                                >
                                    Decline
                                </button>
                                <button
                                    className="approve-btn"
                                    onClick={() => handleStatusUpdate(request.reservation_id, request.student_name, request.purpose, request.date, request.time_in, request.student_idno, "Approved", request.lab, request.pc_num)}
                                >
                                    Approve
                                </button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    </div>
    );
}
export default ReservationRequest;