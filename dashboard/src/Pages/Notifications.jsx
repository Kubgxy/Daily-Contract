"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [currentEntry, setCurrentEntry] = useState({
    category: "",
    message: "",
    details: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const itemsPerPage = 5;
  const token = localStorage.getItem("token");

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/data/getAllNotifications`,
        { withCredentials: true }
      );
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleSendNotification = async () => {
    const { category, message, details } = currentEntry;

    if (!category || !message || !details) {
      setSuccessMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    try {
      setIsLoading(true);
      const newNotification = {
        employee_id: employeeId || "",
        category,
        message,
        details,
      };

      const response = await axios.post(
        "http://localhost:3000/api/data/addNotification",
        newNotification,
        { withCredentials: true }
      );

      setSuccessMessage("ส่งการแจ้งเตือนสำเร็จ");
      setTimeout(() => setSuccessMessage(""), 3000);
      setCurrentEntry({ category: "", message: "", details: "" });
      setEmployeeId("");
      loadNotifications();
    } catch (error) {
      console.error("Error adding notification:", error);

      if (error.response && error.response.data) {
        setSuccessMessage(`Error: ${error.response.data.data.msg}`);
      } else {
        setSuccessMessage("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
      }
      setTimeout(() => setSuccessMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(
        `http://localhost:3000/api/data/deleteNotification/${id}`,
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== id)
      );
      setSuccessMessage("ลบการแจ้งเตือนสำเร็จ");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting notification:", error);
      setSuccessMessage("เกิดข้อผิดพลาดในการลบการแจ้งเตือน");
      setTimeout(() => setSuccessMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSelectedNotifications = async () => {
    try {
      setIsLoading(true);
      await Promise.all(
        selectedNotifications.map((id) =>
          axios.delete(
            `http://localhost:3000/api/data/deleteNotification/${id}`,
            { withCredentials: true }
          )
        )
      );
      setNotifications((prev) =>
        prev.filter(
          (notification) => !selectedNotifications.includes(notification._id)
        )
      );
      setSelectedNotifications([]);
      setSuccessMessage("ลบการแจ้งเตือนที่เลือกสำเร็จ");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting selected notifications:", error);
      setSuccessMessage("เกิดข้อผิดพลาดในการลบการแจ้งเตือน");
      setTimeout(() => setSuccessMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditNotification = (notification) => {
    setCurrentEntry({
      category: notification.category,
      message: notification.message,
      details: notification.details,
    });
    setEmployeeId(notification.employee_id);
    setEditingId(notification._id);
  };

  const handleUpdateNotification = async () => {
    const { category, message, details } = currentEntry;

    if (!employeeId || !category || !message || !details) {
      setSuccessMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }

    try {
      setIsLoading(true);
      const updatedNotification = {
        employee_id: employeeId,
        category,
        message,
        details,
      };
      const response = await axios.patch(
        `http://localhost:3000/api/data/updateNotification/${editingId}`,
        updatedNotification,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === editingId ? response.data.data : notification
          )
        );
        setCurrentEntry({ category: "", message: "", details: "" });
        setEmployeeId("");
        setEditingId(null);
        setSuccessMessage("อัปเดตการแจ้งเตือนสำเร็จ");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error updating notification:", error);
      setSuccessMessage("เกิดข้อผิดพลาดในการอัปเดตการแจ้งเตือน");
      setTimeout(() => setSuccessMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedNotifications((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedNotifications(
        filteredNotifications.map((notification) => notification._id)
      );
    } else {
      setSelectedNotifications([]);
    }
  };

  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.employee_id
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotifications = filteredNotifications.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case "General":
        return "General";
      case "Work":
        return "Work";
      case "Leave":
        return "Leave";
      case "Overtime":
        return "OT";
      case "System":
        return "System";
      default:
        return category;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "General":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Work":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Leave":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "Overtime":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "System":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

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
        การจัดการการแจ้งเตือน
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className="lg:col-span-1" variants={itemVariants}>
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              {editingId ? "แก้ไขการแจ้งเตือน" : "ส่งการแจ้งเตือนใหม่"}
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="employee_id"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  รหัสพนักงาน
                </label>
                <input
                  type="text"
                  id="employee_id"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="form-input"
                  placeholder="รหัสพนักงาน (ไม่ระบุ = ส่งทั้งหมด)"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  ประเภทการแจ้งเตือน
                </label>
                <select
                  id="category"
                  value={currentEntry.category}
                  onChange={(e) =>
                    setCurrentEntry({
                      ...currentEntry,
                      category: e.target.value,
                    })
                  }
                  className="form-select"
                >
                  <option value="">เลือกประเภท</option>
                  <option value="General">ทั่วไป (General)</option>
                  <option value="Work">งาน (Work)</option>
                  <option value="Leave">การลา (Leave)</option>
                  <option value="Overtime">OT (Overtime)</option>
                  <option value="System">ระบบ (System)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  หัวข้อ
                </label>
                <input
                  type="text"
                  id="message"
                  value={currentEntry.message}
                  onChange={(e) =>
                    setCurrentEntry({
                      ...currentEntry,
                      message: e.target.value,
                    })
                  }
                  className="form-input"
                  placeholder="หัวข้อการแจ้งเตือน"
                />
              </div>

              <div>
                <label
                  htmlFor="details"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  รายละเอียด
                </label>
                <textarea
                  id="details"
                  value={currentEntry.details}
                  onChange={(e) =>
                    setCurrentEntry({
                      ...currentEntry,
                      details: e.target.value,
                    })
                  }
                  className="form-input"
                  rows="4"
                  placeholder="รายละเอียดการแจ้งเตือน"
                ></textarea>
              </div>

              <button
                onClick={
                  editingId ? handleUpdateNotification : handleSendNotification
                }
                disabled={isLoading}
                className={`w-full btn btn-primary ${
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
                    กำลังดำเนินการ...
                  </div>
                ) : editingId ? (
                  "อัปเดตการแจ้งเตือน"
                ) : (
                  "ส่งการแจ้งเตือน"
                )}
              </button>

              {editingId && (
                <button
                  onClick={() => {
                    setEditingId(null);
                    setCurrentEntry({ category: "", message: "", details: "" });
                    setEmployeeId("");
                  }}
                  className="w-full btn btn-outline"
                >
                  ยกเลิก
                </button>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div className="lg:col-span-2" variants={itemVariants}>
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-md p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                รายการแจ้งเตือน
              </h2>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="ค้นหาการแจ้งเตือน..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input pl-10 h-10 w-full"
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
                <button
                  onClick={handleDeleteSelectedNotifications}
                  disabled={selectedNotifications.length === 0 || isLoading}
                  className={`btn btn-danger h-10 ${
                    selectedNotifications.length === 0 || isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  ลบที่เลือก ({selectedNotifications.length})
                </button>
              </div>
            </div>

            {isLoading && notifications.length === 0 ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
                    <thead className="bg-gray-50 dark:bg-dark-700">
                      <tr>
                        <th scope="col" className="w-10 px-4 py-3">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-dark-600 dark:bg-dark-800"
                            onChange={handleSelectAll}
                            checked={
                              selectedNotifications.length ===
                                filteredNotifications.length &&
                              filteredNotifications.length > 0
                            }
                          />
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          พนักงาน
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          หัวข้อ
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          ประเภท
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          เวลา
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          จัดการ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                      {currentNotifications.length > 0 ? (
                        currentNotifications.map((notification) => (
                          <tr
                            key={notification._id}
                            className="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                          >
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-dark-600 dark:bg-dark-800"
                                checked={selectedNotifications.includes(
                                  notification._id
                                )}
                                onChange={() =>
                                  handleCheckboxChange(notification._id)
                                }
                              />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {notification.employee_id || "ทั้งหมด"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {notification.message}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                  {notification.details}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(
                                  notification.category
                                )}`}
                              >
                                {getCategoryLabel(notification.category)}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {formatTime(notification.created_at)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() =>
                                  handleEditNotification(notification)
                                }
                                className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 mr-2"
                              >
                                แก้ไข
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteNotification(notification._id)
                                }
                                className="text-danger-600 dark:text-danger-400 hover:text-danger-800 dark:hover:text-danger-300"
                              >
                                ลบ
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                          >
                            {searchTerm
                              ? "ไม่พบการแจ้งเตือนที่ตรงกับคำค้นหา"
                              : "ไม่มีการแจ้งเตือน"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {/* Dynamic Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-4">
                    <nav
                      className="inline-flex space-x-1"
                      aria-label="Pagination"
                    >
                      {/* Previous Button */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md border text-sm ${
                          currentPage === 1
                            ? "text-gray-400 border-gray-300 cursor-not-allowed"
                            : "text-gray-600 dark:text-white border-gray-300 dark:border-dark-600 hover:bg-gray-100 dark:hover:bg-dark-700"
                        }`}
                      >
                        &laquo;
                      </button>

                      {/* Page Numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 2 && page <= currentPage + 2)
                        )
                        .map((page, index, array) => {
                          // Insert dots if needed
                          const prevPage = array[index - 1];
                          const shouldInsertDots =
                            prevPage && page - prevPage > 1;

                          return (
                            <span key={page}>
                              {shouldInsertDots && (
                                <span className="px-2 py-1 text-gray-400">
                                  ...
                                </span>
                              )}
                              <button
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 rounded-md border text-sm ${
                                  currentPage === page
                                    ? "bg-primary-600 text-white border-primary-600"
                                    : "text-gray-600 dark:text-white border-gray-300 dark:border-dark-600 hover:bg-gray-100 dark:hover:bg-dark-700"
                                }`}
                              >
                                {page}
                              </button>
                            </span>
                          );
                        })}

                      {/* Next Button */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-md border text-sm ${
                          currentPage === totalPages
                            ? "text-gray-400 border-gray-300 cursor-not-allowed"
                            : "text-gray-600 dark:text-white border-gray-300 dark:border-dark-600 hover:bg-gray-100 dark:hover:bg-dark-700"
                        }`}
                      >
                        &raquo;
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
          <div
            className={`bg-white dark:bg-dark-800 rounded-lg shadow-lg border ${
              successMessage.includes("Error")
                ? "border-danger-500"
                : "border-green-500"
            } overflow-hidden`}
          >
            <div className="p-4 flex items-start">
              <div className="flex-shrink-0">
                {successMessage.includes("Error") ? (
                  <svg
                    className="h-6 w-6 text-danger-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
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
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {successMessage}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="bg-white dark:bg-dark-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={() => setSuccessMessage("")}
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
  );
};

export default Notifications;
