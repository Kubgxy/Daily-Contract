"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Profile = () => {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    position: "",
    employee_id: "",
    type_contract: "",
    contract_start_date: "",
    contract_end_date: "",
    avatar: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableFields, setEditableFields] = useState({
    phone_number: "",
    address: "",
  });

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);

        const response = await axios.get("http://localhost:3000/api/auth/employees/me", {
          withCredentials: true,
        });

        const employee = response.data;

        setProfile({
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          phone_number: employee.phone_number,
          address: employee.address,
          position: employee.position,
          employee_id: employee.employee_id,
          type_contract: employee.type_contract,
          contract_start_date: employee.contract_start_date
            ? new Date(employee.contract_start_date).toISOString().split("T")[0]
            : "",
          contract_end_date: employee.contract_end_date
            ? new Date(employee.contract_end_date).toISOString().split("T")[0]
            : "",
          avatar: employee.avatar || "/default-avatar.png",
        });

        setEditableFields({
          phone_number: employee.phone_number || "",
          address: employee.address || "",
        });

        setProfileImage(employee.avatar ? `http://localhost:3000${employee.avatar}` : "/default-avatar.png");
      } catch (err) {
        console.error("Error fetching profile data:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);

      const response = await axios.patch("http://localhost:3000/api/data/settings", editableFields, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setProfile({
          ...profile,
          phone_number: editableFields.phone_number,
          address: editableFields.address,
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        setIsEditing(false);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (err) {
      console.error("Error saving profile:", err.message);
      setError(err.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
        return;
      }

      const formData = new FormData();
      formData.append("attachment", file);

      try {
        setLoading(true);

        const response = await axios.post("http://localhost:3000/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });

        const avatarPath = response.data.data.path.replace("http://localhost:3000", "");
        setProfileImage(response.data.data.path);

        await axios.patch("http://localhost:3000/api/data/settings", {
          avatar: response.data.data.path,
        }, {
          withCredentials: true,
        });

        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (error) {
        console.error("Error uploading image:", error.response?.data || error.message);
        setError("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
        setTimeout(() => setError(""), 3000);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset to original values
      setEditableFields({
        phone_number: profile.phone_number,
        address: profile.address,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "ไม่ระบุ";
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  if (loading && !profile.employee_id) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-dark-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        className="text-2xl font-bold text-gray-800 dark:text-white mb-6"
        variants={itemVariants}
      >
        ข้อมูลโปรไฟล์
      </motion.h1>

      {error && (
        <motion.div
          className="mb-6 p-4 bg-danger-50 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400 rounded-lg"
          variants={itemVariants}
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        </motion.div>
      )}

      {success && (
        <motion.div
          className="mb-6 p-4 bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-400 rounded-lg"
          variants={itemVariants}
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            บันทึกข้อมูลสำเร็จ!
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="w-full md:col-span-1 bg-white dark:bg-dark-800 rounded-xl shadow-md p-6 flex flex-col items-center"
          variants={itemVariants}
        >
          <div className="relative mb-4">
            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-primary-100 dark:border-primary-900/30">
              <img
                src={profileImage || "/default-avatar.png"}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {profile.first_name} {profile.last_name}
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {profile.position}
          </p>

          <div className="mt-6 w-full">
            <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 mb-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                รหัสพนักงาน
              </p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {profile.employee_id}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                อีเมล
              </p>
              <p className="text-base text-gray-900 dark:text-white truncate" title={profile.email}>
                {profile.email}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="md:col-span-2 bg-white dark:bg-dark-800 rounded-xl shadow-md p-6"
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              รายละเอียดส่วนตัว
            </h2>
            <button
              onClick={handleEditToggle}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${isEditing
                  ? "bg-gray-200 text-gray-800 dark:bg-dark-700 dark:text-gray-300"
                  : "bg-primary-600 text-white hover:bg-primary-700"
                } transition-colors`}
            >
              {isEditing ? "ยกเลิก" : "แก้ไข"}
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  ชื่อ
                </label>
                <input
                  type="text"
                  value={profile.first_name}
                  disabled
                  className="form-input bg-gray-50 dark:bg-dark-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  นามสกุล
                </label>
                <input
                  type="text"
                  value={profile.last_name}
                  disabled
                  className="form-input bg-gray-50 dark:bg-dark-700 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                เบอร์โทรศัพท์
              </label>
              <input
                type="text"
                name="phone_number"
                value={
                  isEditing ? editableFields.phone_number : profile.phone_number
                }
                onChange={handleChange}
                disabled={!isEditing}
                className={`form-input ${!isEditing
                    ? "bg-gray-50 dark:bg-dark-700 cursor-not-allowed"
                    : ""
                  }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                ที่อยู่
              </label>
              <textarea
                name="address"
                value={isEditing ? editableFields.address : profile.address}
                onChange={handleChange}
                disabled={!isEditing}
                rows="3"
                className={`form-input ${!isEditing
                    ? "bg-gray-50 dark:bg-dark-700 cursor-not-allowed"
                    : ""
                  }`}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  ประเภทสัญญา
                </label>
                <input
                  type="text"
                  value={profile.type_contract || "ไม่ระบุ"}
                  disabled
                  className="form-input bg-gray-50 dark:bg-dark-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  ตำแหน่ง
                </label>
                <input
                  type="text"
                  value={profile.position}
                  disabled
                  className="form-input bg-gray-50 dark:bg-dark-700 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  วันที่เริ่มสัญญา
                </label>
                <input
                  type="text"
                  value={formatDate(profile.contract_start_date)}
                  disabled
                  className="form-input bg-gray-50 dark:bg-dark-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  วันที่สิ้นสุดสัญญา
                </label>
                <input
                  type="text"
                  value={formatDate(profile.contract_end_date)}
                  disabled
                  className="form-input bg-gray-50 dark:bg-dark-700 cursor-not-allowed"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                  {loading ? (
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
                      กำลังบันทึก...
                    </div>
                  ) : (
                    "บันทึกข้อมูล"
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;
