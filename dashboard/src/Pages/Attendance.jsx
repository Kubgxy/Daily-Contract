// ✅ Attendance.jsx (1000% สมบูรณ์)

"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { motion } from "framer-motion"

const Attendance = () => {
  const [records, setRecords] = useState([])
  const [searchUserId, setSearchUserId] = useState("")
  const [selectedDate, setSelectedDate] = useState(getTodayDate())
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const itemsPerPage = 10

  function getTodayDate() {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  const fetchRecords = async (date) => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:3000/api/requests/attendance", {
        params: { date },
        withCredentials: true,
      })
      setRecords(response.data.data || [])
    } catch (error) {
      console.error("❌ Error fetching attendance requests:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords(selectedDate)
  }, [selectedDate])

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value)
    setCurrentPage(1)
  }

  const handleSearchChange = (e) => {
    setSearchUserId(e.target.value)
    setCurrentPage(1)
  }

  const handleRowClick = (record) => {
    setSelectedRecord(record)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedRecord(null)
  }

  const filtered = records.filter((r) => r.employee_id.includes(searchUserId))
  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentItems = filtered.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const formatDate = (str) => new Date(str).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <motion.div className="p-6 max-w-7xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold mb-6">คำขอแก้ไขเวลาเข้า-ออกงาน</h1>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">วันที่</label>
            <input type="date" value={selectedDate} onChange={handleDateChange} className="form-input w-full" />
          </div>
          <div>
            <label className="text-sm font-medium">ค้นหาพนักงาน</label>
            <input type="text" placeholder="Employee ID" value={searchUserId} onChange={handleSearchChange} className="form-input w-full" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">พนักงาน</th>
              <th className="px-4 py-2 text-left">วันที่</th>
              <th className="px-4 py-2 text-left">เวลาเดิม</th>
              <th className="px-4 py-2 text-left">เวลาแก้ไข</th>
              <th className="px-4 py-2 text-left">เหตุผล</th>
              <th className="px-4 py-2 text-left">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? currentItems.map((r) => (
              <tr key={r._id} onClick={() => handleRowClick(r)} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-2">{r.employee_id}</td>
                <td className="px-4 py-2">{formatDate(r.created_at)}</td>
                <td className="px-4 py-2">{r.details?.original_check_in} - {r.details?.original_check_out}</td>
                <td className="px-4 py-2">{r.details?.corrected_check_in} - {r.details?.corrected_check_out}</td>
                <td className="px-4 py-2">{r.details?.reason}</td>
                <td className="px-4 py-2">{r.status}</td>
              </tr>
            )) : (
              <tr><td colSpan="6" className="text-center py-4">ไม่พบข้อมูล</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end mt-4 space-x-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Dialog */}
      {openDialog && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">รายละเอียดคำขอ</h2>
            <p><strong>รหัสพนักงาน:</strong> {selectedRecord.employee_id}</p>
            <p><strong>วันที่:</strong> {formatDate(selectedRecord.created_at)}</p>
            <p><strong>เวลาเดิม:</strong> {selectedRecord.details.original_check_in} - {selectedRecord.details.original_check_out}</p>
            <p><strong>เวลาแก้ไข:</strong> {selectedRecord.details.corrected_check_in} - {selectedRecord.details.corrected_check_out}</p>
            <p><strong>เหตุผล:</strong> {selectedRecord.details.reason}</p>
            <p>
              <strong>ไฟล์แนบ:</strong> <a href={`/uploads/${selectedRecord.details.attachment}`} target="_blank" className="text-blue-500 underline">ดูไฟล์</a>
            </p>
            <div className="mt-4 flex justify-end">
              <button onClick={handleCloseDialog} className="px-4 py-2 bg-gray-200 rounded">ปิด</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default Attendance
