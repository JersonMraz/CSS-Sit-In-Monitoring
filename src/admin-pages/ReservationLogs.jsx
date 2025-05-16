import Sidebar from "../Admin-Sidebar.jsx";
import Navbar from "../Admin-Navbar.jsx";
import "./ReservationLogs.scss";
import { useState, useEffect } from "react";

function ReservationLogs() {
    const [reservation, setReservation] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [selectedPurpose, setSelectedPurpose] = useState("");
    const [selectedLab, setSelectedLab] = useState("");

    useEffect(() => {
        fetch("http://localhost/Sit-In Monitor Backend/retrieve_reservation.php")
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    setReservation(data.reservations);
                    setFilteredReservations(data.reservations);
                } else {
                    console.error("No records found");
                    setReservation([]);
                    setFilteredReservations([]);
                }
            })
            .catch(error => {
                console.error("Error fetching records:", error);
                setStudents([]);
                setFilteredReservations([]);
            });
    }, []);

    useEffect(() => {
        const filtered = reservation.filter(item => {
            const matchesPurpose = selectedPurpose === "" || item.purpose === selectedPurpose;
            const matchesLab = selectedLab === "" || item.lab === selectedLab;
            return matchesPurpose && matchesLab;
        });
        setFilteredReservations(filtered);
    }, [selectedPurpose, selectedLab, reservation]);

    return(
        <div>
            <Sidebar />
            <Navbar />
            <div className="ReservationRecord">
                <h1>Reservation Records</h1>
                <div className="generate">
                    <div className="filter">
                        <select className="filter-purp" value={selectedPurpose} onChange={(e) => setSelectedPurpose(e.target.value)}>
                            <option value="">All Purposes</option>
                            <option value="C# Programming">C# Programming</option>
                            <option value="C Programming">C Programming</option>
                            <option value="Java Programming">Java Programming</option>
                            <option value="Systems Integration & Architecture">Systems Integration & Architecture</option>
                            <option value="Embedded Systems & IoT">Embedded Systems & IoT</option>
                            <option value="Digital Logic & Design">Digital Logic & Design</option>
                            <option value="Computer Application">Computer Application</option>
                            <option value="Database">Database</option>
                            <option value="Project Management">Project Management</option>
                            <option value="Python Programming">Python Programming</option>
                            <option value="Mobile Application">Mobile Application</option>
                            <option value="Others">Others..</option>
                        </select>
                        <select className="filter-lab" value={selectedLab} onChange={(e) => setSelectedLab(e.target.value)}>
                            <option value="">All Laboratory Room</option>
                            <option value="Lab 524">Lab 524</option>
                            <option value="Lab 526">Lab 526</option>
                            <option value="Lab 528">Lab 528</option>
                            <option value="Lab 530">Lab 530</option>
                            <option value="Lab 542">Lab 542</option>
                            <option value="Lab 544">Lab 544</option>
                            <option value="Lab 517">Lab 517</option>
                        </select>
                    </div>
                </div>

                <div className="RecordContainer">
                    <div className="RecordTable">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Purpose</th>
                                    <th>Room</th>
                                    <th>PC #</th>
                                    <th>Reservation Date & Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                            {filteredReservations.length > 0 ? (
                                    filteredReservations.map((reservation, index) => (
                                        <tr key={index}>
                                            <td>{reservation.reservation_id}</td>
                                            <td>{reservation.student_name}</td>
                                            <td>{reservation.purpose}</td>
                                            <td>{reservation.lab}</td>
                                            <td>{reservation.pc_num}</td>
                                            <td>{reservation.date} at {reservation.time_in}</td>
                                            <td className={reservation.status === "Approved" ? "status-approved" : "status-disapproved"}>
                                                <span className="sud">
                                                    {reservation.status === "Approved" ? (
                                                        <>
                                                            <i className="fa-solid fa-check"></i> Approved
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fa-solid fa-xmark"></i> Disapproved
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8">No records found.</td>
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
export default ReservationLogs;