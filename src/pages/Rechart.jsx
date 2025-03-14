import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Rechart = ({ session }) => {
  // Convert session to a percentage (assuming the total sessions are 100)
  const percentage = session ? (session / 100) * 100 : 0;

  return (
    <div style={{ width: 250, height: 250 }}>
      <CircularProgressbar
        value={percentage}
        text={`Session: ${session}`}
        styles={buildStyles({
          textColor: "#000",
          pathColor: "green",
          trailColor: "#d6d6d6",
          textSize: "10px",
        })}
      />
    </div>
  );
};

const ParentComponent = () => {
  const [user, setUser] = useState({
    idno: "",
    firstname: "",
    midname: "",
    lastname: "",
    session: 10,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <div>
      <h2>Student Session Progress</h2>
      <Rechart session={user.session} />
    </div>
  );
};

export default ParentComponent;
