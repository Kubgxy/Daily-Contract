"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const WorkRecord = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const me = await axios.get("http://localhost:3000/api/auth/employees/me", {
        withCredentials: true,
      });

      if (me.data.role === "Admin") {
        const res = await axios.get("http://localhost:3000/api/workinfo/admin/all-records", { withCredentials: true });
        setRecords(res.data.data);
      } else if (me.data.role === "Manager") {
        const res = await axios.get("http://localhost:3000/api/workinfo/manager/records", { withCredentials: true });
        setRecords(res.data.data);
      }
    } catch (error) {
      console.error("❌ error:", error);
      setError(error.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus, employee_id) => {
    let note = undefined;
  
    // ✅ ถ้าเป็นการปฏิเสธ ต้องให้กรอกเหตุผล
    if (newStatus === "Fail") {
      const { value: reason } = await Swal.fire({
        title: "ปฏิเสธงาน",
        input: "textarea",
        inputLabel: "กรุณากรอกเหตุผลในการปฏิเสธ",
        inputPlaceholder: "พิมพ์เหตุผลที่นี่...",
        inputAttributes: {
          "aria-label": "กรุณากรอกเหตุผล",
        },
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        inputValidator: (value) => {
          if (!value) return "กรุณาระบุเหตุผลก่อนดำเนินการ";
        },
      });
  
      if (!reason) return; // ❌ ยกเลิก
      note = reason;
    }
  
    // ✅ Confirm อีกครั้งก่อนส่ง
    const confirmResult = await Swal.fire({
      title: newStatus === "Success" ? "ยืนยันการอนุมัติ?" : "ยืนยันการปฏิเสธ?",
      text: `คุณต้องการ${newStatus === "Success" ? "อนุมัติ" : "ปฏิเสธ"}งานนี้หรือไม่`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: newStatus === "Success" ? "#22c55e" : "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    });
  
    if (!confirmResult.isConfirmed) return;
  
    try {
      const cleanStatus = newStatus.trim().toLowerCase();
      const endpoint =
        cleanStatus === "success"
          ? `http://localhost:3000/api/workinfo/approve/${id}`
          : `http://localhost:3000/api/workinfo/reject/${id}`;
  
      const res = await axios.patch(
        endpoint,
        {
          note: newStatus === "Fail" ? note : undefined,
        },
        { withCredentials: true }
      );
  
      if (res.data?.status === "success" || res.data?.status === "fail") {
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: newStatus === "Success" ? "อนุมัติแล้ว" : "ปฏิเสธแล้ว",
        });
        fetchData();
      } else {
        throw new Error("Backend ไม่ส่ง status success/fail มา");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถอัปเดตสถานะได้", "error");
    }
  };  

  const departments = [
    "All",
    "ProductionManager",
    "ProductionStaff",
    "SalesManager",
    "SalesStaff",
    "QCManager",
    "QCStaff",
  ];

  const getDepartmentColor = (position) => {
    switch (position) {
      case "ProductionManager":
        return "text-purple-600";
      case "ProductionStaff":
        return "text-indigo-600";
      case "SalesManager":
        return "text-rose-600";
      case "SalesStaff":
        return "text-pink-600";
      case "QCManager":
        return "text-yellow-600";
      case "QCStaff":
        return "text-orange-600";
      default:
        return "text-gray-800";
    }
  };

  const filteredRecords = records.filter((record) => {
    const recordDate = new Date(record.work_date).toISOString().split("T")[0];
    return (
      (selectedDepartment === "All" ||
        record.position === selectedDepartment) &&
      recordDate === selectedDate
    );
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Success":
        return "bg-green-500";
      case "Pending":
        return "bg-amber-500";
      case "Fail":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

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
      <motion.div
        className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        variants={itemVariants}
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">ประวัติการทำงาน</h1>
        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="form-input h-10"
          />
          <select
            className="form-select h-10"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === "All" ? "ทุกแผนก" : dept}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      <motion.div className="bg-white dark:bg-dark-800 rounded-xl shadow-md overflow-hidden" variants={itemVariants}>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
              <thead className="bg-gray-50 dark:bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">วันที่</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ตำแหน่ง</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">งาน</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ชั่วโมง</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">สถานะ</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatDate(record.work_date)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getDepartmentColor(record.position)}`}>
                        {record.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {record.task}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {record.hours}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)} text-white`}
                        >
                          {record.status === "Success"
                            ? "สำเร็จ"
                            : record.status === "Pending"
                            ? "รอดำเนินการ"
                            : "ไม่สำเร็จ"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {record.status === "Pending" && (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleUpdateStatus(record.report_id, "Success", record.employee_id)}
                              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                            >
                              อนุมัติ
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(record.report_id, "Fail", record.employee_id)}
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
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      ไม่พบข้อมูล
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default WorkRecord
