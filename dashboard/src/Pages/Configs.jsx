"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { motion } from "framer-motion"

const LocationSetting = () => {
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [radius, setRadius] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/worklocation/location", {
          withCredentials: true
        })
        const { latitude, longitude, radius } = res.data
        setLatitude(latitude)
        setLongitude(longitude)
        setRadius(radius)
      } catch (err) {
        console.error("❌ Load location error:", err)
        Swal.fire("ผิดพลาด", "โหลดข้อมูลไม่สำเร็จ", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchLocation()
  }, [])

  const handleSave = async () => {
    try {
      const payload = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius: parseInt(radius)
      }

      await axios.patch("http://localhost:3000/api/worklocation/configlocation", payload, {
        withCredentials: true
      })

      Swal.fire("สำเร็จ", "อัปเดตข้อมูลสถานที่สำเร็จ", "success")
    } catch (err) {
      console.error("❌ Update error:", err)
      Swal.fire("ผิดพลาด", "ไม่สามารถอัปเดตข้อมูลได้", "error")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 bg-white dark:bg-dark-800 rounded-xl shadow-md mt-[120px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">ตั้งค่าสถานที่ทำงาน</h2>

      <div className="space-y-4 ">
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300">Latitude</label>
          <input
            type="number"
            step="0.000001"
            className="form-input w-full"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300">Longitude</label>
          <input
            type="number"
            step="0.000001"
            className="form-input w-full"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300">Radius (เมตร)</label>
          <input
            type="number"
            className="form-input w-full"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
          />
        </div>

        <div className="pt-4">
          <button
            onClick={handleSave}
            className="btn btn-primary w-full sm:w-auto"
          >
            บันทึกการตั้งค่า
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default LocationSetting
