import { useContext, useState, useEffect } from "react"
import socket from "./utils/socket"; // ✅ เพิ่มตรงนี้
import Swal from "sweetalert2"; // ✅ เพิ่มสำหรับแจ้งเตือน
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom"
import axios from "axios"
import Sidebar from "./Components/Sidebar"
import Header from "./Components/Header"
import Dashboard from "./Pages/Dashboard"
import Employees from "./Pages/Employees"
import Notifications from "./Pages/Notifications"
import Requests from "./Pages/Requests"
import LeaveRequests from "./Pages/leaveRequests"
import WorkReports from "./Pages/WorkReports"
import Profile from "./Pages/Profile"
import OverTime from "./Pages/Overtime"
import CheckinCheckoutHistory from "./Pages/CheckinCheckoutHistory"
import Register from "./Pages/Register"
import Payroll from "./Pages/Payroll"
import WorkInfo from "./Pages/Workinfo"
import Login from "./Components/Login"
import WorkRecordForm from "./Pages/WorkRecord"
import RenewalRequests from "./Pages/RenewalRequests";
import Configs from "./Pages/Configs";
import { ThemeContext, ThemeProvider } from "./Context/ThemeContext"

const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/employees/me", {
          credentials: "include",
        })
  
        const data = await res.json()
        console.log("🛡 ProtectedRoute res.data:", data)
  
        if (res.ok && data.role === "Admin") {
          setIsAuthorized(true)
        } else {
          setIsAuthorized(false)
        }
      } catch (err) {
        console.error("🛑 Auth Check Error:", err)
        setIsAuthorized(false)
      }
    }
  
    checkAuth()
  }, [])  

  if (isAuthorized === null) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-dark-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return isAuthorized ? children : <Navigate to="/login" replace />
}

function App() {
  const { isDarkMode } = useContext(ThemeContext)
  const location = useLocation()
  const isLoginPage = location.pathname === "/login"

  const [employeeId, setEmployeeId] = useState("")

  // ✅ เชื่อม socket และรับ notify
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/employees/me", {
          withCredentials: true,
        });
        setEmployeeId(res.data.employee_id);

        // ✅ ส่ง employee_id ไป register บน socket
        socket.emit("register", res.data.employee_id);
        console.log("📡 Dashboard registered socket:", res.data.employee_id);
      } catch (err) {
        console.error("❌ ดึง /me ล้มเหลว", err);
      }
    };

    fetchMe();

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
  
    // ✅ Event ใหม่: contract_renewal_pending
    socket.on("contract_renewal_pending", (data) => {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: "🔔 มีพนักงานรอการต่อสัญญา",
        text: `${data.employee.name} (${data.employee.employee_id}) ใกล้หมดสัญญา`,
        showConfirmButton: false,
        timer: 5000,
      });
    });
  
    return () => {
      socket.off("notify");
      socket.off("contract_renewal_pending");
    };
  }, []);
  
  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      <div className="flex min-h-screen bg-gray-50 dark:bg-dark-900">
        {!isLoginPage && <Sidebar />}
        <div className={`flex-1 flex flex-col ${!isLoginPage ? "lg:ml-64" : ""}`}>
          {!isLoginPage && <Header />}
          <main className="flex-1">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employees"
                element={
                  <ProtectedRoute>
                    <Employees />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workrecord"
                element={
                  <ProtectedRoute>
                    <WorkRecordForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/renewal-requests"
                element={
                  <ProtectedRoute>
                    <RenewalRequests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/requests"
                element={
                  <ProtectedRoute>
                    <Requests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leave-requests"
                element={
                  <ProtectedRoute>
                    <LeaveRequests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/overtime"
                element={
                  <ProtectedRoute>
                    <OverTime />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/work-reports"
                element={
                  <ProtectedRoute>
                    <WorkReports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/work-info"
                element={
                  <ProtectedRoute>
                    <WorkInfo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkin-history"
                element={
                  <ProtectedRoute>
                    <CheckinCheckoutHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <ProtectedRoute>
                    <Register />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payroll"
                element={
                  <ProtectedRoute>
                    <Payroll />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/configs"
                element={
                  <ProtectedRoute>
                    <Configs />
                  </ProtectedRoute>
                }
              />
            </Routes>
            
          </main>
        </div>
      </div>
    </div>
  )
}

export default function WrappedApp() {
  return (
    <Router>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Router>
  )
}
