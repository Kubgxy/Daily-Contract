import { useState } from "react";
import { CircleChevronLeft } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import baseURL from '../utils/api';

function RequestReset() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return Swal.fire("กรอกอีเมล", "กรุณากรอกอีเมลให้ครบถ้วน", "warning");
    }

    try {
      setIsSubmitting(true);
      const res = await axios.post(
        `${baseURL}/api/auth/request-reset`,
        { email },
        { withCredentials: true }
      );

      if (res.data.status === "success") {
        const ref = res.data.ref;
        const expiresAt = res.data.expiresAt;
        sessionStorage.setItem("resetEmail", email);
        sessionStorage.setItem("resetRef", ref);
        sessionStorage.setItem("expiresAt", expiresAt);
        await Swal.fire("ส่ง OTP แล้ว", `รหัสอ้างอิง (Ref): ${ref}`, "success");
        navigate("/verify-otp");
      } else {
        Swal.fire(
          "ล้มเหลว",
          res.data.message || "ไม่สามารถส่ง OTP ได้",
          "error"
        );
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Swal.fire("ผิดพลาด", "ไม่สามารถส่ง OTP ได้", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-200 to-blue-500 p-4">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-white/70 text-lg px-4 py-2 rounded-lg text-blue-600 hover:bg-white shadow"
        >
          <CircleChevronLeft size={24} />
          <span>ย้อนกลับ</span>
        </button>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
          ขอรหัส OTP เพื่อรีเซ็ตรหัสผ่าน
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">อีเมล:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
              required
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white p-3 rounded-lg transition font-semibold ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "กำลังส่ง..." : "ขอรหัส OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RequestReset;
