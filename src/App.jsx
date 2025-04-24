import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/register.jsx";
import { Routes, Route } from "react-router-dom";

import ProfileManagement from "./pages/ProfileManagement.jsx";
import History from "./pages/History.jsx";
import StudentReservation from "./pages/StudentReservation.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import LaboratorySchedule from "./pages/LaboratorySchedule.jsx";
import StudentLeaderboard from "./pages/Leaderboard.jsx";
import LabResources from "./pages/LabResources.jsx";

import AdminDashboard from "./admin-pages/Dashboard.jsx";
import AdminProfileManagement from "./admin-pages/ProfileManagement.jsx";
import AdminAnnouncement from "./admin-pages/Announcement.jsx";
import AdminProfile from "./admin-pages/AdminProfile.jsx";
import CurrentSitIn from "./admin-pages/CurrentSitIn.jsx";
import SitinRecords from "./admin-pages/SitinRecords.jsx";
import FeedbackTable from "./admin-pages/FeedbackTable.jsx";
import Leaderboard from "./admin-pages/Leaderboard.jsx";
import LabSchedule from "./admin-pages/LabSchedule.jsx";
import Resources from "./admin-pages/Resources.jsx";
import ViewResources from "./admin-pages/ViewResources.jsx";

function App() {
  return(
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<ProfileManagement />} />
        <Route path="/history" element={<History />} />
        <Route path="/reservation" element={<StudentReservation />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/schedule" element={<LaboratorySchedule />} />
        <Route path="/leaderboard" element={<StudentLeaderboard />}/>
        <Route path="/lab-resources" element={<LabResources />} />

        <Route path="/Admin-Dashboard" element={<AdminDashboard />} />
        <Route path="/Admin-Settings" element={<AdminProfileManagement />} />
        <Route path="/Admin-Announcement" element={<AdminAnnouncement />} />
        <Route path="/Admin-Profile" element={<AdminProfile />}/>
        <Route path="/Current-Sit-In" element={<CurrentSitIn />}/>
        <Route path="/Sitin-Records" element={<SitinRecords />}/>
        <Route path="/View-Feedback" element={<FeedbackTable />}/>
        <Route path="/Leaderboard-Admin" element={<Leaderboard />}/>
        <Route path="/Lab-Schedule" element={<LabSchedule />} />
        <Route path="/Resources" element={<Resources />}/>
        <Route path="/View-Resources" element={<ViewResources />}/>
      </Routes>
    </>
  );
}

export default App
