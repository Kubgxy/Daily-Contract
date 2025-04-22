import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // 🔐 ส่ง login พร้อม cookie
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { username, password },
        { withCredentials: true }
      )

      if (response.status === 200) {
        // ✅ หลัง login สำเร็จ → เรียก /me เช็ค role
        const meRes = await axios.get("http://localhost:3000/api/auth/employees/me", {
          withCredentials: true,
        })

        if (meRes.data.role !== "Admin" && meRes.data.role !== "Manager") {
          setError("เฉพาะแอดมินเท่านั้นที่สามารถเข้าสู่ระบบนี้ได้")
          return
        }

        navigate("/")
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง")
      } else {
        setError("เกิดข้อผิดพลาดในระบบ")
      }
      console.error("Login Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-500 to-primary-700">
      <div className="w-full max-w-lg px-6">
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">เข้าสู่ระบบสำหรับแอดมิน</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">กรุณาเข้าสู่ระบบเพื่อจัดการข้อมูล</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-danger-50 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="form-label">
                  ชื่อผู้ใช้
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    if (error) setError("")
                  }}
                  className="form-input"
                  placeholder="กรอกชื่อผู้ใช้"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="form-label">
                  รหัสผ่าน
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (error) setError("")
                  }}
                  className="form-input"
                  placeholder="กรอกรหัสผ่าน"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    กำลังเข้าสู่ระบบ...
                  </div>
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
