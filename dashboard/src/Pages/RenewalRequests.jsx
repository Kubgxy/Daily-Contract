"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const RenewalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
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
  };

  const fetchRenewalRequests = async () => {
    try {
      const me = await axios.get("http://localhost:3000/api/auth/employees/me", {
        withCredentials: true,
      });

      if (me.data.role === "Admin") {
        const res = await axios.get(
          "http://localhost:3000/api/renewal/renewal-requests",
          {
            withCredentials: true,
          }
        );
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error("❌ Failed to fetch renewal requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRenewalRequests();
  }, []);

  const handleApprove = async (id) => {
    const confirm = await Swal.fire({
      title: "ยืนยันการต่อสัญญา?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#22c55e",
    });
    if (!confirm.isConfirmed) return;

    try {
      await axios.patch(
        `http://localhost:3000/api/renewal/renewal-approve/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      Swal.fire("สำเร็จ", "ต่อสัญญาแล้ว", "success");
      fetchRenewalRequests();
    } catch (err) {
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถต่อสัญญาได้", "error");
    }
  };

  const handleReject = async (id) => {
    const confirm = await Swal.fire({
      title: "ยืนยันการปฏิเสธการต่อสัญญา?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#ef4444",
    });
    if (!confirm.isConfirmed) return;

    try {
      await axios.patch(
        `http://localhost:3000/api/renewal/renewal-reject/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      Swal.fire("สำเร็จ", "ปฏิเสธการต่อสัญญาแล้ว", "success");
      fetchRenewalRequests();
    } catch (err) {
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถปฏิเสธการต่อสัญญาได้", "error");
    }
  };

  // Filter and pagination
  const filteredRequests = requests.filter((request) =>
    (request.employee_id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedDepartment === "All" || request.position === selectedDepartment)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-dark-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        className="text-2xl font-bold text-gray-800 dark:text-white mb-6"
        variants={itemVariants}
      >
        คำขอต่อสัญญา
      </motion.h1>

      <motion.div
        className="bg-white dark:bg-dark-800 rounded-xl shadow-md p-6 mb-6"
        variants={itemVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Employee ID Search */}
          <div>
            <label
              htmlFor="search-term"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              ค้นหาพนักงาน
            </label>
            <div className="relative">
              <input
                id="search-term"
                type="text"
                placeholder="ค้นหาตาม Employee ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

          {/* Department Filter Dropdown */}
          <div>
            <label
              htmlFor="department-filter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              แผนก
            </label>
            <select
              id="department-filter"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="form-select w-full"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === "All" ? "ทุกแผนก" : dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-white dark:bg-dark-800 rounded-xl shadow-md overflow-hidden"
        variants={itemVariants}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  รหัสพนักงาน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ชื่อ - นามสกุล
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ตำแหน่ง
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  สัญญาเดิมสิ้นสุด
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              {currentItems.length > 0 ? (
                currentItems.map((emp) => (
                  <tr
                    key={emp._id}
                    className="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {emp.employee_id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {emp.first_name} {emp.last_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {emp.position}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {new Date(emp.contract_end_date).toLocaleDateString("th-TH")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleApprove(emp._id)}
                          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors"
                        >
                          อนุมัติ
                        </button>
                        <button
                          onClick={() => handleReject(emp._id)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
                        >
                          ปฏิเสธ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    ไม่พบข้อมูลคำขอต่อสัญญา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="bg-white dark:bg-dark-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-dark-700 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  แสดง <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
                  ถึง{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredRequests.length)}
                  </span>{" "}
                  จากทั้งหมด{" "}
                  <span className="font-medium">{filteredRequests.length}</span>{" "}
                  รายการ
                </p>
              </div>
              {/* Pagination Controls */}
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  {/* Add pagination buttons here */}
                </nav>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RenewalRequests;