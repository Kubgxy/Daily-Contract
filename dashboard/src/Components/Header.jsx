import { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { ThemeContext } from "../Context/ThemeContext"

function Header() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [employeeID, setEmployeeID] = useState("")
  const [role, setRole] = useState("")
  const navigate = useNavigate()
  const { isDarkMode, toggleTheme } = useContext(ThemeContext)

  // ✅ โหลดข้อมูลผู้ใช้
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/employees/me", {
          withCredentials: true,
        })
        setEmployeeID(res.data.employee_id)
        setRole(res.data.role)
      } catch (error) {
        console.error("โหลด user ไม่ได้:", error)
        navigate("/login")
      }
    }
    fetchUser()
  }, [navigate])

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/logout", {
        withCredentials: true,
      })
      window.location.href = "http://localhost:5173/"
    } catch (error) {
      console.error("Logout ผิดพลาด:", error)
    }
  }

  // ✅ toggle dropdown
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen)
  }

  return (
    <header className="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-dark-700 sticky top-0 z-10">
      <div className="flex justify-between items-center px-4 py-2.5">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white hidden md:block">
          <span className="text-primary-600 dark:text-primary-400">Admin</span> Dashboard
        </h1>

        <div className="flex items-center space-x-3">
          {/* Toggle Theme */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zM4 11a1 1 0 100-2H3a1 1 0 000 2h1zm13 0a1 1 0 100-2h-1a1 1 0 100 2h1zM10 18a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
            >
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800 dark:text-white">{employeeID || "Loading..."}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{role || "Loading..."}</p>
              </div>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-dark-700">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-dark-700">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{employeeID}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{role}</p>
                </div>
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                >
                  โปรไฟล์ของคุณ
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-700"
                >
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
