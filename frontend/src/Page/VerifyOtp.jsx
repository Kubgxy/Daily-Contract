  import React, { useEffect, useMemo, useRef, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { CircleChevronLeft } from "lucide-react";
  import Swal from "sweetalert2";
  import axios from "axios";
  import baseURL from '../utils/api';

  function VerifyOtp() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [refCode, setRefCode] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");
    const [isExpired, setIsExpired] = useState(false);
    const [expiresAt, setExpiresAt] = useState(null); 
    const [resendCooldown, setResendCooldown] = useState(0); // วินาที cooldown


    const navigate = useNavigate();

    // ✅ สร้าง ref สำหรับ input แต่ละช่องแบบ stable
    const inputRefs = useMemo(
      () => Array.from({ length: 6 }, () => React.createRef()),
      []
    );

    // โหลด email/ref จาก sessionStorage
    useEffect(() => {
      const savedEmail = sessionStorage.getItem("resetEmail");
      const savedRef = sessionStorage.getItem("resetRef");
      const expiresAtFromSession = sessionStorage.getItem("expiresAt");
      
      if (!savedEmail || !savedRef || !expiresAtFromSession) {
        Swal.fire("เกิดข้อผิดพลาด", "ไม่พบข้อมูล OTP กรุณาขอใหม่", "error");
        navigate("/reset-request");
        return;
      }
      setEmail(savedEmail);
      setRefCode(savedRef);
      setExpiresAt(expiresAtFromSession);
    }, []);

    useEffect(() => {
      if (!expiresAt) return;
      
      const interval = setInterval(() => {
        const now = new Date();
        const expire = new Date(expiresAt);
        const diff = expire.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeLeft("OTP หมดอายุแล้ว");
          setIsExpired(true);
          clearInterval(interval);
        } else {
          const mins = Math.floor(diff / 60000);
          const secs = Math.floor((diff % 60000) / 1000);
          setTimeLeft(
            `${String(mins).padStart(2, "0")}:${String(secs).padStart(
              2,
              "0"
            )} นาที`
          );
        }
      }, 1000);
      return () => clearInterval(interval);
    }, [expiresAt]);

    useEffect(() => {
      if (resendCooldown === 0) return;
    
      const interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    
      return () => clearInterval(interval);
    }, [resendCooldown]);
    

    // ส่ง OTP ไป verify เมื่อกรอกครบ 6 ตัว
    useEffect(() => {
      const allFilled = otp.every((val) => val.trim() !== "");
      if (allFilled && !isSubmitting && !isVerified && !isExpired) {
        handleVerifyOtp();
      }
    }, [otp]);

    const handleVerifyOtp = async () => {
      if (isExpired) {
        Swal.fire("รหัสหมดอายุแล้ว", "กรุณาขอใหม่อีกครั้ง", "warning");
        return;
      }
      setIsSubmitting(true);
      try {
        const fullOtp = otp.join("");
        const res = await axios.post(
          `${baseURL}/api/auth/verify-otp`,
          { email, otp: fullOtp, ref: refCode },
          { withCredentials: true }
        );

        if (res.data.status === "success") {
          setIsVerified(true);
          Swal.fire("สำเร็จ!", "รหัส OTP ถูกต้อง", "success");
          navigate("/reset-password");
        } else {
          throw new Error(res.data.message || "OTP ไม่ถูกต้อง");
        }
      } catch (err) {
        console.error("OTP verify failed:", err);

        const msg =
          err.response?.data?.message || err.message || "OTP ไม่ถูกต้อง";
        console.log("Error message:", msg);

        if (msg.includes("เกิน 5 ครั้ง")) {
          Swal.fire({
            icon: "warning",
            title: "กรอก OTP ผิดเกิน 5 ครั้ง",
            text: "กรุณาขอรหัส OTP ใหม่อีกครั้ง",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "ล้มเหลว",
            text: err.message || "OTP ไม่ถูกต้อง",
            didClose: () => {
              setOtp(["", "", "", "", "", ""]);
              setIsVerified(false);
              // ✅ รอให้ Swal ปิดแล้วค่อย focus ช่องแรกอย่างปลอดภัย
              setTimeout(() => {
                requestAnimationFrame(() => {
                  inputRefs[0].current?.focus();
                });
              }, 50);
            },
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleChange = (index, value) => {
      if (/^[0-9]?$/.test(value)) {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // auto focus ถัดไป
        if (value && index < 5) {
          inputRefs[index + 1].current?.focus();
        }
      }
    };

    const handleResend = async () => {
      try {
        const res = await axios.post(
          `${baseURL}/api/auth/request-reset`,
          { email },
          { withCredentials: true }
        );
        if (res.data.status === "success") {
          Swal.fire("ส่ง OTP ใหม่แล้ว", "กรุณาตรวจสอบอีเมลอีกครั้ง", "success");
          
          setRefCode(res.data.ref);
          setExpiresAt(res.data.expiresAt);
          sessionStorage.setItem("resetRef", res.data.ref);
          sessionStorage.setItem("expiresAt", res.data.expiresAt);
          
          setOtp(["", "", "", "", "", ""]);
          setIsExpired(false);
          setResendCooldown(30);
          
          setTimeout(() => {
            inputRefs[0].current?.focus();
          }, 50);
        } else {
          throw new Error(res.data.message);
        }
      } catch (err) {
        Swal.fire("ล้มเหลว", err.message || "ไม่สามารถส่ง OTP ใหม่ได้", "error");
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-200 to-blue-500 px-4">
        <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate("/reset-request")}
          className="flex items-center gap-2 bg-white/70 text-lg px-4 py-2 rounded-lg text-blue-600 hover:bg-white shadow"
        >
          <CircleChevronLeft size={24} />
          <span>ย้อนกลับ</span>
        </button>
      </div>
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">กรอกรหัส OTP</h2>
          <p className="text-sm text-gray-700">
            ระบบได้ส่งรหัส OTP ไปยังอีเมลของคุณแล้ว
            <br />
            รหัสอ้างอิง (Ref):{" "}
            <span className="font-semibold text-blue-800">{refCode}</span>
          </p>

          <div className="mt-6 flex justify-center gap-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={inputRefs[i]}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                disabled={isExpired}
                className={`w-12 h-12 text-xl text-center border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  isExpired ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                            : "focus:ring-blue-400"
                }`}
              />
            ))}
          </div>

          <div className="mt-6">
            <p className="text-sm text-red-600 font-semibold mt-2">
              ⏳ OTP จะหมดอายุใน: {timeLeft}
            </p>

            <button
              onClick={handleResend}
              className="text-blue-600 hover:underline font-medium"
              disabled={isSubmitting || resendCooldown > 0}
            >
              {resendCooldown > 0 ? `ขอ OTP ใหม่ใน ${resendCooldown} วินาที` : "ขอ OTP ใหม่"}
            </button>
            <p className="text-xs text-gray-400 mt-1">
              หากไม่ได้รับรหัสภายใน 10 นาที กรุณาขอ OTP ใหม่
            </p>
          </div>
        </div>
      </div>
    );
  }

  export default VerifyOtp;
