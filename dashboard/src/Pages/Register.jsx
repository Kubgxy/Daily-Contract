"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import axios from "axios"

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    username: "",
    password: "",
    re_password: "",
    role: "",
    contract_start_date: "",
    contract_end_date: "",
    position: "",
    status: "Active", // Default status
    employeeId: "",
    avatar: null,
    detail: "",
  })
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isGenerated, setIsGenerated] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  // ฟังก์ชันสร้าง Employee ID
  const generateEmployeeId = async () => {
    try {
      setIsSubmitting(true)
      // เรียก API เพื่อดึง Employee ID ล่าสุด
      const response = await axios.get("http://localhost:3000/api/auth/generate-employee-id", { withCredentials: true })
      const newEmployeeId = response.data.employee_id

      if (!newEmployeeId) {
        throw new Error("Invalid employee_id from backend")
      }

      // อัปเดต Employee ID และ Username
      setFormData((prevFormData) => ({
        ...prevFormData,
        employeeId: newEmployeeId,
        username: newEmployeeId, // Username จะเหมือนกับ Employee ID
      }))

      // ตั้งสถานะว่า ID ถูกสร้างสำเร็จ
      setIsGenerated(true)
    } catch (error) {
      console.error("Error generating employee ID:", error)
      setErrorMessage("Failed to generate employee ID. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // เรียกใช้งาน generateEmployeeId ทันทีเมื่อโหลดหน้า
  useEffect(() => {
    generateEmployeeId()
  }, [])

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      avatar: e.target.files[0],
    })
  }

  const validateCurrentStep = () => {
    const errors = {}

    if (currentStep === 1) {
      if (!formData.password) errors.password = "กรุณากรอกรหัสผ่าน"
      if (!formData.re_password) errors.re_password = "กรุณายืนยันรหัสผ่าน"
      else if (formData.password !== formData.re_password) errors.re_password = "รหัสผ่านไม่ตรงกัน"
    } else if (currentStep === 2) {
      if (!formData.first_name) errors.first_name = "กรุณากรอกชื่อ"
      if (!formData.last_name) errors.last_name = "กรุณากรอกนามสกุล"
      if (!formData.email) errors.email = "กรุณากรอกอีเมล"
      else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "รูปแบบอีเมลไม่ถูกต้อง"
      if (!formData.phone_number) errors.phone_number = "กรุณากรอกเบอร์โทรศัพท์"
      if (!formData.address) errors.address = "กรุณากรอกที่อยู่"
    } else if (currentStep === 3) {
      if (!formData.contract_start_date) errors.contract_start_date = "กรุณาเลือกวันเริ่มสัญญา"
      if (!formData.contract_end_date) errors.contract_end_date = "กรุณาเลือกวันสิ้นสุดสัญญา"
      if (!formData.position) errors.position = "กรุณาเลือกตำแหน่ง"
      if (formData.position && !formData.detail) errors.detail = "กรุณาเลือกรายละเอียดงาน"
      if (!formData.role) errors.role = "กรุณาเลือกบทบาท"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error when field is changed
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined,
      })
    }
  }

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateCurrentStep()) {
      return
    }

    setOpenConfirmDialog(true)
  }

  const confirmRegistration = async () => {
    setOpenConfirmDialog(false)
    setIsSubmitting(true)

    // สร้าง FormData สำหรับการส่งข้อมูลพร้อมไฟล์
    const data = new FormData()
    data.append("employee_id", formData.employeeId)
    data.append("first_name", formData.first_name)
    data.append("last_name", formData.last_name)
    data.append("email", formData.email)
    data.append("phone_number", formData.phone_number)
    data.append("address", formData.address)
    data.append("username", formData.username) // ส่ง username
    data.append("password", formData.password)
    data.append("role", formData.role)
    data.append("contract_start_date", formData.contract_start_date)
    data.append("contract_end_date", formData.contract_end_date)
    data.append("position", formData.position)
    data.append("detail", formData.detail)

    if (formData.avatar) {
      data.append("avatar", formData.avatar)
    }

    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }, { withCredentials: true })

      setSuccessMessage("ลงทะเบียนสำเร็จ")
      setOpenDialog(true) // แสดง Dialog สำเร็จ
    } catch (error) {
      if (error.response) {
        setErrorMessage("Error: " + error.response.data.message || "Failed to register")
      } else if (error.request) {
        setErrorMessage("No response from server")
      } else {
        setErrorMessage("Error: " + error.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    window.location.reload() // รีโหลดหน้า
  }

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false)
  }

  // เก็บตัวเลือกของ Detail ตามตำแหน่ง
  const positionDetails = {
    ProductionManager: [
      "วางแผนการผลิต",
      "ควบคุมคุณภาพ",
      "จัดการทรัพยากร",
      "ตรวจสอบกระบวนการผลิต",
      "จัดทำรายงานการผลิต",
    ],
    ProductionStaff: [
      "ผลิตสินค้า",
      "ตรวจสอบคุณภาพเบื้องต้น",
      "จัดเตรียมวัตถุดิบ",
      "บำรุงรักษาเครื่องจักร",
      "จัดเก็บสินค้า",
    ],
    SalesManager: [
      "วางแผนการขาย",
      "พัฒนากลยุทธ์การขาย",
      "จัดการทีมขาย",
      "วิเคราะห์ตลาด",
      "จัดทำรายงานยอดขาย",
    ],
    SalesStaff: [
      "ติดต่อลูกค้า",
      "จัดทำใบเสนอราคา",
      "ติดตามการส่งมอบ",
      "บันทึกข้อมูลการขาย",
      "ดูแลความพึงพอใจลูกค้า",
    ],
    QCManager: [
      "วางแผนการควบคุมคุณภาพ",
      "จัดทำมาตรฐานการตรวจสอบ",
      "ตรวจประเมินคุณภาพ",
      "จัดการระบบ QC",
      "จัดทำรายงาน QC",
    ],
    QCStaff: [
      "ตรวจสอบคุณภาพสินค้า",
      "เก็บตัวอย่างทดสอบ",
      "บันทึกผลการตรวจสอบ",
      "ควบคุมเอกสาร QC",
      "ตรวจสอบวัตถุดิบ",
    ],
  }

  // ฟังก์ชันจัดการการเปลี่ยนค่าของตำแหน่ง
  const handlePositionChange = (e) => {
    const selectedPosition = e.target.value
    setFormData({
      ...formData,
      position: selectedPosition,
      detail: "", // รีเซ็ตฟิลด์ Detail เมื่อเปลี่ยนตำแหน่ง
    })

    // Clear position error
    if (formErrors.position) {
      setFormErrors({
        ...formErrors,
        position: undefined,
      })
    }
  }

  return (
    <div className="w-full p-6 md:p-8">
      <div className="bg-primary-600 dark:bg-primary-700 p-6 rounded-t-xl">
        <h1 className="text-2xl font-bold text-white">ลงทะเบียนพนักงานใหม่</h1>
        <p className="text-primary-100 mt-1">กรอกข้อมูลให้ครบถ้วนเพื่อลงทะเบียนพนักงานใหม่เข้าสู่ระบบ</p>
      </div>

      <div className="bg-white dark:bg-dark-800 p-6 rounded-b-xl shadow-md">
        {errorMessage && (
          <div className="mb-6 p-4 bg-danger-50 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400 rounded-lg">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errorMessage}
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-400 rounded-lg">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {successMessage}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employee ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">รหัสพนักงาน</label>
                <div className="relative">
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    disabled
                    className="form-input bg-gray-50 dark:bg-dark-700 cursor-not-allowed"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ชื่อผู้ใช้</label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    disabled
                    className="form-input bg-gray-50 dark:bg-dark-700 cursor-not-allowed"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isGenerated && (
            <>
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">รหัสผ่าน</label>
                      <div className="relative">
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`form-input ${formErrors.password ? "border-danger-500 dark:border-danger-500" : ""}`}
                          placeholder="กรอกรหัสผ่าน"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      {formErrors.password && (
                        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{formErrors.password}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">รหัสผ่านต้องมีตัวอักษรพิมพ์เล็ก, พิมพ์ใหญ่ และตัวเลข อย่างน้อย 6 ตัว</p>
                    </div>

                    {/* Re-Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ยืนยันรหัสผ่าน
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          name="re_password"
                          value={formData.re_password}
                          onChange={handleChange}
                          className={`form-input ${formErrors.re_password ? "border-danger-500 dark:border-danger-500" : ""}`}
                          placeholder="ยืนยันรหัสผ่าน"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      {formErrors.re_password && (
                        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{formErrors.re_password}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">ยืนยันรหัสผ่านต้องตรงกับรหัสผ่าน</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ชื่อ</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className={`form-input ${formErrors.first_name ? "border-danger-500 dark:border-danger-500" : ""}`}
                        placeholder="กรอกชื่อ"
                      />
                      {formErrors.first_name && (
                        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{formErrors.first_name}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">นามสกุล</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className={`form-input ${formErrors.last_name ? "border-danger-500 dark:border-danger-500" : ""}`}
                        placeholder="กรอกนามสกุล"
                      />
                      {formErrors.last_name && (
                        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{formErrors.last_name}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">อีเมล</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-input ${formErrors.email ? "border-danger-500 dark:border-danger-500" : ""}`}
                        placeholder="กรอกอีเมล"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                    </div>
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      เบอร์โทรศัพท์
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className={`form-input ${formErrors.phone_number ? "border-danger-500 dark:border-danger-500" : ""}`}
                        placeholder="กรอกเบอร์โทรศัพท์"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                    </div>
                    {formErrors.phone_number && (
                      <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{formErrors.phone_number}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ที่อยู่</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`form-input ${formErrors.address ? "border-danger-500 dark:border-danger-500" : ""}`}
                      placeholder="กรอกที่อยู่"
                      rows={3}
                    ></textarea>
                    {formErrors.address && (
                      <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{formErrors.address}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contract Start Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        วันที่เริ่มสัญญา
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="contract_start_date"
                          value={formData.contract_start_date}
                          onChange={handleChange}
                          className={`form-input ${formErrors.contract_start_date ? "border-danger-500 dark:border-danger-500" : ""}`}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      {formErrors.contract_start_date && (
                        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
                          {formErrors.contract_start_date}
                        </p>
                      )}
                    </div>

                    {/* Contract End Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        วันที่สิ้นสุดสัญญา
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="contract_end_date"
                          value={formData.contract_end_date}
                          onChange={handleChange}
                          className={`form-input ${formErrors.contract_end_date ? "border-danger-500 dark:border-danger-500" : ""}`}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      {formErrors.contract_end_date && (
                        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
                          {formErrors.contract_end_date}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Position */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ตำแหน่ง</label>
                      <div className="relative">
                        <select
                          name="position"
                          value={formData.position}
                          onChange={handlePositionChange}
                          className={`form-select ${formErrors.position ? "border-danger-500 dark:border-danger-500" : ""}`}
                        >
                          <option value="">เลือกตำแหน่ง</option>
                          {Object.keys(positionDetails).map((pos) => (
                            <option key={pos} value={pos}>{pos}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      {formErrors.position && (
                        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{formErrors.position}</p>
                      )}
                    </div>

                    {/* Detail */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        รายละเอียดงาน
                      </label>
                      <div className="relative">
                        <select
                          name="detail"
                          value={formData.detail}
                          onChange={handleChange}
                          disabled={!formData.position}
                          className={`form-select ${formErrors.detail ? "border-danger-500 dark:border-danger-500" : ""} ${!formData.position ? "bg-gray-50 dark:bg-dark-700 cursor-not-allowed" : ""}`}
                        >
                          <option value="">เลือกรายละเอียดงาน</option>
                          {formData.position &&
                            positionDetails[formData.position]?.map((detail, index) => (
                              <option key={index} value={detail}>
                                {detail}
                              </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      {formErrors.detail && (
                        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{formErrors.detail}</p>
                      )}
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">บทบาท</label>
                    <div className="relative">
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className={`form-select ${formErrors.role ? "border-danger-500 dark:border-danger-500" : ""}`}
                      >
                        <option value="">เลือกบทบาท</option>
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    {formErrors.role && (
                      <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{formErrors.role}</p>
                    )}
                  </div>

                  {/* Avatar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      รูปโปรไฟล์ (ไม่บังคับ)
                    </label>
                    <div className="mt-1 flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center overflow-hidden border border-gray-300 dark:border-dark-600">
                        {formData.avatar ? (
                          <img
                            src={URL.createObjectURL(formData.avatar) || "/placeholder.svg"}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        )}
                      </div>
                      <label className="ml-5 bg-white dark:bg-dark-700 py-2 px-3 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer">
                        <span>อัปโหลดรูปภาพ</span>
                        <input
                          type="file"
                          name="avatar"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      รองรับไฟล์ JPG, PNG หรือ GIF ขนาดไม่เกิน 2MB
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step Navigation */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <button type="button" onClick={handlePrevStep} className="btn btn-outline">
                    ย้อนกลับ
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < totalSteps ? (
                  <button type="button" onClick={handleNextStep} className="btn btn-primary">
                    ถัดไป
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn btn-primary ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {isSubmitting ? (
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
                        กำลังลงทะเบียน...
                      </div>
                    ) : (
                      "ลงทะเบียนพนักงาน"
                    )}
                  </button>
                )}
              </div>

              {/* Step Indicator */}
              <div className="mt-6">
                <div className="flex justify-between">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep > index + 1
                            ? "bg-primary-600 text-white"
                            : currentStep === index + 1
                              ? "bg-primary-100 text-primary-600 border-2 border-primary-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                      >
                        {currentStep > index + 1 ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span className="text-xs mt-1">
                        {index === 0 ? "รหัสผ่าน" : index === 1 ? "ข้อมูลส่วนตัว" : "ข้อมูลการทำงาน"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="relative mt-2">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-between">
                    {Array.from({ length: totalSteps }).map((_, index) => (
                      <div key={index} className={`w-1/3 ${index < totalSteps - 1 ? "pr-2" : ""}`}>
                        <div className={`h-1 ${currentStep > index + 1 ? "bg-primary-600" : "bg-gray-200"}`}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </form>
      </div>

      {/* Confirmation Dialog */}
      {openConfirmDialog && (
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
            <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-dark-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/30 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary-600 dark:text-primary-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      ยืนยันการลงทะเบียน
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        คุณต้องการลงทะเบียนพนักงานใหม่ใช่หรือไม่? กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนยืนยัน
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-dark-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmRegistration}
                >
                  ยืนยัน
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-dark-600 shadow-sm px-4 py-2 bg-white dark:bg-dark-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCloseConfirmDialog}
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog */}
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
            <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-dark-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-success-100 dark:bg-success-900/30 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-success-600 dark:text-success-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      ลงทะเบียนสำเร็จ
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ลงทะเบียนพนักงานใหม่เรียบร้อยแล้ว ระบบจะรีเฟรชหน้าเพื่อลงทะเบียนพนักงานคนต่อไป
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-dark-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCloseDialog}
                >
                  ตกลง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Register

