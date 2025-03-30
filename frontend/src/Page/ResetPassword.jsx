import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import baseURL from '../utils/api';

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const email = sessionStorage.getItem("resetEmail");

  useEffect(() => {
    if (!email) {
      Swal.fire("ไม่พบข้อมูลผู้ใช้", "กรุณายืนยัน OTP ก่อน", "error");
      navigate("/reset-request");
    }
  }, []);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirm) {
      return Swal.fire("กรุณากรอกรหัสผ่านให้ครบ", "", "warning");
    }

    if (password !== confirm) {
      return Swal.fire("รหัสผ่านไม่ตรงกัน", "โปรดลองใหม่อีกครั้ง", "error");
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${baseURL}/api/auth/reset-password`,
        { email, newPassword: password, confirmPassword: confirm },
        { withCredentials: true }
      );

      if (res.data.status === "success") {
        await Swal.fire("สำเร็จ", "เปลี่ยนรหัสผ่านเรียบร้อย", "success");
        sessionStorage.clear();
        navigate("/login");
      } else {
        Swal.fire("ล้มเหลว", res.data.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้", "error");
      }
    } catch (error) {
      Swal.fire("ผิดพลาด", error.response?.data?.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้", "error");
    } finally {
      setLoading(false);
    }
  };  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-200 to-blue-500 p-4">
     
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          ตั้งรหัสผ่านใหม่
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="รหัสผ่านใหม่"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="ยืนยันรหัสผ่านใหม่"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-500 hover:bg-purple-600 text-white"
            }`}
          >
            {loading ? "กำลังเปลี่ยนรหัสผ่าน..." : "รีเซ็ตรหัสผ่าน"}
          </button>
        </form>
        
      </div>
    </div>
  );
}

export default ResetPassword;