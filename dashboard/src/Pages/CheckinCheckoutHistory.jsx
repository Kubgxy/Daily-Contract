"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { motion } from "framer-motion"

const AttendanceHistory = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchDate, setSearchDate] = useState(getTodayDate())
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // ฟังก์ชันเพื่อดึงวันที่ปัจจุบันในรูปแบบ YYYY-MM-DD
  function getTodayDate() {
    const timezone = "Asia/Bangkok" // ระบุ timezone
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  // ดึงข้อมูลการเข้า-ออกงานจาก API
  useEffect(() => {
    const fetchAttendanceHistory = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:3000/api/data/attendance", { withCredentials: true }) // URL API
        setHistory(response.data.data) // สมมติว่าข้อมูลอยู่ใน response.data.data
      } catch (error) {
        console.error("Error fetching attendance history:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAttendanceHistory()
  }, [])

  // ฟังก์ชันจัดการการเปลี่ยนค่าชื่อพนักงานที่ค้นหา
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1) // Reset to first page when search changes
  }

  // ฟังก์ชันจัดการการเปลี่ยนค่าของวันที่ที่ค้นหา
  const handleDateChange = (event) => {
    setSearchDate(event.target.value)
    setCurrentPage(1) // Reset to first page when date changes
  }

  const filteredHistory = history.filter((entry) => {
    const matchesSearch = searchTerm === "" || entry.employee_id?.includes(searchTerm)
    const matchesDate = searchDate === "" || entry.attendance_date === searchDate
    return matchesSearch && matchesDate
  })

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString("th-TH", options)
  }

  // Get status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "Leave":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
      case "Sick Leave":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-dark-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <motion.div className="p-6 max-w-7xl mx-auto" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6" variants={itemVariants}>
        ประวัติการเข้า-ออกงาน
      </motion.h1>

      <motion.div className="bg-white dark:bg-dark-800 rounded-xl shadow-md p-6 mb-6" variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="employee-search"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              ค้นหาพนักงาน
            </label>
            <div className="relative">
              <input
                id="employee-search"
                type="text"
                placeholder="ค้นหาตาม Employee ID"
                value={searchTerm}
                onChange={handleSearchChange}
                className="form-input pl-10 w-full"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div>
            <label htmlFor="date-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              วันที่
            </label>
            <input
              id="date-search"
              type="date"
              value={searchDate}
              onChange={handleDateChange}
              className="form-input w-full"
            />
          </div>
        </div>
      </motion.div>

      <motion.div className="bg-white dark:bg-dark-800 rounded-xl shadow-md overflow-hidden" variants={itemVariants}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  พนักงาน
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  วันที่
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  เช็คอิน
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  เช็คเอ้าท์
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  ชั่วโมงการทำงาน
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  สถานะ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              {currentItems.length > 0 ? (
                currentItems.map((entry) => (
                  <tr key={entry.attendance_id} className="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {entry.employee_id || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {entry.attendance_date ? formatDate(entry.attendance_date) : "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{entry.check_in_time || "N/A"}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{entry.check_out_time || "N/A"}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        {entry.work_hours || "N/A"} ชั่วโมง
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(entry.status)}`}
                      >
                        {entry.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    ไม่พบข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white dark:bg-dark-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-dark-700 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  แสดง <span className="font-medium">{indexOfFirstItem + 1}</span> ถึง{" "}
                  <span className="font-medium">{Math.min(indexOfLastItem, filteredHistory.length)}</span> จากทั้งหมด{" "}
                  <span className="font-medium">{filteredHistory.length}</span> รายการ
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        currentPage === i + 1
                          ? "z-10 bg-primary-50 dark:bg-primary-900/20 border-primary-500 dark:border-primary-700 text-primary-600 dark:text-primary-400"
                          : "bg-white dark:bg-dark-800 border-gray-300 dark:border-dark-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700"
                      } text-sm font-medium`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default AttendanceHistory

