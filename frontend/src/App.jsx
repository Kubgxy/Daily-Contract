import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
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

// Context
import { useNotification } from "./Context/NotificationContext";

function App() {
  const { setUnreadCount } = useNotification(); // ✅ เพิ่ม context ที่นี่

  useEffect(() => {
    const fetchEmployeeInfo = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/auth/employees/me`, {
          withCredentials: true,
        });

        // ✅ หลังได้ employee_id → ส่งผ่าน socket
        socket.emit("register", res.data.employee_id);
        console.log("🔍 Registering:", res.data?.employee_id);
      } catch (err) {
        console.error("⚠️ ดึงข้อมูล employee ล้มเหลว:", err);
      }
    };

    fetchEmployeeInfo();

    const shownMessages = new Set();

    const handleNotify = ({ title, message }) => {
      if (shownMessages.has(message)) return;
      shownMessages.add(message);
      setTimeout(() => shownMessages.delete(message), 10000);

      // ✅ เพิ่ม unreadCount +1 ทุกครั้งที่มีแจ้งเตือนเข้าใหม่
      setUnreadCount((prev) => prev + 1);

      // 🔊 เสียงแจ้งเตือน
      const sound = new Audio("/sounds/notify.mp3");
      sound.play().catch(() => {});

      // 💬 Toast แจ้งเตือน
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: title || "แจ้งเตือน",
        text: message,
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
        customClass: {
          popup: "rounded-xl shadow-lg border border-blue-100 bg-white/80 backdrop-blur-xl",
          title: "text-blue-800 font-semibold",
          icon: "text-blue-600",
        },
      });
    };

    socket.on("notify", handleNotify);
    return () => socket.off("notify", handleNotify);
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
