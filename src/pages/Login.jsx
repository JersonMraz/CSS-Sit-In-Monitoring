import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    function loginSubmit(event) {
        event.preventDefault();
        console.log("Sending Data: ", { username, password });

        if(username.trim() !== '' && password.trim() !== '') {
            var url = "http://localhost/Sit-In Monitor Backend/login.php";
            var headers = {
                "Accept": "application/json",
                "Content-type": "application/json"
            };
            var Data = {
                username: username,
                password: password
            };
            fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(Data)
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("📌 Server Response:", data);

                if (!data || !data.resultStatus) {
                    throw new Error("Invalid server response format");
                }

                const resultMessage = data.resultStatus;

                if (resultMessage == "Logged in successfully!") {
                    const role = data.user.role;
                    console.log("User role: ", role);
    
                    localStorage.setItem("user", JSON.stringify(data.user));
                    Swal.fire({
                        title: "Success",
                        text: resultMessage,
                        icon: "success",
                        confirmButtonText: "OK"
                    }).then(() => {
                        navigate(role === "Admin" ? "/Admin-Dashboard" : "/dashboard");
                    });
                } else {
                    // Handle invalid credentials
                    Swal.fire({
                        title: "Error",
                        text: resultMessage,
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            })
            .catch(error => {
                console.error("Fetch Error: ", error);
                Swal.fire({
                    title: "Server Error",
                    text: "Check console for details.",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            });
        } else {
            Swal.fire({
                title: 'Oops...',
                text: 'All fields are required!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }
    return(
        <div className="body">
            <div className="container">
                <div className="header">
                    <img src="../public/Images/CCS Logo.png" alt="" />
                    <h4>Login Form</h4>
                </div>
                <form onSubmit={loginSubmit}>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
                    <button type="submit">Login</button>
                    <p>Don't have an account yet? <a><Link to={"/register"}>Register here.</Link></a></p>
                </form>
            </div>
        </div>
    );
}

export default Login