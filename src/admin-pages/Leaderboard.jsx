import "./Leaderboard.scss";
import Sidebar from "../Admin-Sidebar.jsx";
import Navbar from "../Admin-Navbar.jsx";
import { useState, useEffect } from "react";

function SitinRecords() {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        // Fetch student data from the backend
        fetch("http://localhost/Sit-In Monitor Backend/getLeaderboard.php")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    const sortedStudents = data.students.sort((a, b) => b.points - a.points);
                    setStudents(sortedStudents);
                } else {
                    console.error("Failed to fetch leaderboard data:", data.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching leaderboard data:", error);
            });
    }, []);
    
    return(
        <div>
            <Sidebar />
            <Navbar />
            <div className="leaderboard-wrapper">
                <h1>Leaderboard</h1>
                <div className="top-3-leaderboard">
                {students.length >= 3 && (
                    <>
                        {/* Top 2 */}
                        <div className="top-2">
                            <div className="info">
                                <img
                                    src={students[1].profile_url ? `http://localhost/Sit-In Monitor Backend/uploads/${students[1].profile_url}` : "/public/Images/default.png"}
                                    alt="Student Profile"
                                    className="profile"
                                />
                                <span className="circol2">2</span>
                                <div className="name">
                                    <h6>{students[1].fullname}</h6>
                                    <p>@{students[1].username}</p>
                                </div>
                                <img src="/public/Images/silver.jpg" alt="Medal PNG" className="medalIcon" />
                            </div>
                            <div className="top-1-statistics">
                                <div className="student-points">
                                    <p className="dako">Points</p>
                                    <p className="gamay">{students[1].Points}</p>
                                </div>
                                <div className="session">
                                    <p className="dako">Session</p>
                                    <p className="gamay">{students[1].remaining_session}</p>
                                </div>
                                <div className="totalSitin">
                                    <p className="dako">Total Sit-in</p>
                                    <p className="gamay">{students[1].total_sitins || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Top 1 */}
                        <div className="top-1">
                            <div className="info">
                                <img
                                    src={students[0].profile_url ? `http://localhost/Sit-In Monitor Backend/uploads/${students[0].profile_url}` : "/public/Images/default.png"}
                                    alt="Student Profile"
                                    className="profile"
                                />
                                <span className="circol">1</span>
                                <div className="name">
                                    <h6>{students[0].fullname}</h6>
                                    <p>@{students[0].username}</p>
                                </div>
                                <img src="/public/Images/medal.png" alt="Medal PNG" className="medalIcon" />
                            </div>
                            <div className="top-1-statistics">
                                <div className="student-points">
                                    <p className="dako">Points</p>
                                    <p className="gamay">{students[0].Points}</p>
                                </div>
                                <div className="session">
                                    <p className="dako">Session</p>
                                    <p className="gamay">{students[0].remaining_session}</p>
                                </div>
                                <div className="totalSitin">
                                    <p className="dako">Total Sit-in</p>
                                    <p className="gamay">{students[0].total_sitins || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Top 3 */}
                        <div className="top-3">
                            <div className="info">
                                <img
                                    src={students[2].profile_url ? `http://localhost/Sit-In Monitor Backend/uploads/${students[2].profile_url}` : "/public/Images/default.png"}
                                    alt="Student Profile"
                                    className="profile"
                                />
                                <span className="circol2">3</span>
                                <div className="name">
                                    <h6>{students[2].fullname}</h6>
                                    <p>@{students[2].username}</p>
                                </div>
                                <img src="/public/Images/bronze.jpg" alt="Medal PNG" className="medalIcon" />
                            </div>
                            <div className="top-1-statistics">
                                <div className="student-points">
                                    <p className="dako">Points</p>
                                    <p className="gamay">{students[2].Points}</p>
                                </div>
                                <div className="session">
                                    <p className="dako">Session</p>
                                    <p className="gamay">{students[2].remaining_session}</p>
                                </div>
                                <div className="totalSitin">
                                    <p className="dako">Total Sit-in</p>
                                    <p className="gamay">{students[2].total_sitins || 0}</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                </div>
                <div className="leaderboard-table">
                    <table>
                        <thead>
                            <tr>
                                <th style={{width: '100px', textAlign: 'center'}}>Rank</th>
                                <th style={{width: '250px', textAlign: 'left'}}>User name</th>
                                <th style={{width: '370px'}}>Course</th>
                                <th style={{width: '150px', textAlign: 'center'}}>Year Level</th>
                                <th style={{width: '155px', textAlign: 'center'}}>Remaining Session</th>
                                <th style={{width: '90px', textAlign: 'center'}}>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={student.idno}>
                                    <td className="rank">
                                        <span className="rank-sirkol">{index + 1}</span>
                                    </td>
                                    <td className="row">
                                        <img
                                            src={student.profile_url ? `http://localhost/Sit-In Monitor Backend/uploads/${student.profile_url}` : "/public/Images/default.png"}
                                            alt=""
                                            className="profilepic"
                                        />
                                        <div className="username">
                                            <p className="name">{student.fullname}</p>
                                            <p className="idno">ID {student.idno}</p>
                                        </div>
                                    </td>
                                    <td style={{ fontFamily: "Poppins-Regular" }}>{student.course}</td>
                                    <td style={{ fontFamily: "Poppins-Regular", textAlign: "center" }}>
                                        {student.yearlvl}
                                    </td>
                                    <td style={{ textAlign: "center", fontFamily: "Poppins-Regular" }}>
                                        {student.remaining_session}
                                    </td>
                                    <td style={{ textAlign: "center", fontFamily: "Poppins-Regular" }}>
                                        {student.Points}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
export default SitinRecords;