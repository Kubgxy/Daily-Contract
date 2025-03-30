// src/components/Help.jsx
import { Link } from "react-router-dom"; // ใช้ Link สำหรับการนำทางในแอป React
import "./Help.css"; // นำเข้าการตกแต่ง

function Help() {
  return (
    <div className="min-h-screen  flex items-center justify-center py-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">Help/FAQ</h1>
        <p className="text-center text-lg text-gray-600 mb-6">ศูนย์ช่วยเหลือและคำถามที่พบบ่อย</p>

        {/* คำถามที่พบบ่อย (FAQ) */}
        <div className="faq-section mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            <i className="fas fa-question-circle text-blue-500 mr-2"></i> คำถามที่พบบ่อย (FAQ)
          </h2>
          <ul className="space-y-4">
            <li>
              <strong className="text-lg">Q: ฉันจะเข้าสู่ระบบได้อย่างไร?</strong>
              <p className="text-gray-600">
                A: คุณสามารถเข้าสู่ระบบได้โดยคลิกที่ปุ่ม{" "}
                <Link to="/login" className="text-blue-500 hover:underline">
                  เข้าสู่ระบบ{""}
                </Link>
              </p>
            </li>
            <li>
              <strong className="text-lg">Q: ฉันจะขออนุมัติคำขอได้อย่างไร?</strong>
              <p className="text-gray-600">A: ไปที่หน้า Requests{" "} และเลือกประเภทคำขอ</p>
            </li>
          </ul>
        </div>

        {/* ติดต่อฝ่ายช่วยเหลือ */}
        <div className="contact-section mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            <i className="fas fa-phone text-green-500 mr-2"></i> ติดต่อฝ่ายช่วยเหลือ
          </h2>
          <ul className="space-y-4">
            <li>
              Email: <a href="mailto:support@example.com" className="text-blue-500 hover:underline">thanakonsinggom123@gmail.com</a>
            </li>
            <li>
              Phone: <a href="tel:+123456789" className="text-blue-500 hover:underline">099-9999-999</a>
            </li>
          </ul>
        </div>

        {/* การแก้ปัญหาเบื้องต้น (Troubleshooting) */}
        <div className="troubleshooting-section">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">การแก้ปัญหาเบื้องต้น (Troubleshooting)</h2>
          <ul className="space-y-4">
            <li>
              หากคุณลืมรหัสผ่าน:{" "}
              <Link to="/forgot-password" className="text-blue-500 hover:underline">
                คลิกที่นี่เพื่อรีเซ็ตรหัสผ่าน
              </Link>
            </li>
            <li>
              ไม่สามารถเชื่อมต่อระบบได้: ตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Help;
