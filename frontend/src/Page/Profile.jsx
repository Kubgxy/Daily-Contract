import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./../Components/Navbar";
import {
  Bell, Mail, Phone, Building2,
  BadgeCheck, ChartNoAxesCombined, Eye
} from "lucide-react";
import baseURL from '../utils/api';

import "./../index.css";

function Profile() {
  const [employee, setEmployee] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/api/auth/employees/me`,
          { withCredentials: true }
        );
        setEmployee(res.data);
        console.log("API Response:", res.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/api/data/getNotifications`,
          { withCredentials: true }
        );
        setNotifications(res.data.data);
        console.log("API Response:", res.data.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchEmployeeData();
    fetchNotifications();
    setLoading(false);
  }, []);

  const unreadCount = notifications.filter(
    (notification) => notification.is_read === "unread"
  ).length;

  const markAsReadAndNavigate = async (id) => {
    try {
      await axios.patch(
        `${baseURL}/api/data/markAsRead/${id}`,
        {},
        { withCredentials: true }
      );
      navigate("/notifications", { state: { notificationId: id } });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (loading) {
    return <p className="mt-20 text-center text-gray-500">รอสักครู่ . . .</p>;
  }

  if (!employee) {
    return <p className="mt-20 text-center text-red-500">รอสักครู่ . . .</p>;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 ">
            <div className="bg-white rounded-xl shadow-lg text-center h-[780px] overflow-hidden">
              <div className="bg-gradient-to-b from-blue-500 to-blue-150 h-[300px]"></div>{" "}
              <div className="px-6 pb-6">
                <div className="relative -mt-16 mb-4">
                  {" "}
                  <img
                    src={
                      employee.avatar
                        ? `${baseURL}${employee.avatar}`
                        : "/api/placeholder/128/128"
                    }
                    alt="Avatar"
                    className="w-48 h-48 rounded-full border-[5px] border-blue-300 mx-auto my-[-100px] object-cover shadow-lg mb-6" /* ลดขนาดรูปจาก w-60 h-60 เป็น w-48 h-48 */
                  />
                </div>

                <div className="text-center mb-4">
                  {" "}
                  <h2 className="text-2xl font-bold text-gray-800">
                    {employee.first_name} {employee.last_name}
                  </h2>
                  <div className="flex items-center justify-center space-x-2 mt-5">
                    {" "}
                    <BadgeCheck className="w-5 h-5 text-blue-500" />
                    <p className="text-xl text-gray-600">
                      {employee.position} | {employee.employee_id}
                    </p>
                  </div>
                </div>
                <div className="w-[300px] h-[1px] bg-blue-200 mx-auto my-4"></div>
                <div className="space-y-3 text-xl mt-[20px]">
                  {" "}
                  <div className="flex items-center justify-center space-x-3">
                    <Building2 className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-600">{employee.address}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-600">
                      {employee.email || "example@company.com"}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-600">
                      {employee.phone_number || "xxx-xxx-xxxx"}
                    </span>
                  </div>
                </div>
              </div>
              <footer className="footer mt-8 text-gray-400 text-sm ">
                <p>© 2025 Daily Contract System. All rights reserved.</p>
              </footer>
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 h-[350px] w-full lg:h-[400px] lg:w-[1000px] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-6 h-6 text-blue-500" />
                    <h2 className="text-2xl font-bold text-gray-800">
                      Notifications
                    </h2>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                    <span className="font-semibold">{unreadCount}</span> unread
                  </div>
                </div>

                <div className="scrollbar-custom overflow-y-auto flex-1 pr-2">
                  <div className="space-y-4">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`p-6 rounded-lg border-l-4 transition-all hover:shadow-md ${
                            notification.is_read === "unread"
                              ? "bg-blue-50 border-l-red-500"
                              : "bg-gray-50 border-l-green-400"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                                {notification.title}
                              </h3>
                              <p className="text-gray-600">
                                {notification.message}
                              </p>
                            </div>
                            {/* ปรับให้ปุ่มแสดงตลอด */}
                            <button
                              onClick={() =>
                                markAsReadAndNavigate(notification._id)
                              }
                              className="w-[40px] h-[40px] bg-blue-500 text-white rounded-lg flex justify-center items-center hover:bg-blue-600 transition-colors text-sm font-semibold whitespace-nowrap"
                            >
                              <Eye className="w-6 h-6" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg">No notifications available.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Work Status Section */}
            <div className="work-status h-[333px] bg-white rounded-xl shadow-lg p-6 max-w-xl mx-auto mt-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center w-[350px]">
                  Work Status{" "}
                  <ChartNoAxesCombined className="inline-block ml-2 text-blue-500" />
                </h1>
              </div>
              <div className="grid grid-cols-1 gap-y-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600">
                    ตำแหน่งงาน:
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {employee.position}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600">
                    รายละเอียดของงาน:
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {employee.detail}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600">
                    สถานะปัจจุบัน:
                  </span>
                  <span
                    className={`text-lg font-semibold ${
                      employee.status === "Active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {employee.status}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600">
                    ประเภทสัญญา:
                  </span>
                  <span className="text-gray-800">
                    <span className="font-semibold">
                      {employee.type_contract}
                    </span>
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600">
                    สถานะสัญญา:
                  </span>
                  <span className="text-gray-800">
                    <span className="text-green-600 font-semibold">
                      {employee.contract_start_date.slice(0, 10)}
                    </span>{" "}
                    -{" "}
                    <span className="text-red-600 font-semibold">
                      {employee.contract_end_date.slice(0, 10)}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Chatbot Section */}
            <div className="chatbot h-auto w-full lg:h-[333px] lg:w-[580px] mt-6 lg:ml-[170px] bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
                Chatbot Assistant
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg h-24 overflow-y-auto">
                <p className="text-sm text-gray-600">
                  สวัสดี! ฉันคือผู้ช่วยเสมือนของคุณ 🚀
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  ฉันสามารถช่วยตอบคำถามและให้ข้อมูลที่เป็นประโยชน์แก่คุณได้
                </p>
              </div>
              <input
                type="text"
                placeholder="พิมพ์ข้อความ..."
                className="mt-4 w-full p-3 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
              />
              <button className="mt-4 w-full py-3 bg-blue-500 text-white rounded-lg">
                ส่งข้อความ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
