import { useState, useEffect } from "react";
import Navbar from "../navbar";
import Sidebar from "../Sidebar";
import "./StudentReservation.scss";
import Swal from 'sweetalert2';

function StudentReservation() {
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    const getCurrentTime = () => {
        const now = new Date();
        return now.toTimeString().slice(0, 5);
    };

    const convertTo12HourFormat = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
        return `${formattedHours}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`;
    };

    const [purpose, setPurpose] = useState("");
    const [room, setRoom] = useState("");
    const [pc_num, setPcNum] = useState("");
    const [timeIn, setTimeIn] = useState(getCurrentTime());
    const [date, setDate] = useState(getCurrentDate());
    const [selectedComponent, setSelectedComponent] = useState("");
    const [selectedPc, setSelectedPc] = useState("");

    const [isChanged, setIsChanged] = useState(false);
    const [students, setStudents] = useState([]);
    const [user, setUser] = useState({
        idno: '',
        firstname: '',
        midname: '',
        lastname: '',
        session: '' || 0,
    });

    useEffect(() => {
        const hasChanges = 
            purpose !== "" || 
            room !== "" || 
            pc_num !== "" ||
            timeIn !== getCurrentTime() || 
            date !== getCurrentDate();

        setIsChanged(hasChanges);
    }, [purpose, room, pc_num, timeIn, date]);

    const handleReserve = () => {
        const reservationData = {
            idno: user.idno,
            name: user.firstname + " " + user.lastname,
            purpose,
            room: room,
            pc_num: pc_num,
            timeIn: convertTo12HourFormat(timeIn), 
            date,
            session: user.session,
        };

        console.log("Reservation Data:", reservationData);

        fetch("http://localhost/Sit-In Monitor Backend/Reservation.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reservationData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    console.log(reservationData);
                    Swal.fire({
                        title: "Success!",
                        text: data.message,
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then(() => {
                        setPurpose("");
                        setRoom("");
                        setPcNum("");
                        setSelectedComponent("");
                        setSelectedPc("");
                        setTimeIn(getCurrentTime());
                        setDate(getCurrentDate());
                        setIsChanged(false);
                    })
                    setPurpose("");
                    setRoom("");
                    setPcNum("");
                    setSelectedComponent("");
                    setSelectedPc("");
                    setTimeIn(getCurrentTime());
                    setDate(getCurrentDate());
                    setIsChanged(false);
                } else {
                    console.log(reservationData);
                    Swal.fire({ 
                        title: "Oops!",
                        text: data.message,
                        icon: "error",
                        confirmButtonText: "OK",
                    }).then(() => {
                        setPurpose("");
                        setRoom("");
                        setPcNum("");
                        setSelectedComponent("");
                        setSelectedPc("");
                        setTimeIn(getCurrentTime());
                        setDate(getCurrentDate());
                        setIsChanged(false);
                    })
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred while making the reservation.");
            });
    };

    const handleCancel = () => {
        setPurpose("");
        setRoom("");
        setTimeIn(getCurrentTime());
        setDate(getCurrentDate());
        setSelectedComponent("");
        setIsChanged(false); 
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    useEffect(() => {
        if (user.idno) {
            console.log("Fetching user data for IDNO:", user.idno);
            fetch(`http://localhost/Sit-In Monitor Backend/getUser.php?idno=${user.idno}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === "success") {
                        setStudents(data.student);
                        console.log("User data: ", data.student);
                    } else {
                        console.error("Failed to fetch user data:", data.message);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                });
        }
    }, [user.idno]);

    useEffect(() => {
        setSelectedPc("");
    }, [selectedComponent]);

    return (
        <div>
            <Sidebar />
            <Navbar />
            <div className="ReservationBody">
                <h1>Reservation</h1>
                <div className="ReservationContent">
                    <div className="ReservationContainer">
                        <div className="idno">
                            <label htmlFor="idno"><i class="fa-solid fa-id-card"></i> ID Number: </label>
                            <input type="text" name="idno" value={students.idno || ""} disabled/>
                        </div>
                        <div className="studname">
                            <label htmlFor="studname"><i class="fa-solid fa-user"></i> Student Name: </label>
                            <input type="text" name="fullname" value={`${user?.firstname || ""} ${user?.midname || ""} ${user?.lastname || ""}`.trim()} disabled/>
                        </div>
                        <div className="purpose">
                            <label htmlFor="purpose"><i class="fa-solid fa-laptop-code"></i> Purpose: </label>
                            <select name="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                                <option value="" disabled>Purpose</option>
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
                        </div>
                        <div className="room">
                            <label htmlFor="room"><i class="fa-solid fa-desktop"></i> Laboratory Room: </label>
                            <select name="room" value={room} onChange={(e) => {setRoom(e.target.value); setSelectedComponent(e.target.value);}}>
                                <option value="" disabled>Laboratory Room</option>
                                <option value="Lab 524">Lab 524</option>
                                <option value="Lab 526">Lab 526</option>
                                <option value="Lab 528">Lab 528</option>
                                <option value="Lab 530">Lab 530</option>
                                <option value="Lab 542">Lab 542</option>
                                <option value="Lab 544">Lab 544</option>
                                <option value="Lab 517">Lab 517</option>
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
                            <input type="text" name="session" value={user?.session || 0} disabled/>
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
                    
                    {selectedComponent === "Lab 524" && <Lab524 handlePcNum={setPcNum} selectedPc={selectedPc} setSelectedPc={setSelectedPc}/>}
                    {selectedComponent === "Lab 526" && <Lab526 handlePcNum={setPcNum} selectedPc={selectedPc} setSelectedPc={setSelectedPc}/>}
                    {selectedComponent === "Lab 528" && <Lab528 handlePcNum={setPcNum} selectedPc={selectedPc} setSelectedPc={setSelectedPc}/>}
                    {selectedComponent === "Lab 542" && <Lab542 handlePcNum={setPcNum} selectedPc={selectedPc} setSelectedPc={setSelectedPc}/>}
                    {selectedComponent === "Lab 544" && <Lab544 handlePcNum={setPcNum} selectedPc={selectedPc} setSelectedPc={setSelectedPc}/>}
                    {selectedComponent === "Lab 530" && <Lab530 handlePcNum={setPcNum} selectedPc={selectedPc} setSelectedPc={setSelectedPc}/>}
                    {selectedComponent === "Lab 517" && <Lab517 handlePcNum={setPcNum} selectedPc={selectedPc} setSelectedPc={setSelectedPc}/>}
                </div>
            </div>
        </div>
    );
}

function Lab524({ handlePcNum, selectedPc = "", setSelectedPc = "" }) {
    const [pcs, setPcs] = useState([]);

    useEffect(() => {
        fetch("http://localhost/Sit-In Monitor Backend/getPCs.php?lab_room=Lab 524")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setPcs(data.pcs);
                } else {
                    console.error("Failed to fetch PCs:", data.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching PCs:", error);
            });
    }, []);
    return(
        <div className="pcs-container">
            <p className="pc-asd">Available PCs for Lab 524</p>
            <div className="pc-list">
                {pcs.map((pc) => (
                    <div
                        key={pc.pc_num}
                        className={`pc-item-${pc.pc_status.toLowerCase()}`}
                        onClick={() => {
                            if (pc.pc_status === "available") {
                                handlePcNum(pc.pc_num);
                                setSelectedPc(pc.pc_num);
                            }
                        }}
                        style={{
                                backgroundColor: selectedPc === pc.pc_num ? "#2196F3" : pc.pc_status === "available" ? "#b5ffb8" : "",
                                cursor: pc.pc_status === "available" ? "pointer" : "not-allowed",
                                color: selectedPc === pc.pc_num ? "#fff" : pc.pc_status === "available" ? "" : "",
                                border: selectedPc === pc.pc_num ? "1px solid #2196F3" : pc.pc_status === "available" ? "" : "",
                        }}
                    >
                        <p className="pc_num">{pc.pc_num}</p>
                        <i class="fa-solid fa-desktop"></i>
                        <p className="pc_status">{pc.pc_status}</p>
                    </div>
                ))}
            </div>
            <input type="hidden" name="pc_num" id="pc_num" onChange={(e) => setPcNum(e.target.value)} />
        </div>
    )
}

function Lab526({ handlePcNum, selectedPc = "", setSelectedPc = "" }) {
    const [pcs, setPcs] = useState([]);

    useEffect(() => {
        fetch("http://localhost/Sit-In Monitor Backend/getPCs.php?lab_room=Lab 526")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setPcs(data.pcs);
                } else {
                    console.error("Failed to fetch PCs:", data.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching PCs:", error);
            });
    }, []);
    return(
    <div className="pcs-container">
        <p className="pc-asd">Available PCs for Lab 526</p>
        <div className="pc-list">
            {pcs.map((pc) => (
                <div
                    key={pc.pc_num}
                    className={`pc-item-${pc.pc_status.toLowerCase()}`}
                    onClick={() => {
                        if (pc.pc_status === "available") {
                            handlePcNum(pc.pc_num);
                            setSelectedPc(pc.pc_num);
                        }
                    }}
                    style={{
                        backgroundColor: selectedPc === pc.pc_num ? "#2196F3" : pc.pc_status === "available" ? "#b5ffb8" : "",
                        cursor: pc.pc_status === "available" ? "pointer" : "not-allowed",
                        color: selectedPc === pc.pc_num ? "#fff" : pc.pc_status === "available" ? "" : "",
                        border: selectedPc === pc.pc_num ? "1px solid #2196F3" : pc.pc_status === "available" ? "" : "",
                    }}
                >
                    <p className="pc_num">{pc.pc_num}</p>
                    <i class="fa-solid fa-desktop"></i>
                    <p className="pc_status">{pc.pc_status}</p>
                </div>
            ))}
        </div>
        <input type="hidden" name="pc_num" id="pc_num" onChange={(e) => setPcNum(e.target.value)} />
    </div>
    )
}

function Lab528({ handlePcNum, selectedPc = "", setSelectedPc = "" }) {
    const [pcs, setPcs] = useState([]);

    useEffect(() => {
        fetch("http://localhost/Sit-In Monitor Backend/getPCs.php?lab_room=Lab 528")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setPcs(data.pcs);
                } else {
                    console.error("Failed to fetch PCs:", data.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching PCs:", error);
            });
    }, []);
    return(
        <div className="pcs-container">
            <p className="pc-asd">Available PCs for Lab 528</p>
            <div className="pc-list">
                {pcs.map((pc) => (
                    <div
                        key={pc.pc_num}
                        className={`pc-item-${pc.pc_status.toLowerCase()}`}
                        onClick={() => {
                            if (pc.pc_status === "available") {
                                handlePcNum(pc.pc_num);
                                setSelectedPc(pc.pc_num);
                            }
                        }}
                        style={{
                            backgroundColor: selectedPc === pc.pc_num ? "#2196F3" : pc.pc_status === "available" ? "#b5ffb8" : "",
                            cursor: pc.pc_status === "available" ? "pointer" : "not-allowed",
                            color: selectedPc === pc.pc_num ? "#fff" : pc.pc_status === "available" ? "" : "",
                            border: selectedPc === pc.pc_num ? "1px solid #2196F3" : pc.pc_status === "available" ? "" : "",
                        }}
                    >
                    <p className="pc_num">{pc.pc_num}</p>
                    <i class="fa-solid fa-desktop"></i>
                    <p className="pc_status">{pc.pc_status}</p>
                </div>
            ))}
            </div>
            <input type="hidden" name="pc_num" id="pc_num" onChange={(e) => setPcNum(e.target.value)} />
        </div>
    )
}

function Lab542({ handlePcNum, selectedPc = "", setSelectedPc = "" }) {
    const [pcs, setPcs] = useState([]);

    useEffect(() => {
        fetch("http://localhost/Sit-In Monitor Backend/getPCs.php?lab_room=Lab 542")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setPcs(data.pcs);
                } else {
                    console.error("Failed to fetch PCs:", data.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching PCs:", error);
            });
    }, []);
    return(
        <div className="pcs-container">
            <p className="pc-asd">Available PCs for Lab 528</p>
            <div className="pc-list">
                {pcs.map((pc) => (
                    <div
                        key={pc.pc_num}
                        className={`pc-item-${pc.pc_status.toLowerCase()}`}
                        onClick={() => {
                            if (pc.pc_status === "available") {
                                handlePcNum(pc.pc_num);
                                setSelectedPc(pc.pc_num);
                            }
                        }}
                        style={{
                            backgroundColor: selectedPc === pc.pc_num ? "#2196F3" : pc.pc_status === "available" ? "#b5ffb8" : "",
                            cursor: pc.pc_status === "available" ? "pointer" : "not-allowed",
                            color: selectedPc === pc.pc_num ? "#fff" : pc.pc_status === "available" ? "" : "",
                            border: selectedPc === pc.pc_num ? "1px solid #2196F3" : pc.pc_status === "available" ? "" : "",
                        }}
                    >
                    <p className="pc_num">{pc.pc_num}</p>
                    <i class="fa-solid fa-desktop"></i>
                    <p className="pc_status">{pc.pc_status}</p>
                </div>
            ))}
            </div>
            <input type="hidden" name="pc_num" id="pc_num" onChange={(e) => setPcNum(e.target.value)} />
        </div>
    )
}

function Lab544({ handlePcNum, selectedPc = "", setSelectedPc = "" }) {
    const [pcs, setPcs] = useState([]);

    useEffect(() => {
        fetch("http://localhost/Sit-In Monitor Backend/getPCs.php?lab_room=Lab 544")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setPcs(data.pcs);
                } else {
                    console.error("Failed to fetch PCs:", data.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching PCs:", error);
            });
    }, []);
    return(
        <div className="pcs-container">
            <p className="pc-asd">Available PCs for Lab 528</p>
            <div className="pc-list">
                {pcs.map((pc) => (
                    <div
                        key={pc.pc_num}
                        className={`pc-item-${pc.pc_status.toLowerCase()}`}
                        onClick={() => {
                            if (pc.pc_status === "available") {
                                handlePcNum(pc.pc_num);
                                setSelectedPc(pc.pc_num);
                            }
                        }}
                        style={{
                            backgroundColor: selectedPc === pc.pc_num ? "#2196F3" : pc.pc_status === "available" ? "#b5ffb8" : "",
                            cursor: pc.pc_status === "available" ? "pointer" : "not-allowed",
                            color: selectedPc === pc.pc_num ? "#fff" : pc.pc_status === "available" ? "" : "",
                            border: selectedPc === pc.pc_num ? "1px solid #2196F3" : pc.pc_status === "available" ? "" : "",
                        }}
                    >
                    <p className="pc_num">{pc.pc_num}</p>
                    <i class="fa-solid fa-desktop"></i>
                    <p className="pc_status">{pc.pc_status}</p>
                </div>
            ))}
            </div>
            <input type="hidden" name="pc_num" id="pc_num" onChange={(e) => setPcNum(e.target.value)} />
        </div>
    )
}

function Lab530({ handlePcNum, selectedPc = "", setSelectedPc = "" }) {
    const [pcs, setPcs] = useState([]);

    useEffect(() => {
        fetch("http://localhost/Sit-In Monitor Backend/getPCs.php?lab_room=Lab 530")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setPcs(data.pcs);
                } else {
                    console.error("Failed to fetch PCs:", data.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching PCs:", error);
            });
    }, []);
    return(
        <div className="pcs-container">
            <p className="pc-asd">Available PCs for Lab 528</p>
            <div className="pc-list">
                {pcs.map((pc) => (
                    <div
                        key={pc.pc_num}
                        className={`pc-item-${pc.pc_status.toLowerCase()}`}
                        onClick={() => {
                            if (pc.pc_status === "available") {
                                handlePcNum(pc.pc_num);
                                setSelectedPc(pc.pc_num);
                            }
                        }}
                        style={{
                            backgroundColor: selectedPc === pc.pc_num ? "#2196F3" : pc.pc_status === "available" ? "#b5ffb8" : "",
                            cursor: pc.pc_status === "available" ? "pointer" : "not-allowed",
                            color: selectedPc === pc.pc_num ? "#fff" : pc.pc_status === "available" ? "" : "",
                            border: selectedPc === pc.pc_num ? "1px solid #2196F3" : pc.pc_status === "available" ? "" : "",
                        }}
                    >
                    <p className="pc_num">{pc.pc_num}</p>
                    <i class="fa-solid fa-desktop"></i>
                    <p className="pc_status">{pc.pc_status}</p>
                </div>
            ))}
            </div>
            <input type="hidden" name="pc_num" id="pc_num" onChange={(e) => setPcNum(e.target.value)} />
        </div>
    )
}

function Lab517({ handlePcNum, selectedPc = "", setSelectedPc = "" }) {
    const [pcs, setPcs] = useState([]);

    useEffect(() => {
        fetch("http://localhost/Sit-In Monitor Backend/getPCs.php?lab_room=Lab 517")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setPcs(data.pcs);
                } else {
                    console.error("Failed to fetch PCs:", data.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching PCs:", error);
            });
    }, []);
    return(
        <div className="pcs-container">
            <p className="pc-asd">Available PCs for Lab 528</p>
            <div className="pc-list">
                {pcs.map((pc) => (
                    <div
                        key={pc.pc_num}
                        className={`pc-item-${pc.pc_status.toLowerCase()}`}
                        onClick={() => {
                            if (pc.pc_status === "available") {
                                handlePcNum(pc.pc_num);
                                setSelectedPc(pc.pc_num);
                            }
                        }}
                        style={{
                            backgroundColor: selectedPc === pc.pc_num ? "#2196F3" : pc.pc_status === "available" ? "#b5ffb8" : "",
                            cursor: pc.pc_status === "available" ? "pointer" : "not-allowed",
                            color: selectedPc === pc.pc_num ? "#fff" : pc.pc_status === "available" ? "" : "",
                            border: selectedPc === pc.pc_num ? "1px solid #2196F3" : pc.pc_status === "available" ? "" : "",
                        }}
                    >
                    <p className="pc_num">{pc.pc_num}</p>
                    <i class="fa-solid fa-desktop"></i>
                    <p className="pc_status">{pc.pc_status}</p>
                </div>
            ))}
            </div>
            <input type="hidden" name="pc_num" id="pc_num" onChange={(e) => setPcNum(e.target.value)} />
        </div>
    )
}

export default StudentReservation;