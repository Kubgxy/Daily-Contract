"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { motion } from "framer-motion"

const WorkInfo = () => {
  const [workInfos, setWorkInfos] = useState([])
  const [selectedDate, setSelectedDate] = useState(getTodayDate())
  const [searchEmployeeId, setSearchEmployeeId] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedWorkInfo, setSelectedWorkInfo] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const itemsPerPage = 10

  function getTodayDate() {
    const today = new Date()
    return today.toISOString().split("T")[0] // รูปแบบ YYYY-MM-DD
  }

  const fetchWorkInfo = async (date) => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token") // ดึง token จาก localStorage
      const response = await axios.get("http://localhost:3000/api/data/getAllWorkInfo", {
        params: { date },
        withCredentials: true,
      })

      setWorkInfos(response.data.data || []) // เซ็ตข้อมูลลงใน state
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการทำงาน:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkInfo(selectedDate) // เรียก API เมื่อ selectedDate เปลี่ยน
  }, [selectedDate])

  const handleDateChange = (event) => {
    const newDate = event.target.value
    setSelectedDate(newDate) // อัปเดต selectedDate
    setCurrentPage(1) // Reset to first page when date changes
  }

  const handleSearchChange = (event) => {
    setSearchEmployeeId(event.target.value)
    setCurrentPage(1) // Reset to first page when search changes
  }

  const handleRowClick = (workInfo) => {
    setSelectedWorkInfo(workInfo)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedWorkInfo(null)
  }

  const filteredWorkInfos = workInfos.filter(
    (info) =>
      new Date(info.work_date).toISOString().split("T")[0] === selectedDate &&
      (searchEmployeeId === "" || info.employee_id.toString().includes(searchEmployeeId)),
  )

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredWorkInfos.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredWorkInfos.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
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

  // Get status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "Absent":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "Leave":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
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

  return (
    <motion.div className="p-6 max-w-7xl mx-auto" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6" variants={itemVariants}>
        บันทึกปฏิบัติงานของพนักงานรายวัน
      </motion.h1>

      <motion.div className="bg-white dark:bg-dark-800 rounded-xl shadow-md p-6 mb-6" variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              วันที่
            </label>
            <input
              id="date-filter"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="form-input w-full"
            />
          </div>

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
                value={searchEmployeeId}
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
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
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
                      วันที่ทำงาน
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      ประเภทงาน
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      รายละเอียดงาน
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
                    currentItems.map((info) => (
                      <tr
                        key={info._id}
                        className="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors cursor-pointer"
                        onClick={() => handleRowClick(info)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium">
                              {info.employee_id.toString().charAt(0)}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                ID: {info.employee_id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {info.work_date ? formatDate(info.work_date) : "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                            {info.type_work}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white line-clamp-1">{info.detail_work}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(info.status)}`}
                          >
                            {info.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        ไม่มีข้อมูลสำหรับวันที่ที่เลือก
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
                      <span className="font-medium">{Math.min(indexOfLastItem, filteredWorkInfos.length)}</span>{" "}
                      จากทั้งหมด <span className="font-medium">{filteredWorkInfos.length}</span> รายการ
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
          </>
        )}
      </motion.div>

      {/* Work Info Details Dialog */}
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
                    รายละเอียดการทำงาน
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

                {selectedWorkInfo && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">รหัสพนักงาน</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {selectedWorkInfo.employee_id}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">วันที่ทำงาน</p>
                      <p className="text-base text-gray-900 dark:text-white">
                        {formatDate(selectedWorkInfo.work_date)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ประเภทงาน</p>
                      <p className="text-base text-gray-900 dark:text-white">{selectedWorkInfo.type_work}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">รายละเอียดงาน</p>
                      <p className="text-base text-gray-900 dark:text-white">{selectedWorkInfo.detail_work}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">สถานะ</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedWorkInfo.status)}`}
                      >
                        {selectedWorkInfo.status}
                      </span>
                    </div>

                    {selectedWorkInfo.notes && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">หมายเหตุ</p>
                        <p className="text-base text-gray-900 dark:text-white">{selectedWorkInfo.notes}</p>
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

export default WorkInfo

