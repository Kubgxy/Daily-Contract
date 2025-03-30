"use client"

import { createContext, useState, useEffect } from "react"

// สร้าง context สำหรับธีม
export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  // ดึงค่า theme จาก localStorage หรือใช้ค่าเริ่มต้นตาม system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      return savedTheme === "dark"
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  // อัปเดต localStorage และ class ใน document เมื่อ theme เปลี่ยน
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")

    // เพิ่ม/ลบ class 'dark' ใน document.documentElement
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode) // ฟังก์ชันสลับธีม
  }

  return <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>{children}</ThemeContext.Provider>
}

