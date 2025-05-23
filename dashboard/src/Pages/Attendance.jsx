// ✅ Attendance.jsx (เวอร์ชันปรับ UI สถานะ + เวลาให้สวยงาม)

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [searchUserId, setSearchUserId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const itemsPerPage = 10;

  function getTodayDate() {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  const fetchRecords = async (date) => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/requests/attendance",
        {
          params: { date },
          withCredentials: true,
        }
      );
      setRecords(response.data.data || []);
    } catch (error) {
      console.error("❌ Error fetching attendance requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchUserId(e.target.value);
    setCurrentPage(1);
  };

  const handleRowClick = (record) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecord(null);
  };

  const filtered = records.filter((r) => r.employee_id.includes(searchUserId));
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const formatDate = (str) =>
    new Date(str).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  const formatTime = (str) => str?.split("T")[1]?.slice(0, 5) || "-";

  const renderStatusBadge = (status) => {
    const base =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case "Approved":
        return (
          <span className={`${base} bg-green-100 text-green-800`}>
            Approved
          </span>
        );
      case "Pending":
        return (
          <span className={`${base} bg-yellow-100 text-yellow-800`}>
            Pending
          </span>
        );
      case "Rejected":
        return (
          <span className={`${base} bg-red-100 text-red-800`}>Rejected</span>
        );
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-2xl font-bold mb-6">คำขอแก้ไขเวลาเข้า-ออกงาน</h1>
  
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium dark:text-gray-300">วันที่</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="form-input w-full dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="text-sm font-medium dark:text-gray-300">
              ค้นหาพนักงาน
            </label>
            <input
              type="text"
              placeholder="Employee ID"
              value={searchUserId}
              onChange={handleSearchChange}
              className="form-input w-full dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600"
            />
          </div>
        </div>
      </div>
  
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-xl">
        <table className="min-w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left dark:text-gray-300">พนักงาน</th>
              <th className="px-4 py-2 text-left dark:text-gray-300">วันที่</th>
              <th className="px-4 py-2 text-left dark:text-gray-300">เวลาเดิม</th>
              <th className="px-4 py-2 text-left dark:text-gray-300">
                เวลาแก้ไข
              </th>
              <th className="px-4 py-2 text-left dark:text-gray-300">เหตุผล</th>
              <th className="px-4 py-2 text-left dark:text-gray-300">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((r) => (
                <tr
                  key={r._id}
                  onClick={() => handleRowClick(r)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <td className="px-4 py-2">{r.employee_id}</td>
                  <td className="px-4 py-2">{formatDate(r.updated_at)}</td>
                  <td className="px-4 py-2">
                    {formatTime(r.details?.original_check_in)} -{" "}
                    {formatTime(r.details?.original_check_out)}
                  </td>
                  <td className="px-4 py-2">
                    {formatTime(r.details?.corrected_check_in)} -{" "}
                    {formatTime(r.details?.corrected_check_out)}
                  </td>
                  <td className="px-4 py-2">{r.details?.reason}</td>
                  <td className="px-4 py-2">{renderStatusBadge(r.status)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  ไม่พบข้อมูล
                </td>
              </tr>
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
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
  
      {/* Dialog */}
      {openDialog && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 dark:text-gray-300">
              รายละเอียดคำขอ
            </h2>
            <p>
              <strong className="dark:text-gray-300">รหัสพนักงาน:</strong>{" "}
              {selectedRecord.employee_id}
            </p>
            <p>
              <strong className="dark:text-gray-300">วันที่:</strong>{" "}
              {formatDate(selectedRecord.updated_at)}
            </p>
            <p>
              <strong className="dark:text-gray-300">เวลาเดิม:</strong>{" "}
              {formatTime(selectedRecord.details.original_check_in)} -{" "}
              {formatTime(selectedRecord.details.original_check_out)}
            </p>
            <p>
              <strong className="dark:text-gray-300">เวลาแก้ไข:</strong>{" "}
              {formatTime(selectedRecord.details.corrected_check_in)} -{" "}
              {formatTime(selectedRecord.details.corrected_check_out)}
            </p>
            <p>
              <strong className="dark:text-gray-300">เหตุผล:</strong>{" "}
              {selectedRecord.details.reason}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseDialog}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Attendance;
