"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { motion } from "framer-motion"

const Requests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [action, setAction] = useState("")
  const [selectedDetails, setSelectedDetails] = useState(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const approved_by = localStorage.getItem("employee_id") || "Admin"

  useEffect(() => {
    const fetchRequests = async () => {
      try {

        setLoading(true)
        const response = await axios.get("http://localhost:3000/api/requests/getAllRequests", { withCredentials: true })

        if (response.data && response.data.data) {
          setRequests(response.data.data) // ตั้งค่าข้อมูล
        } else {
          console.error("Invalid data structure")
          setRequests([])
        }
      } catch (error) {
        console.error("Error fetching requests:", error)
        setErrorMessage("Failed to fetch requests")
      } finally {
        setLoading(false) // หยุดโหลด
      }
    }

    fetchRequests()
  }, [])

  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value)
    setCurrentPage(1)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }

  const handleActionClick = (request, actionType) => {
    if (!["approved", "rejected"].includes(actionType)) {
      console.error("Invalid action type selected!")
      return
    }

    setSelectedRequest(request)
    setAction(actionType)
    setOpenDialog(true)
  }

  const handleViewDetails = (details, type) => {
    if (!details) {
      console.error("No details found!")
      return
    }
    setSelectedDetails(details)
    setDetailsDialogOpen(true)
  }

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false)
    setSelectedDetails(null)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false) // ปิด Dialog
    setSelectedRequest(null) // รีเซ็ตค่าคำขอที่เลือก
  }

  const handleConfirmAction = async () => {
    try {
      if (!["approved", "rejected"].includes(action)) {
        setErrorMessage("Invalid action type")
        return
      }

      setLoading(true)
      // เลือก Endpoint ตามประเภทคำขอ
      let endpoint = ""
      let payload = {
        requestId: selectedRequest._id,
        action,
        approved_by,
      }

      if (selectedRequest.type === "overtimeRequest") {
        endpoint = "http://localhost:3000/api/requests/updateRequestStatus"
        if (action === "approved") {
          payload = {
            ...payload,
            type: "overtimeRequest",
            overtimeData: {
              employee_id: selectedRequest.employee_id,
              overtime_date: selectedRequest.details?.overtime_date || "",
              start_time: selectedRequest.details?.start_time || "",
              end_time: selectedRequest.details?.end_time || "",
            },
            
          }
        } else {
          payload.type = "overtimeRequest" // เพิ่ม type สำหรับ Rejected
        }
      } else if (selectedRequest.type === "workInfoRequest") {
        endpoint = "http://localhost:3000/api/requests/approveWorkInfoRequest"
      } else if (selectedRequest.type === "leaveRequest") {
        endpoint = "http://localhost:3000/api/requests/approveLeaveRequest"
      }

      const response = await axios.post(endpoint, payload, { withCredentials: true })

      if (response.data.status === "Success") {
        setSuccessMessage(`คำขอถูก${action === "approved" ? "อนุมัติ" : "ปฏิเสธ"}แล้ว`)
        setTimeout(() => setSuccessMessage(""), 3000)

        // อัปเดตสถานะใน UI
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === selectedRequest._id ? { ...req, status: action === "approved" ? "Approved" : "Rejected" } : req,
          ),
        )
      } else {
        setErrorMessage(response.data.data.msg || "เกิดข้อผิดพลาดในการอัปเดตสถานะ")
        setTimeout(() => setErrorMessage(""), 3000)
      }
    } catch (error) {
      console.error("Error updating request status:", error)
      setErrorMessage("เกิดข้อผิดพลาดในการบันทึกข้อมูล")
      setTimeout(() => setErrorMessage(""), 3000)
    } finally {
      setLoading(false)
      setOpenDialog(false)
      setSelectedRequest(null)
    }
  }

  const getRequestTypeLabel = (type) => {
    switch (type) {
      case "leaveRequest":
        return "คำขอลางาน"
      case "workInfoRequest":
        return "คำขอแก้ไขข้อมูลการทำงาน"
      case "overtimeRequest":
        return "คำขอทำงานล่วงเวลา"
      default:
        return "อื่นๆ"
    }
  }

  const getRequestTypeColor = (type) => {
    switch (type) {
      case "leaveRequest":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "workInfoRequest":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
      case "overtimeRequest":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
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

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Filter requests
  const filteredRequests = requests
    .filter((request) => {
      const matchesType = typeFilter === "" || request.type === typeFilter
      const matchesSearch = searchTerm === "" || request.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesType && matchesSearch
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

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

  if (loading && requests.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-dark-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <motion.div className="p-6 max-w-7xl mx-auto" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6" variants={itemVariants}>
        คำขอการลา
      </motion.h1>

      <motion.div className="bg-white dark:bg-dark-800 rounded-xl shadow-md p-6 mb-6" variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ประเภทคำขอ
            </label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={handleTypeFilterChange}
              className="form-select w-full"
            >
              <option value="">ทั้งหมด</option>
              <option value="leaveRequest">คำขอลางาน</option>
              <option value="workInfoRequest">คำขอแก้ไขข้อมูลการทำงาน</option>
              <option value="overtimeRequest">คำขอทำงานล่วงเวลา</option>
            </select>
          </div>

          <div>
            <label htmlFor="search-term" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ค้นหาพนักงาน
            </label>
            <div className="relative">
              <input
                id="search-term"
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
                  วันที่ส่งคำขอ
                </th>
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
                  ประเภทคำขอ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  สถานะ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              {currentItems.length > 0 ? (
                currentItems.map((request) => (
                  <tr
                    key={request._id}
                    className="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(request.details, request.type)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(request.created_at)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{request.employee_id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRequestTypeColor(request.type)}`}
                      >
                        {getRequestTypeLabel(request.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {request.status === "Pending" && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleActionClick(request, "approved")
                            }}
                            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                          >
                            อนุมัติ
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleActionClick(request, "rejected")
                            }}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          >
                            ปฏิเสธ
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    ไม่พบข้อมูลคำขอในระบบ
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

      {/* Details Dialog */}
      {detailsDialogOpen && (
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
                    รายละเอียดคำขอ
                  </h3>
                  <button
                    onClick={handleCloseDetailsDialog}
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

                {selectedDetails ? (
                  <div className="space-y-3">
                    {Object.entries(selectedDetails).map(([key, value]) => (
                      <div
                        key={key}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-b border-gray-200 dark:border-dark-700 pb-2"
                      >
                        <div className="sm:col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                          {key.replace(/_/g, " ")}:
                        </div>
                        <div className="sm:col-span-2 text-sm text-gray-900 dark:text-white">
                          {typeof value === "string" && value.includes("T") && !isNaN(Date.parse(value))
                            ? formatDate(value)
                            : value || "ไม่มีข้อมูล"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">ไม่มีข้อมูล</p>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-dark-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCloseDetailsDialog}
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
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
              <div className="bg-white dark:bg-dark-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div
                    className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
                      action === "approved" ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
                    } sm:mx-0 sm:h-10 sm:w-10`}
                  >
                    {action === "approved" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-green-600 dark:text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-600 dark:text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      ยืนยันการดำเนินการ
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        คุณต้องการ {action === "approved" ? "อนุมัติ" : "ปฏิเสธ"} คำขอนี้หรือไม่?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-dark-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    action === "approved"
                      ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                      : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  } text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={handleConfirmAction}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
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
                      กำลังดำเนินการ...
                    </div>
                  ) : (
                    "ยืนยัน"
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-dark-600 shadow-sm px-4 py-2 bg-white dark:bg-dark-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCloseDialog}
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success and Error Messages */}
      {(successMessage || errorMessage) && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
          <div
            className={`bg-white dark:bg-dark-800 rounded-lg shadow-lg border ${
              errorMessage ? "border-red-500" : "border-green-500"
            } overflow-hidden`}
          >
            <div className="p-4 flex items-start">
              <div className="flex-shrink-0">
                {errorMessage ? (
                  <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{errorMessage || successMessage}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="bg-white dark:bg-dark-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={() => {
                    setErrorMessage("")
                    setSuccessMessage("")
                  }}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default Requests

