import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  LucidePlusCircle,
  LucideAlertCircle,
  LucideCheckCircle,
  FileText,
} from "lucide-react";
import Navbar from "./../Components/Navbar";
import RequestDetailsModal from "./../Components/RequestDetailsModal";
import "./../index.css";
import baseURL from '../utils/api';

function RequestForm() {
  const [formType, setFormType] = useState("");
  const [formData, setFormData] = useState({});
  const [requests, setRequests] = useState([]);
  const [employeeId, setEmployeeId] = useState({ employee_id: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleDetailsClick = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  function getStatusClass(status) {
    switch (status) {
      case "Approved":
        return "border-l-green-500";
      case "Pending":
        return "border-l-yellow-500";
      case "Rejected":
        return "border-l-red-500";
      default:
        return "border-l-blue-500";
    }
  }

  function getStatusTextColor(status) {
    switch (status) {
      case "Approved":
        return "text-green-600";
      case "Pending":
        return "text-yellow-600";
      case "Rejected":
        return "text-red-600";
      default:
        return "text-gray-700";
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <LucideCheckCircle className="text-green-600" />;
      case "Pending":
        return <LucideAlertCircle className="text-yellow-600" />;
      case "Rejected":
        return <LucidePlusCircle className="text-red-600" />;
      default:
        return null;
    }
  };

  // เพิ่มใน useEffect
  useEffect(() => {
    fetchEmployeeId(); // ✅ ดึง employee_id แยก
    fetchRequests(); // ✅ โหลดรายการคำขอ
  }, []);

  // ✅ แยกฟังก์ชันดึง employee_id
  const fetchEmployeeId = async () => {
    try {
      const meRes = await axios.get(
        `${baseURL}/api/auth/employees/me`,
        { withCredentials: true }
      );
      const employeeId = meRes.data.employee_id;
      setEmployeeId({ employee_id: employeeId });
    } catch (error) {
      console.error("Error fetching employee info:", error);
    }
  };

  // ✅ แยกฟังก์ชันโหลดรายการคำขอ
  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/requests/getRequests`,
        { withCredentials: true }
      );
      setRequests(response.data.data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleFormChange = (e) => {
    const selectedFormType = e.target.value;
    setFormType(selectedFormType);
    setFormData({
      ...formData,
      leave_type: selectedFormType === "leaveRequest" ? "sick" : "",
      start_time: selectedFormType === "overtimeRequest" ? "17:00" : "",
      end_time: selectedFormType === "overtimeRequest" ? "18:00" : "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validateFormData = () => {
    if (formType === "leaveRequest") {
      const { leave_type, start_date, end_date, reason } = formData;
      if (!leave_type || !start_date || !end_date || !reason) {
        setErrorMessage("กรุณากรอกข้อมูลการลาให้ครบถ้วน");
        return false;
      }
    } else if (formType === "overtimeRequest") {
      const { overtime_date, start_time, end_time, reason } = formData;
      if (!overtime_date || !start_time || !end_time || !reason) {
        setErrorMessage("กรุณากรอกข้อมูลการทำงานล่วงเวลาให้ครบถ้วน");
        return false;
      }
    } else if (formType === "workInfoRequest") {
      const {
        original_check_in,
        original_check_out,
        corrected_check_in,
        corrected_check_out,
        reason,
      } = formData;
      if (
        !original_check_in ||
        !original_check_out ||
        !corrected_check_in ||
        !corrected_check_out ||
        !reason
      ) {
        setErrorMessage("กรุณากรอกข้อมูลการแก้ไขการทำงานให้ครบถ้วน");
        return false;
      }
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFormData()) return;

    const formDataToSend = new FormData();
    formDataToSend.append("type", formType);
    formDataToSend.append("employee_id", employeeId.employee_id);
    Object.keys(formData).forEach((key) => {
      if (key === "attachment") {
        formDataToSend.append(key, formData[key]);
      } else {
        formDataToSend.append(`details[${key}]`, formData[key]);
      }
    });

    try {
      const result = await Swal.fire({
        title: "ยืนยันการส่งคำขอ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
      });

      if (!result.isConfirmed) {
        await Swal.fire("ยกเลิก", "การส่งคำขอถูกยกเลิก", "info");
        return;
      }

      // ✅ ไม่มี token แล้ว! ใช้ cookie อย่างเดียว
      const response = await axios.post(
        `${baseURL}/api/requests/formRequest`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // ✅ แนบ cookie ไปให้ backend ตรวจ
        }
      );

      if (response.data.status === "Success") {
        await Swal.fire("สำเร็จ!", "คำขอถูกส่งสำเร็จ", "success");
        // setRequests([...requests, response.data.data]);

        // ✅ ดึงคำขอใหม่ทั้งหมดแทนการ push
        try {
          await fetchRequests();
        } catch (error) {
          console.error("Reload requests failed:", error);
        } // <--- เรียก useEffect ใหม่ (หรือแยกฟังก์ชัน fetchRequest มาใช้ตรงนี้ก็ได้)

        setFormData({});
        setFormType("");
        setErrorMessage("");
      } else {
        await Swal.fire(
          "ล้มเหลว",
          response.data.data?.msg || "Failed to submit request",
          "error"
        );
        setErrorMessage(response.data.data?.msg || "Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      await Swal.fire("ล้มเหลว", "ไม่สามารถส่งคำขอได้", "error");
      setErrorMessage("ไม่สามารถส่งคำขอได้");
    }
  };

  const sortedRequests = [...requests].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="bg-white lg:h-[800px] lg:w-[1000px] lg:mx-auto mx-5 mt-5 p-5 rounded-xl shadow-lg overflow-y-auto scrollbar-custom">
        <h3 className="text-4xl font-bold text-center text-blue-700 mb-8 flex items-center justify-center">
          <FileText className="w-8 h-8 mr-2" />
          ยื่นคำขอ
        </h3>
        <div className="space-y-8">
          <div>
            <label className="block text-lg text-gray-700 mb-2">
              <LucidePlusCircle className="inline mr-2 text-blue-700" />
              เลือกประเภทฟอร์ม:
            </label>
            <select
              id="formType"
              value={formType}
              onChange={handleFormChange}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- เลือกประเภทฟอร์ม --</option>
              <option value="leaveRequest">แบบฟอร์มขอลาหยุด</option>
              <option value="overtimeRequest">แบบฟอร์มขอทำงานล่วงเวลา</option>
              <option value="workInfoRequest">
                แบบฟอร์มขอแก้ไขข้อมูลการทำงาน
              </option>
            </select>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {formType === "leaveRequest" && (
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h4 className="text-xl font-medium mb-4">การขอลาหยุด</h4>
                <label className="block mb-2">ประเภทการลา:</label>
                <select
                  name="leave_type"
                  value={formData.leave_type || ""}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  required
                >
                  <option value="">-- เลือกประเภทการลา --</option>
                  <option value="Sick leave">ลาป่วย</option>
                  <option value="Annual leave">ลาพักร้อน</option>
                  <option value="Personal leave">ลากิจ</option>
                </select>

                <label className="block mt-4 mb-2">วันที่เริ่มลา:</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date || ""}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  required
                />

                <label className="block mt-4 mb-2">วันที่สิ้นสุดการลา:</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date || ""}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  required
                />

                <label className="block mt-4 mb-2">เหตุผลการลา:</label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason || ""}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
            )}

            {formType === "overtimeRequest" && (
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h4 className="text-xl font-medium mb-4">การขอทำงานล่วงเวลา</h4>
                <label className="block mb-2">วันที่ทำการขอทำ OT:</label>
                <input
                  type="date"
                  name="overtime_date"
                  value={formData.overtime_date || ""}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  required
                />

                <label className="block mt-4 mb-2">เวลาที่เริ่มทำ:</label>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time || "17:00"}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  required
                />

                <label className="block mt-4 mb-2">เวลาที่สิ้นสุด:</label>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time || "18:00"}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  required
                />

                <label className="block mt-4 mb-2">เหตุผลการขอทำ OT:</label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason || ""}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
            )}

            {formType === "workInfoRequest" && (
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h4 className="text-xl font-medium mb-4">
                  การขอแก้ไขข้อมูลการทำงาน
                </h4>
                <label className="block mb-2">เวลาเข้าเดิม:</label>
                <input
                  type="datetime-local"
                  name="original_check_in"
                  value={formData.original_check_in || ""}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  required
                />

                <label className="block mt-4 mb-2">เวลาออกเดิม:</label>
                <input
                  type="datetime-local"
                  name="original_check_out"
                  value={formData.original_check_out || ""}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  required
                />

                <label className="block mt-4 mb-2">เวลาเข้าที่แก้ไข:</label>
                <input
                  type="datetime-local"
                  name="corrected_check_in"
                  value={formData.corrected_check_in || ""}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  required
                />

                <label className="block mt-4 mb-2">เวลาออกที่แก้ไข:</label>
                <input
                  type="datetime-local"
                  name="corrected_check_out"
                  value={formData.corrected_check_out || ""}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  required
                />

                <label className="block mt-4 mb-2">เหตุผลการขอแก้ไข:</label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason || ""}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
              ส่งคำขอ
            </button>
          </form>

          {errorMessage && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md shadow-md">
              <LucideAlertCircle className="inline mr-2" />
              {errorMessage}
            </div>
          )}

          <div className="h-[500px] mt-8 p-2 overflow-y-auto scrollbar-custom">
            <h4 className="text-2xl font-semibold mb-4">คำขอล่าสุด</h4>
            {sortedRequests?.map((request, index) => (
              <div
                key={request._id || index}
                className={`p-4 mb-4 bg-gray-50 rounded-lg shadow-md border-l-4 ${getStatusClass(
                  request.status
                )}`}
              >
                <h5 className="text-lg font-medium mb-2">
                  คำขอประเภท: {request.type}
                </h5>
                <div className="text-sm mb-1 flex items-center">
                  {getStatusIcon(request.status)}
                  <span className="text-gray-700 ml-2">สถานะ:</span>
                  <span
                    className={`ml-1 ${getStatusTextColor(request.status)}`}
                  >
                    {request.status}
                  </span>
                </div>

                <p className="text-sm text-gray-700">
                  วันที่ส่ง:{" "}
                  {new Date(request.created_at).toLocaleDateString("th-TH")}
                </p>

                <button
                  onClick={() => handleDetailsClick(request)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  ดูรายละเอียด
                </button>
              </div>
            ))}

            <RequestDetailsModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              request={selectedRequest}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestForm;
