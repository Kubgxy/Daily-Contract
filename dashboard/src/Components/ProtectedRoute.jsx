"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import PropTypes from "prop-types"

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const expirationTime = localStorage.getItem("tokenExpiration")

  useEffect(() => {
    // ตรวจสอบ token และเวลาหมดอายุ
    if (!token || !expirationTime || new Date() > new Date(expirationTime)) {
      // ลบ token และ expiration จาก localStorage
      localStorage.removeItem("token")
      localStorage.removeItem("tokenExpiration")

      // Redirect ไปที่หน้า Login โดยใช้ navigate
      navigate("/login", { replace: true })
    }
  }, [navigate, token, expirationTime])

  // แสดง children ถ้า token ยังใช้งานได้
  return token ? children : null
}

// กำหนด PropTypes สำหรับ children
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ProtectedRoute

