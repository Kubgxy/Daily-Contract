import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import socket from "./utils/socket";
import { useEffect } from "react";
import Swal from "sweetalert2";
import baseURL from './utils/api';

// Pages
import ChoosePage from "./Page/ChoosePage";
import Login from "./Page/Login";
import Profile from './Page/Profile';
import About from "./Page/About";
import Notifications from "./Page/Notifications";
import CheckinPage from "./Page/CheckinPage";
import RequestReset from "./Page/RequestReset";
import Settings from "./Page/Settings";
import Requests from "./Page/Requests";
import WorkInfo from "./Page/WorkInfo";
import VerifyOtp from "./Page/VerifyOtp";
import ResetPassword from "./Page/ResetPassword";

function App() {
    const [employeeId, setEmployeeId] = useState("");
  
    useEffect(() => {
      const fetchEmployeeInfo = async () => {
        try {
          const res = await axios.get(`${baseURL}/api/auth/employees/me`, { withCredentials: true });
          setEmployeeId(res.data.employee_id);
  
          // ✅ หลังได้ employee_id → ส่งผ่าน socket
          socket.emit("register", res.data.employee_id);
          console.log("🔍 Registering:", res.data?.employee_id);
        } catch (err) {
          console.error("⚠️ ดึงข้อมูล employee ล้มเหลว:", err);
        }
      };
  
      fetchEmployeeInfo();
  
      socket.on("notify", (data) => {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "info",
          title: data.title,
          text: data.message,
          showConfirmButton: false,
          timer: 4000,
        });
      });
  
      return () => {
        socket.off("notify");
      };
    }, []);  

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<ChoosePage />} />
          <Route path="/login" element={<Login onLogin={() => {}} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/checkin" element={<CheckinPage />} />
          <Route path="/reset-request" element={<RequestReset />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/workinfo" element={<WorkInfo />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
