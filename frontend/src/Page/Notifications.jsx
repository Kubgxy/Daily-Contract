import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Bell, ChevronDown, ChevronUp, Check, Clock } from "lucide-react";
import Navbar from "./../Components/Navbar";
import "./../index.css";
import baseURL from '../utils/api';
import { useNotification } from '../Context/NotificationContext';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const notificationId = location.state?.notificationId || null;

  const { setUnreadCount } = useNotification();

  // ✅ เมื่อเข้าหน้า notifications ให้รีเซ็ต badge ทันที
  useEffect(() => {
    setUnreadCount(0);
  }, [setUnreadCount]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/data/getNotifications`,
          { withCredentials: true }
        );

        setNotifications(response.data.data);
        setLoading(false);

        if (notificationId) {
          setExpandedId(notificationId);
        }

        // ✅ ตรวจสอบว่ามีกี่รายการที่ยังไม่อ่าน แล้ว sync ไปยัง Context
        const unreadCount = response.data.data.filter(
          (n) => n.is_read !== "read"
        ).length;
        setUnreadCount(unreadCount);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [notificationId, setUnreadCount]);

  const markAsRead = async (id) => {
    try {
      if (!id) return;
      await axios.patch(
        `${baseURL}/api/data/markAsRead/${id}`,
        {},
        { withCredentials: true }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, is_read: "read" } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch(`${baseURL}/api/data/markAllAsRead`, {}, { withCredentials: true });
  
      // ✅ อัปเดต State ทั้งหมด
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: "read" }))
      );
  
      // ✅ เคลียร์ badge
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };
  

  const toggleExpand = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <Clock className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="mt-4 text-lg text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-7">
        <div className="bg-white h-[800px] mt-10 rounded-xl shadow-lg">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6 text-blue-500" />
              <h1 className="text-2xl font-semibold text-blue-700">
                การแจ้งเตือน
              </h1>
            </div>
          </div>
  
          {/* Notifications List */}
          <div className="bg-gray-50 p-5 divide-y divide-gray-100 h-[680px] rounded-b-[10px] overflow-y-auto scrollbar-custom">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-lg text-gray-500">ไม่มีการแจ้งเตือน</p>
              </div>
            ) : (
              <>
                {/* ✅ ปุ่มทำเครื่องหมายว่าอ่านแล้วทั้งหมด */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={markAllAsRead}
                    className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all"
                  >
                    📥 ทำเครื่องหมายว่าอ่านแล้วทั้งหมด
                  </button>
                </div>
  
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`w-full p-6 mx-auto mt-4 border-gray-100 rounded-[10px] transition-all duration-200 ${
                      notification.is_read === "read"
                        ? "bg-green-100 hover:bg-green-400"
                        : "bg-red-100 hover:bg-red-400"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {notification.category}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-gray-500">
                          {notification.message.length > 40
                            ? `${notification.message.substring(0, 40)}...`
                            : notification.message}
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                          {notification.timeAgo}
                        </p>
                      </div>
  
                      <button
                        onClick={() => markAsRead(notification._id)}
                        disabled={notification.is_read === "read"}
                        className={`ml-4 p-2 rounded-full transition-colors duration-200 ${
                          notification.is_read === "read"
                            ? "bg-green-200 text-green-500 cursor-default"
                            : "bg-red-200 text-blue-500 hover:bg-blue-200"
                        }`}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
  
                    {/* Expanded Content */}
                    {expandedId === notification._id && (
                      <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200">
                        <p className="text-gray-600">{notification.details}</p>
                      </div>
                    )}
  
                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => {
                        markAsRead(notification._id);
                        toggleExpand(notification._id);
                      }}
                      className="mt-4 flex items-center text-sm text-blue-500 hover:text-blue-600 transition-colors duration-200"
                    >
                      {expandedId === notification._id ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1" /> ซ่อนข้อมูล
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" /> ดูเพิ่มเติม...
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

Notifications.propTypes = {
  setNotificationCount: PropTypes.func,
};

export default Notifications;
