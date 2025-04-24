import "./LabSchedule.scss";
import Sidebar from "../Admin-Sidebar.jsx";
import Navbar from "../Admin-Navbar.jsx";
import { useState } from "react";

function LabSchedule() {
    const [selectedDay, setSelectedDay] = useState("Monday/Wednesday");

    const renderTable = () => {
        switch (selectedDay) {
            case "Monday/Wednesday":
                return <MondayAndWednesday />;
            case "Tuesday/Thursday":
                return <TuesdayAndThursday />;
            case "Friday":
                return <Friday />;
            case "Saturday":
                return <Saturday />;
            default:
                return null;
        }
    };

    return (
        <div>
            <Sidebar />
            <Navbar />
            <div className="lab-schedule-wrapper">
                <h1>Lab Schedule</h1>
                <div className="lab-schedule-content">
                    <div className="navigation">
                        <ul>
                            <li className={selectedDay === "Monday/Wednesday" ? "active" : ""} onClick={() => setSelectedDay("Monday/Wednesday")}>
                                <a>
                                    Monday/Wednesday
                                </a>
                            </li>
                            <li className={selectedDay === "Tuesday/Thursday" ? "active" : ""} onClick={() => setSelectedDay("Tuesday/Thursday")}>
                                <a>
                                    Tuesday/Thursday
                                </a>
                            </li>
                            <li className={selectedDay === "Friday" ? "active" : ""} onClick={() => setSelectedDay("Friday")}>
                                <a>
                                    Friday
                                </a>
                            </li>
                            <li className={selectedDay === "Saturday" ? "active" : ""} onClick={() => setSelectedDay("Saturday")}>
                                <a>
                                    Saturday
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="table-schedule-container">
                        <h2>{selectedDay}</h2>
                        {renderTable()}
                    </div>
                </div>
            </div>
        </div>
    );
}

function MondayAndWednesday() {
    return (
        <table>
            <thead>
                <tr>
                    <th className="slot">Time Slot</th>
                    <th className="lab">Lab 517</th>
                    <th className="lab">Lab 524</th>
                    <th className="lab">Lab 526</th>
                    <th className="lab">Lab 528</th>
                    <th className="lab">Lab 530</th>
                    <th className="lab">Lab 542</th>
                    <th className="lab">Lab 544</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>07:30 AM - 09:00 AM</td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                </tr>
                <tr>
                    <td>09:00 AM - 10:30 AM</td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                </tr>
                <tr>
                    <td>10:30 AM - 12:00 PM</td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                </tr>
                <tr>
                    <td>12:00 PM - 01:30 PM</td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                </tr>
                <tr>
                    <td>01:30 PM - 03:00 PM</td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                </tr>
                <tr>
                    <td>03:00 PM - 04:30 PM</td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                </tr>
            </tbody>
        </table>
    );
}

function TuesdayAndThursday() {
    return (
        <table>
            <thead>
                <tr>
                    <th className="slot">Time Slot</th>
                    <th className="lab">Lab 517</th>
                    <th className="lab">Lab 524</th>
                    <th className="lab">Lab 526</th>
                    <th className="lab">Lab 528</th>
                    <th className="lab">Lab 530</th>
                    <th className="lab">Lab 542</th>
                    <th className="lab">Lab 544</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>07:30 AM - 09:00 AM</td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                </tr>
                <tr>
                    <td>09:00 AM - 10:30 AM</td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                </tr>
                <tr>
                    <td>10:30 AM - 12:00 PM</td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                </tr>
                <tr>
                    <td>12:00 PM - 01:30 PM</td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                </tr>
                <tr>
                    <td>01:30 PM - 03:00 PM</td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                </tr>
                <tr>
                    <td>03:00 PM - 04:30 PM</td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                </tr>
            </tbody>
        </table>
    );
}

function Friday() {
    return (
        <table>
            <thead>
                <tr>
                    <th className="slot">Time Slot</th>
                    <th className="lab">Lab 517</th>
                    <th className="lab">Lab 524</th>
                    <th className="lab">Lab 526</th>
                    <th className="lab">Lab 528</th>
                    <th className="lab">Lab 530</th>
                    <th className="lab">Lab 542</th>
                    <th className="lab">Lab 544</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>07:30 AM - 09:00 AM</td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                </tr>
                <tr>
                    <td>09:00 AM - 10:30 AM</td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                </tr>
                <tr>
                    <td>10:30 AM - 12:00 PM</td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                </tr>
                <tr>
                    <td>12:00 PM - 01:30 PM</td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                </tr>
               <tr>
                    <td>01:30 PM - 03:00 PM</td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                </tr> 
                <tr>
                    <td>03:00 PM - 04:30 PM</td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                </tr>
            </tbody>
        </table>
    );
}

function Saturday() {
    return (
        <table>
            <thead>
                <tr>
                    <th className="slot">Time Slot</th>
                    <th className="lab">Lab 517</th>
                    <th className="lab">Lab 524</th>
                    <th className="lab">Lab 526</th>
                    <th className="lab">Lab 528</th>
                    <th className="lab">Lab 530</th>
                    <th className="lab">Lab 542</th>
                    <th className="lab">Lab 544</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>07:30 AM - 09:00 AM</td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                </tr>
                <tr>
                    <td>09:00 AM - 10:30 AM</td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                </tr>
                <tr>
                    <td>10:30 AM - 12:00 PM</td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="occupied"><i class="fa-regular fa-circle-xmark"></i> Occupied</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                    <td><span className="available"><i class="fa-regular fa-circle-check"></i> Available</span></td>
                </tr>
            </tbody>
        </table>
    );
}

export default LabSchedule;