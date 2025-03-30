import { useNavigate , Link} from "react-router-dom";

const ChoosePage = () => {
  const navigate = useNavigate();

  const goToAdminLogin = () => {
    window.location.href = "http://localhost:5174/login"; // นำทางไปหน้า login สำหรับ Admin
  };

  const goToEmployeeLogin = () => {
    navigate("/login"); // นำทางไปหน้า login สำหรับพนักงาน
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-500 flex items-center justify-center py-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-semibold text-gray-800 mb-8">DAILY CONTRACT SYSTEM</h1>
        
        <div className="choose-page-container space-y-6">
          {/* Employee Option */}
          <div
            className="option-container cursor-pointer p-6 bg-gray-100 rounded-lg shadow hover:bg-blue-100 transition duration-300"
            onClick={goToEmployeeLogin}
          >
            <div className="icon-container mb-4">
              <img src="/employeeIcon.png" alt="Employee Icon" className="icon w-20 h-20 mx-auto" />
            </div>
            <p className="label text-lg font-medium text-gray-700">พนักงาน</p>
          </div>

          {/* Admin Option */}
          <div
            className="option-container cursor-pointer p-6 bg-gray-100 rounded-lg shadow hover:bg-blue-100 transition duration-300"
            onClick={goToAdminLogin}
          >
            <div className="icon-container mb-4">
              <img src="/adminIcon.png" alt="Admin Icon" className="icon w-20 h-20 mx-auto" />
            </div>
            <p className="label text-lg font-medium text-gray-700">ADMIN</p>
          </div>
          <div className="text-center text-sm text-gray-500">
            <Link
              to="/reset-request"
              className="text-red-600 hover:underline"
            >
              ลืมรหัสผ่าน?
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer mt-8 text-gray-600 text-sm">
          <p>© 2024 Daily Contract System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default ChoosePage;
