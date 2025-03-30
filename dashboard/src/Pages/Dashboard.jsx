"use client"

import { useEffect, useState } from "react"
import axios from "axios"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    overtimeRequest: 0,
  })
  const [recentRequests, setRecentRequests] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userRes = await axios.get("http://localhost:3000/api/auth/employees/me", {
          withCredentials: true,
        })
        setUser(userRes.data)

        const [
          employeesRes,
          attendanceRes,
          leaveRes,
          overtimeRes,
          requestsRes,
          renewalRes,
        ] = await Promise.all([
          axios.get("http://localhost:3000/api/data/db/employees/count", { withCredentials: true }),
          axios.get("http://localhost:3000/api/data/db/attendance/today", { withCredentials: true }),
          axios.get("http://localhost:3000/api/data/db/requests/leaves", { withCredentials: true }),
          axios.get("http://localhost:3000/api/data/db/requests/overtimes", { withCredentials: true }),
          axios.get("http://localhost:3000/api/requests/getAllRequests", { withCredentials: true }),
          axios.get("http://localhost:3000/api/renewal/pending-count", { withCredentials: true }),
        ])

        setStats({
          totalEmployees: employeesRes.data.count,
          presentToday: attendanceRes.data.present,
          onLeave: leaveRes.data.count,
          overtimeRequest: overtimeRes.data.count,
          renewalRequest: renewalRes.data.count,
        })

        if (requestsRes.data && requestsRes.data.data) {
          const sortedRequests = requestsRes.data.data
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)
          setRecentRequests(sortedRequests)
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        if (error.response?.status === 401) {
          window.location.href = "/login"
        }
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "status-approved"
      case "Rejected":
        return "status-rejected"
      case "Pending":
        return "status-pending"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatRequestType = (type) => {
    switch (type) {
      case "leaveRequest":
        return "คำขอลางาน"
      case "workInfoRequest":
        return "คำขอแก้ไขข้อมูลการทำงาน"
      case "overtimeRequest":
        return "คำขอทำงานล่วงเวลา"
      default:
        return "คำขออื่นๆ"
    }
  }

  return (
    <div className="space-y-8 animate-fade-in p-6 md:p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          แดชบอร์ดระบบการทำงาน - {user?.fullname || "แอดมิน"}
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString("th-TH", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 2 - มาทำงานวันนี้ */}
        <div className="dashboard-card">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="dashboard-stat-label">มาทำงานวันนี้</p>
              <h3 className="dashboard-stat text-success-600">{stats.presentToday}</h3>
            </div>
            <div className="dashboard-icon-container bg-success-100 dark:bg-success-900/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-success-600 dark:text-success-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 3 - ลาวันนี้ */}
        <div className="dashboard-card">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="dashboard-stat-label">ลาวันนี้</p>
              <h3 className="dashboard-stat text-warning-600">{stats.onLeave}</h3>
            </div>
            <div className="dashboard-icon-container bg-warning-100 dark:bg-warning-900/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-warning-600 dark:text-warning-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 4 - คำขอ OT */}
        <div className="dashboard-card">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="dashboard-stat-label">คำขอ OT</p>
              <h3 className="dashboard-stat text-danger-600">{stats.overtimeRequest}</h3>
            </div>
            <div className="dashboard-icon-container bg-danger-100 dark:bg-danger-900/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-danger-600 dark:text-danger-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        {/* Card 4 - คำขอต่อสัญญา */}
        <div className="dashboard-card">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="dashboard-stat-label">คำขอต่อสัญญา</p>
              <h3 className="dashboard-stat text-danger-600">{stats.renewalRequest}</h3>
            </div>
            <div className="dashboard-icon-container bg-danger-100 dark:bg-danger-900/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-danger-600 dark:text-danger-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Additional dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dashboard-card">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">คำขอล่าสุด</h2>
          {recentRequests.length > 0 ? (
            <div className="space-y-3">
              {recentRequests.map((request) => (
                <div
                  key={request._id}
                  className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800 dark:text-white">{request.employee_id}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(request.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {formatRequestType(request.type)}
                    </div>
                  </div>
                  <span className={`status-badge ${getStatusClass(request.status)}`}>{request.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">ไม่มีคำขอล่าสุด</p>
            </div>
          )}
        </div>

        <div className="dashboard-card">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">สรุปการทำงานประจำวัน</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">พนักงานมาทำงาน</span>
                <span className="text-sm font-medium text-success-600 dark:text-success-400">
                  {stats.presentToday} คน
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2.5">
                <div
                  className="bg-success-600 h-2.5 rounded-full"
                  style={{
                    width: `${stats.totalEmployees ? (stats.presentToday / stats.totalEmployees) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">พนักงานลางาน</span>
                <span className="text-sm font-medium text-warning-600 dark:text-warning-400">{stats.onLeave} คน</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2.5">
                <div
                  className="bg-warning-600 h-2.5 rounded-full"
                  style={{
                    width: `${stats.totalEmployees ? (stats.onLeave / stats.totalEmployees) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">คำขอทำงานล่วงเวลา</span>
                <span className="text-sm font-medium text-danger-600 dark:text-danger-400">
                  {stats.overtimeRequest} คำขอ
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2.5">
                <div
                  className="bg-danger-600 h-2.5 rounded-full"
                  style={{
                    width: `${stats.totalEmployees ? (stats.overtimeRequest / stats.totalEmployees) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

