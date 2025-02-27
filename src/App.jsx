import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/register.jsx";
import { Routes, Route } from "react-router-dom";
import StudentProfile from "./pages/StudentProfile.jsx";

function App() {
  return(
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<StudentProfile />} />
      </Routes>
    </>
  );
}

export default App
