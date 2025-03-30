import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import { 
  User2, 
  KeyRound, 
  LogIn, 
  AlertCircle,
  EyeIcon,
  EyeOffIcon,
  Loader2
} from "lucide-react";
import baseURL from '../utils/api';

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    try {
      const response = await axios.post(
        `${baseURL}/api/auth/login`,
        { username, password },
        { withCredentials: true } // ✅ สำคัญ! เพื่อรับ cookie
      );

      console.log("Sending", username, password);
  
      if (response.status === 200) {
        const { user } = response.data;
  
        if (user.role !== "Employee" && user.role !== "Manager" && user.role !== "Admin") {
          setError("เฉพาะผู้ใช้งานพนักงานหรือผู้ดูแลเท่านั้นที่สามารถเข้าสู่ระบบนี้ได้");
          return;
        }
  
        onLogin();
        navigate("/profile");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      } else {
        setError("เกิดข้อผิดพลาดในระบบ");
      }
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-200 flex items-center justify-center p-4">
      <div className="w-[800px]">
        {/* Card Header - Logo */}
        <div className="bg-white/80 backdrop-blur-lg rounded-t-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User2 size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">ยินดีต้อนรับ</h2>
          <p className="text-gray-500 mt-2">เข้าสู่ระบบสำหรับพนักงาน</p>
        </div>

        {/* Card Body - Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-b-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User2 className="w-4 h-4" />
                ชื่อผู้ใช้
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError("");
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder-gray-400 transition-all duration-300"
                  placeholder="กรุณากรอกชื่อผู้ใช้"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder-gray-400 transition-all duration-300 pr-12"
                  placeholder="กรุณากรอกรหัสผ่าน"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                           hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-xl
                       hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:ring-offset-2 transition-all duration-300 flex items-center 
                       justify-center space-x-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>กำลังเข้าสู่ระบบ...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>เข้าสู่ระบบ</span>
                </>
              )}
            </button>
            <div className="text-center text-sm text-gray-500">
            <Link
              to="/"
              className="text-blue-400 hover:underline hover:text-blue-600"
            >
              กลับไปยังหน้าเลือกการเข้าสู่ระบบ
            </Link>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;