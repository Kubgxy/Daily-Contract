"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { motion } from "framer-motion"

const LeaveRequest = () => {
  const [leaveRequests, setLeaveRequests] = useState([])
  const [filteredRequests, setFilteredRequests] = useState([])
  const [statusFilter, setStatusFilter] = useState("")
  const [employeeIdFilter, setEmployeeIdFilter] = useState("")
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split("T")[0])
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:3000/api/requests/getLeaveRequests", { withCredentials: true })
        setLeaveRequests(response.data.data)
        setFilteredRequests(response.data.data)
      } catch (error) {
        console.error("Error fetching leave requests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaveRequests()
  }, [])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleStatusFilterChange = (event) => {
    const value = event.target.value
    setStatusFilter(value)
    filterRequests(value, employeeIdFilter, dateFilter)
    setCurrentPage(1)
  }

  const handleEmployeeIdFilterChange = (event) => {
    const value = event.target.value
    setEmployeeIdFilter(value)
    filterRequests(statusFilter, value, dateFilter)
    setCurrentPage(1)
  }

  const handleDateFilterChange = (event) => {
    const value = event.target.value
    setDateFilter(value)
    filterRequests(statusFilter, employeeIdFilter, value)
    setCurrentPage(1)
  }

  const filterRequests = (status, employeeId, date) => {
    const filtered = leaveRequests.filter(
      (request) =>
        (status === "" || request.status === status) &&
        (employeeId === "" || request.employee_id.includes(employeeId)) &&
        (date === "" || request.start_date.split("T")[0] === date),
    )
    setFilteredRequests(filtered)
  }

  const handleRowClick = (request) => {
    setSelectedRequest(request)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedRequest(null)
  }

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case "Sick":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
      case "Vacation":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
      case "Approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
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
        คำขอลางาน
      </motion.h1>

      <motion.div className="bg-white dark:bg-dark-800 rounded-xl shadow-md p-6 mb-6" variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              สถานะ
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="form-select w-full"
            >
              <option value="">ทั้งหมด</option>
              <option value="Pending">รอการอนุมัติ</option>
              <option value="Approved">อนุมัติแล้ว</option>
              <option value="Rejected">ปฏิเสธแล้ว</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="employee-filter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              รหัสพนักงาน
            </label>
            <div className="relative">
              <input
                id="employee-filter"
                type="text"
                placeholder="ค้นหาตาม Employee ID"
                value={employeeIdFilter}
                onChange={handleEmployeeIdFilterChange}
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
            <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              วันที่เริ่มลา
            </label>
            <input
              id="date-filter"
              type="date"
              value={dateFilter}
              onChange={handleDateFilterChange}
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
                  ประเภทการลา
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  เหตุผล
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  วันที่เริ่มลา
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  วันที่สิ้นสุด
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
                currentItems.map((request) => (
                  <tr
                    key={request._id}
                    className="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(request)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{request.employee_id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLeaveTypeColor(request.leave_type)}`}
                      >
                        {request.leave_type || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white line-clamp-1">{request.reason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(request.start_date)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(request.end_date)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                      >
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    ไม่พบข้อมูลคำขอลางาน
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
                  <span className="font-medium">{Math.min(indexOfLastItem, filteredRequests.length)}</span> จากทั้งหมด{" "}
                  <span className="font-medium">{filteredRequests.length}</span> รายการ
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

      {/* Leave Request Details Dialog */}
      {openDialog && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-dark-900 dark:bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-dark-800 px-4 pt-5 pb-4 sm:p-6">
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white" id="modal-title">
                    รายละเอียดคำขอลางาน
                  </h3>
                  <button
                    onClick={handleCloseDialog}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {selectedRequest && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">รหัสพนักงาน</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {selectedRequest.employee_id}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}
                      >
                        {selectedRequest.status}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ประเภทการลา</p>
                      <p className="text-base text-gray-900 dark:text-white">{selectedRequest.leave_type || "ไม่ระบุ"}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">เหตุผลการลา</p>
                      <p className="text-base text-gray-900 dark:text-white">{selectedRequest.reason}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">วันที่เริ่มลา</p>
                        <p className="text-base text-gray-900 dark:text-white">
                          {formatDate(selectedRequest.start_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">วันที่สิ้นสุด</p>
                        <p className="text-base text-gray-900 dark:text-white">
                          {formatDate(selectedRequest.end_date)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">จำนวนวันลา</p>
                      <p className="text-base text-gray-900 dark:text-white">
                        {Math.ceil(
                          (new Date(selectedRequest.end_date) - new Date(selectedRequest.start_date)) /
                            (1000 * 60 * 60 * 24),
                        ) + 1}{" "}
                        วัน
                      </p>
                    </div>

                    {selectedRequest.approved_by && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">อนุมัติโดย</p>
                        <p className="text-base text-gray-900 dark:text-white">{selectedRequest.approved_by}</p>
                      </div>
                    )}

                    {selectedRequest.approved_date && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">วันที่อนุมัติ</p>
                        <p className="text-base text-gray-900 dark:text-white">
                          {formatDate(selectedRequest.approved_date)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-dark-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCloseDialog}
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default LeaveRequest

