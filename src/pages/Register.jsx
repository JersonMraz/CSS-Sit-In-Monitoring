import "./register.scss";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        idno: "",
        firstname: "",
        midname: "",
        lastname: "",
        course: "",
        yearlvl: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                title: 'Password do not match!',
                text: 'Please re-enter your passwords.',
                icon: 'warning',
                confirmButtonText: 'Ok'
            });
            setFormData((prevData) => ({
                ...prevData,
                password: "",
                confirmPassword: "",
            }));

            return;
        }

        try {
            var url = "http://localhost/Sit-In Monitor Backend/register.php";
            var headers = {
                "Accept": "application/json",
                "Content-type": "application/json"
            };

            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log("Response:", data);

            if (data.success) {
                setFormData({
                    idno: "",
                    firstname: "",
                    midname: "",
                    lastname: "",
                    course: "",
                    yearlvl: "",
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                });
                navigate("/");
                Swal.fire({
                    icon: "success",
                    title: "Registration Successful!",
                    text: "You have successfully registered.",
                    confirmButtonText: 'Ok, Thank you'
                });

            } else {
                if (data.message?.includes("already exists") || data.message?.includes("already taken")) {
                    Swal.fire({
                        icon: "error",
                        title: "Registration Failed",
                        text: data.message,
                    });

                    const fieldsToClear = {};
                    if (data.message?.includes("IDNO")) fieldsToClear.idno = "";
                    if (data.message?.includes("Email")) fieldsToClear.email = "";
                    if (data.message?.includes("Username")) fieldsToClear.username = "";

                    setFormData((prevData) => ({
                        ...prevData,
                        ...fieldsToClear,
                    }));
                }
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong. Please try again later.",
            });
        }
    };

    return(
        <div className="body">
            <div className="registercontainer">
                <div className="header">
                    <img src="./public/Images/CCS Logo.png" alt="Logo"/>
                    <h3>Registration Form</h3>
                </div>
                <form className="formRegisterContainer" onSubmit={handleSubmit}>
                    <div className="personalInformation">
                        <p>Personal Information</p>
                        <div className="inputContainer">
                            <div className="inputControl1">
                                <input type="text" name="idno" value={formData.idno} onChange={handleChange} placeholder="IDNO"/>
                                <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} placeholder="Firstname" />
                            </div>
                            <div className="inputControl2">
                                <input type="text" name="midname" value={formData.midname} onChange={handleChange} placeholder="Middlename"/>
                                <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} placeholder="Lastname"/>
                            </div>
                        </div>
                    </div>
                    <div className="courseandyear">
                        <p>Course & Year Level</p>
                        <div className="selectContainer">
                            <select name="course" value={formData.course} onChange={handleChange}>
                                <option value="" disabled defaultValue={"Course"}>Course</option>
                                <option value="Bachelor of Science in Information Technology">Bachelor of Science in Information Technology</option>
                                <option value="Bachelor of Science in Computer Science">Bachelor of Science in Computer Science</option>
                                <option value="Bachelor of Science in Information System">Bachelor of Science in Information System</option>
                                <option value="Bachelor of Science in Accountancy">Bachelor of Science in Accountancy</option>
                                <option value="Bachelor of Science in Custom Administration">Bachelor of Science in Custom Administration</option>
                            </select>
                            <select name="yearlvl" value={formData.yearlvl} onChange={handleChange}>
                                <option value="" disabled defaultValue={"School Year"}>School Year</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>
                    </div>
                    <div className="accountInformation">
                        <p>Account Information</p>
                        <div className="inputControl">
                            <div className="inputContainer">
                                <div className="inputControl1">
                                    <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username"/>
                                    <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Email address"/>
                                </div>
                                <div className="inputControl2">
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password"/>
                                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit">Register</button>
                    <p>Already have an account yet? <Link to="/">Login here.</Link></p>
                </form>
            </div>
        </div>
    )
}
export default Register