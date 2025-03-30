"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { motion } from "framer-motion"

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [viewDetailsDialogOpen, setViewDetailsDialogOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")

  // Load employees and check contract status
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/data/getEmployees", {
          withCredentials: true
        });
  
        const data = response.data;
        setEmployees(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setLoading(false);
      }
    };
  
    fetchEmployees();
  }, []);  

  const handleEditClick = (employee) => {
    const employeeData = {
      ...employee,
      contract_start_date: employee.contract_start_date.split("T")[0],
      contract_end_date: employee.contract_end_date.split("T")[0],
    }
    setEditFormData(employeeData)
    setEditDialogOpen(true)
  }

  const handleEditCancel = () => {
    setEditDialogOpen(false)
    setEditFormData({})
  }

  const handleEditSave = async () => {
    try {
      const today = new Date()
      const newContractEndDate = new Date(editFormData.contract_end_date)

      if (newContractEndDate > today) {
        editFormData.status = "Active"
      }

      const response = await axios.put(
        `http://localhost:3000/api/data/updateEmployee/${editFormData._id}`,
        editFormData,
        { withCredentials: true }
      )

      setEmployees((prevEmployees) => prevEmployees.map((e) => (e._id === editFormData._id ? response.data : e)))
      setSuccessMessage(`ข้อมูลพนักงาน ${editFormData.first_name} ถูกแก้ไขแล้ว`)
      setEditDialogOpen(false)
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      console.error("Error updating employee:", error)
      alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูลพนักงาน")
    }
  }

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/data/deleteEmployee/${selectedEmployee._id}`, {
        withCredentials: true
      })

      setEmployees((prevEmployees) => prevEmployees.filter((e) => e._id !== selectedEmployee._id))
      setSuccessMessage(`พนักงาน ${selectedEmployee.first_name} ถูกลบแล้ว`)
      setDeleteDialogOpen(false)
      setSelectedEmployee(null)
    } catch (error) {
      console.error("Error deleting employee:", error)
      alert("เกิดข้อผิดพลาดในการลบข้อมูลพนักงาน")
    }
  }

  const Details = {
    Admin: [{ value: "ดูแลระบบและการเข้าถึงข้อมูลในระบบ", label: "ดูแลระบบและการเข้าถึงข้อมูลในระบบ" }],
    HR: [{ value: "จัดทำเอกสารเกี่ยวกับทรัพยากรบุคคล", label: "จัดทำเอกสารเกี่ยวกับทรัพยากรบุคคล" }],
    Manager: [{ value: "บริหารทีมงาน", label: "บริหารทีมงาน" }],
    Employee: [
      { value: "พนักงานฝ่ายผลิต", label: "พนักงานฝ่ายผลิต" },
      { value: "พนักงานฝ่ายควบคุมคุณภาพ", label: "พนักงานฝ่ายควบคุมคุณภาพ" },
      { value: "พนักงานฝ่ายบรรจุภัณฑ์", label: "พนักงานฝ่ายบรรจุภัณฑ์" },
      { value: "พนักงานฝ่ายขนส่ง", label: "พนักงานฝ่ายขนส่ง" },
      { value: "พนักงานฝ่ายซ่อมบำรุง", label: "พนักงานฝ่ายซ่อมบำรุง" },
    ],
  }

  // Position options for dropdown
  const Position = [
    { value: "Admin", label: "แอดมิน" },
    { value: "HR", label: "ฝ่ายบุคคล" },
    { value: "Manager", label: "ผู้จัดการ" },
    { value: "Employee", label: "พนักงาน" },
  ]

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setSelectedEmployee(null)
  }

  const handleViewDetailsClick = (employee) => {
    setSelectedEmployee(employee)
    setViewDetailsDialogOpen(true)
  }

  const handleViewDetailsClose = () => {
    setViewDetailsDialogOpen(false)
    setSelectedEmployee(null)
  }

  const handleCloseSnackbar = () => {
    setSuccessMessage("")
  }

  // Filter employees based on search term and status
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "All" || employee.status === filterStatus

    return matchesSearch && matchesStatus
  })

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

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Inactive":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPositionLabel = (position) => {
    const foundPosition = Position.find((p) => p.value === position)
    return foundPosition ? foundPosition.label : position
  }

  return (
    <motion.div className="p-6 max-w-7xl mx-auto" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div
        className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        variants={itemVariants}
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">รายชื่อพนักงาน</h1>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="ค้นหาพนักงาน..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 h-10 w-full sm:w-64"
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
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="form-select h-10">
            <option value="All">ทั้งหมด</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
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
                  ตำแหน่ง
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  สัญญา
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
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium">
                          {employee.first_name ? employee.first_name.charAt(0) : ""}
                          {employee.last_name ? employee.last_name.charAt(0) : ""}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {employee.first_name} {employee.last_name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{employee.employee_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{getPositionLabel(employee.position)}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{employee.detail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <div>เริ่ม: {formatDate(employee.contract_start_date)}</div>
                        <div>สิ้นสุด: {formatDate(employee.contract_end_date)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(employee.status)} text-white`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetailsClick(employee)}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 mr-3"
                      >
                        ดูข้อมูล
                      </button>
                      <button
                        onClick={() => handleEditClick(employee)}
                        className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 mr-3"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDeleteClick(employee)}
                        className="text-danger-600 dark:text-danger-400 hover:text-danger-800 dark:hover:text-danger-300"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    ไม่พบข้อมูลพนักงาน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Dialog for viewing employee details */}
      {viewDetailsDialogOpen && (
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
              <div className="bg-white dark:bg-dark-800 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white" id="modal-title">
                    รายละเอียดพนักงาน
                  </h3>
                  <button
                    onClick={handleViewDetailsClose}
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

                {selectedEmployee && (
                  <div className="divide-y divide-gray-200 dark:divide-dark-700">
                    <div className="flex items-center gap-4 pb-4">
                      <div className="h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xl font-medium">
                        {selectedEmployee.first_name ? selectedEmployee.first_name.charAt(0) : ""}
                        {selectedEmployee.last_name ? selectedEmployee.last_name.charAt(0) : ""}
                      </div>
                      <div>
                        <h4 className="text-xl font-medium text-gray-900 dark:text-white">
                          {selectedEmployee.first_name} {selectedEmployee.last_name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {getPositionLabel(selectedEmployee.position)}
                        </p>
                      </div>
                    </div>

                    <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">รหัสพนักงาน</p>
                        <p className="text-base text-gray-900 dark:text-white">{selectedEmployee.employee_id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ชื่อผู้ใช้</p>
                        <p className="text-base text-gray-900 dark:text-white">{selectedEmployee.username}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">อีเมล</p>
                        <p className="text-base text-gray-900 dark:text-white">{selectedEmployee.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">เบอร์โทรศัพท์</p>
                        <p className="text-base text-gray-900 dark:text-white">{selectedEmployee.phone_number}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ที่อยู่</p>
                        <p className="text-base text-gray-900 dark:text-white">{selectedEmployee.address}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">วันที่เริ่มสัญญา</p>
                        <p className="text-base text-gray-900 dark:text-white">
                          {formatDate(selectedEmployee.contract_start_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">วันที่สิ้นสุดสัญญา</p>
                        <p className="text-base text-gray-900 dark:text-white">
                          {formatDate(selectedEmployee.contract_end_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">สถานะ</p>
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedEmployee.status)} text-white mt-1`}
                        >
                          {selectedEmployee.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">รายละเอียดงาน</p>
                        <p className="text-base text-gray-900 dark:text-white">{selectedEmployee.detail}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:w-auto"
                    onClick={handleViewDetailsClose}
                  >
                    ปิด
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {editDialogOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-dark-900 dark:bg-opacity-75"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-dark-800 p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">แก้ไขข้อมูลพนักงาน</h3>

                <div className="space-y-4">
                  {/* ชื่อ */}
                  <div>
                    <label className="block text-sm text-gray-300">ชื่อ</label>
                    <input
                      type="text"
                      className="form-input w-full"
                      value={editFormData.first_name}
                      onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
                    />
                  </div>

                  {/* นามสกุล */}
                  <div>
                    <label className="block text-sm text-gray-300">นามสกุล</label>
                    <input
                      type="text"
                      className="form-input w-full"
                      value={editFormData.last_name}
                      onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
                    />
                  </div>

                  {/* เบอร์โทร */}
                  <div>
                    <label className="block text-sm text-gray-300">เบอร์โทร</label>
                    <input
                      type="tel"
                      className="form-input w-full"
                      value={editFormData.phone_number}
                      onChange={(e) => setEditFormData({ ...editFormData, phone_number: e.target.value })}
                    />
                  </div>

                  {/* อีเมล */}
                  <div>
                    <label className="block text-sm text-gray-300">อีเมล</label>
                    <input
                      type="email"
                      className="form-input w-full"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    />
                  </div>

                  {/* ที่อยู่ */}
                  <div>
                    <label className="block text-sm text-gray-300">ที่อยู่</label>
                    <textarea
                      className="form-input w-full"
                      value={editFormData.address}
                      onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    />
                  </div>

                  {/* ตำแหน่ง */}
                  <div>
                    <label className="block text-sm text-gray-300">ตำแหน่ง</label>
                    <select
                      className="form-select w-full"
                      value={editFormData.position}
                      onChange={(e) => setEditFormData({ ...editFormData, position: e.target.value, detail: "" })}
                    >
                      {Position.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* รายละเอียด */}
                  <div>
                    <label className="block text-sm text-gray-300">รายละเอียด</label>
                    <select
                      className="form-select w-full"
                      value={editFormData.detail}
                      onChange={(e) => setEditFormData({ ...editFormData, detail: e.target.value })}
                    >
                      {Details[editFormData.position]?.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* วันที่เริ่ม - สิ้นสุด */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300">วันที่เริ่มสัญญา</label>
                      <input
                        type="date"
                        className="form-input w-full"
                        value={editFormData.contract_start_date}
                        onChange={(e) => setEditFormData({ ...editFormData, contract_start_date: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300">วันที่สิ้นสุดสัญญา</label>
                      <input
                        type="date"
                        className="form-input w-full"
                        value={editFormData.contract_end_date}
                        onChange={(e) => setEditFormData({ ...editFormData, contract_end_date: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleEditCancel}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleEditSave}
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialog for delete confirmation */}
      {deleteDialogOpen && (
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
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-danger-100 dark:bg-danger-900/30 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-danger-600 dark:text-danger-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      ยืนยันการลบข้อมูล
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        คุณต้องการลบพนักงาน {selectedEmployee?.first_name} {selectedEmployee?.last_name} ใช่หรือไม่?
                        การกระทำนี้ไม่สามารถเรียกคืนได้
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-dark-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-danger-600 text-base font-medium text-white hover:bg-danger-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteConfirm}
                >
                  ลบ
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-dark-600 shadow-sm px-4 py-2 bg-white dark:bg-dark-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteCancel}
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="inline-flex items-center gap-3 px-4 py-3 bg-white dark:bg-dark-800 text-sm text-green-600 dark:text-green-400 border border-green-500 rounded-lg shadow-md transition-all duration-300 max-w-sm sm:max-w-md md:max-w-lg">
            <svg
              className="h-5 w-5 flex-shrink-0"
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
            <p className="flex-1">
              {successMessage}
            </p>
            <button
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
              onClick={handleCloseSnackbar}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default Employees

