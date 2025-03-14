import { useState, useEffect } from "react";
import Navbar from "../navbar";
import Sidebar from "../Sidebar";
import "./StudentReservation.scss";

function StudentReservation() {
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    const getCurrentTime = () => {
        const now = new Date();
        return now.toTimeString().slice(0, 5);
    };

    const [purpose, setPurpose] = useState("");
    const [room, setRoom] = useState("");
    const [timeIn, setTimeIn] = useState(getCurrentTime());
    const [date, setDate] = useState(getCurrentDate());

    const [isChanged, setIsChanged] = useState(false);

    const [user, setUser] = useState({
        idno: '',
        firstname: '',
        midname: '',
        lastname: '',
        session: '',
    });

    useEffect(() => {
        const hasChanges = 
            purpose !== "" || 
            room !== "" || 
            timeIn !== getCurrentTime() || 
            date !== getCurrentDate();

        setIsChanged(hasChanges);
    }, [purpose, room, timeIn, date]);

    const handleReserve = () => {
        setIsChanged(false); 
    };

    const handleCancel = () => {
        setPurpose("");
        setRoom("");
        setTimeIn(getCurrentTime());
        setDate(getCurrentDate());

        setIsChanged(false); 
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);


    return (
        <div>
            <Sidebar />
            <Navbar />
            <div className="ReservationBody">
                <h1>Reservation</h1>
                <div className="ReservationContent">
                    <div className="idno">
                        <label htmlFor="idno"><i class="fa-solid fa-id-card"></i> ID Number: </label>
                        <input type="text" name="idno" value={user?.idno || ""} disabled/>
                    </div>
                    <div className="studname">
                        <label htmlFor="studname"><i class="fa-solid fa-user"></i> Student Name: </label>
                        <input type="text" name="fullname" value={`${user?.firstname || ""} ${user?.midname || ""} ${user?.lastname || ""}`.trim()} disabled/>
                    </div>
                    <div className="purpose">
                        <label htmlFor="purpose"><i class="fa-solid fa-laptop-code"></i> Purpose: </label>
                        <select name="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                            <option value="" disabled>Purpose</option>
                            <option value="C++">C++</option>
                            <option value="C#">C#</option>
                            <option value="Java">Java</option>
                            <option value="HTML & CSS">HTML & CSS</option>
                            <option value="JavaScript">JavaScript</option>
                            <option value="Python">Python</option>
                        </select>
                    </div>
                    <div className="room">
                        <label htmlFor="room"><i class="fa-solid fa-desktop"></i> Laboratory Room: </label>
                        <select name="room" value={room} onChange={(e) => setRoom(e.target.value)}>
                            <option value="" disabled>Laboratory Room</option>
                            <option value="544">Room 544</option>
                            <option value="542">Room 542</option>
                            <option value="530">Room 530</option>
                        </select>
                    </div>
                    <div className="timeIn">
                        <label htmlFor="timeIn"><i class="fa-solid fa-clock"></i> Time In: </label>
                        <input type="time" name="timeIn" value={timeIn} onChange={(e) => setTimeIn(e.target.value)}/>
                    </div>
                    <div className="date">
                        <label htmlFor="date"><i class="fa-solid fa-calendar-days"></i> Date: </label>
                        <input type="date" name="date" value={date} onChange={(e) => setDate(e.target.value)}/>
                    </div>
                    <div className="sessions">
                        <label htmlFor="session"><i class="fa-solid fa-stopwatch"></i> Remaining Sessions: </label>
                        <input type="text" name="session" value={user?.session || ""} disabled/>
                    </div>
                    <div className="btns">
                        <button className="cancel-btn" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button className="reserve-btn" onClick={handleReserve} disabled={!isChanged} style={{backgroundColor: isChanged ? "#E9BE5F" : "lightgray",cursor: isChanged ? "pointer" : "not-allowed",}}>
                            Reserve
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default StudentReservation;