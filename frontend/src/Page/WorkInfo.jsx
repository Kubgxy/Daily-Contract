import React, { useState, useEffect } from "react";
import {
  Briefcase,
  FolderGit2,
  CheckCircle2,
  Clock3,
  CircleAlert,
  AlignCenter,
} from "lucide-react";
import Navbar from "./../Components/Navbar";
import axios from "axios";
import baseURL from '../utils/api';
import Swal from "sweetalert2";

const WorkLogging = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userDepartment, setUserDepartment] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [detailwork, setDetailWork] = useState("");
  const [workHours, setWorkHours] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [workRecords, setWorkRecords] = useState([]);
  const [activeTab, setActiveTab] = useState("record");
  const [note, setNote] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [inProgressJobs, setInProgressJobs] = useState(0);
  const [completedJobs, setCompletedJobs] = useState(0);
  const [expandedRecordId, setExpandedRecordId] = useState(null);

  const positionTasks = {
    ProductionManager: [
      "วางแผนการผลิต",
      "ควบคุมคุณภาพ",
      "จัดการทรัพยากร",
      "ตรวจสอบกระบวนการผลิต",
      "จัดทำรายงานการผลิต",
      "อื่นๆ...",
    ],
    ProductionStaff: [
      "ผลิตสินค้า",
      "ตรวจสอบคุณภาพเบื้องต้น",
      "จัดเตรียมวัตถุดิบ",
      "บำรุงรักษาเครื่องจักร",
      "จัดเก็บสินค้า",
      "อื่นๆ...",
    ],
    SalesManager: [
      "วางแผนการขาย",
      "พัฒนากลยุทธ์การขาย",
      "จัดการทีมขาย",
      "วิเคราะห์ตลาด",
      "จัดทำรายงานยอดขาย",
      "อื่นๆ...",
    ],
    SalesStaff: [
      "ติดต่อลูกค้า",
      "จัดทำใบเสนอราคา",
      "ติดตามการส่งมอบ",
      "บันทึกข้อมูลการขาย",
      "ดูแลความพึงพอใจลูกค้า",
      "อื่นๆ...",
    ],
    QCManager: [
      "วางแผนการควบคุมคุณภาพ",
      "จัดทำมาตรฐานการตรวจสอบ",
      "ตรวจประเมินคุณภาพ",
      "จัดการระบบ QC",
      "จัดทำรายงาน QC",
      "อื่นๆ...",
    ],
    QCStaff: [
      "ตรวจสอบคุณภาพสินค้า",
      "เก็บตัวอย่างทดสอบ",
      "บันทึกผลการตรวจสอบ",
      "ควบคุมเอกสาร QC",
      "ตรวจสอบวัตถุดิบ",
      "อื่นๆ...",
    ],
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/auth/employees/me`,
          { withCredentials: true }
        );
        setUserInfo(response.data);
        setUserDepartment(response.data.position);

        const recordsResponse = await axios.get(
          `${baseURL}/api/workinfo/my-records`,
          { withCredentials: true }
        );
        setWorkRecords(recordsResponse.data.data);
        const pending = recordsResponse.data.data.filter(
          (r) => r.status === "Pending"
        ).length;
        const success = recordsResponse.data.data.filter(
          (r) => r.status === "Success"
        ).length;
        setInProgressJobs(pending);
        setCompletedJobs(success);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedTask || !workHours) {
      Swal.fire({
        icon: "warning",
        title: "กรอกข้อมูลไม่ครบ",
        text: "กรุณากรอกข้อมูลให้ครบถ้วนก่อนส่ง",
      });
      return;
    }
  
    if (note.length > 300) {
      Swal.fire({
        icon: "error",
        title: "หมายเหตุยาวเกินไป",
        text: "หมายเหตุต้องไม่เกิน 300 ตัวอักษร",
      });
      return;
    }
  
    const confirmResult = await Swal.fire({
      title: "ยืนยันการบันทึก?",
      text: "คุณต้องการบันทึกข้อมูลการทำงานใช่หรือไม่",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    });
  
    if (!confirmResult.isConfirmed) return;
  
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${baseURL}/api/workinfo/recordwork`,
        {
          position: userDepartment,
          task: selectedTask,
          detail_work: `ทำงาน${detailwork}`,
          note: note,
          hours: parseFloat(workHours),
          status: "Pending",
        },
        { withCredentials: true }
      );
  
      if (response.data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "บันทึกสำเร็จ",
          text: "ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว",
          timer: 2000,
          showConfirmButton: false,
        });
  
        // reset form
        setSelectedTask("");
        setDetailWork("");
        setWorkHours("");
        setNote("");
  
        // reload records
        const recordsResponse = await axios.get(
          `${baseURL}/api/workinfo/my-records`,
          { withCredentials: true }
        );
        setWorkRecords(recordsResponse.data.data);
        const pending = recordsResponse.data.data.filter(
          (r) => r.status === "Pending"
        ).length;
        const success = recordsResponse.data.data.filter(
          (r) => r.status === "Success"
        ).length;
        setInProgressJobs(pending);
        setCompletedJobs(success);
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
      });
    } finally {
      setIsSubmitting(false);
    }
  };  

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto mt-5 px-4">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Clock3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-800">Work Info</h1>
                <span className="text-gray-500 text-base">บันทึกการทำงาน</span>
              </div>
              {userInfo && (
                <p className="text-blue-600">ตำแหน่ง: {userInfo.position}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6  w-[700px] ">
            <div className="bg-gray-100 p-6 rounded-xl shadow-sm ">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">กำลังดำเนินการ</p>
                  <h3 className="text-2xl font-bold text-yellow-600">
                    {inProgressJobs}
                  </h3>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <FolderGit2 className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">เสร็จสิ้น</p>
                  <h3 className="text-2xl font-bold text-green-600">
                    {completedJobs}
                  </h3>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 max-w-full h-[590px]  gap-4 bg-white p-6 rounded-xl shadow-sm ">
              {/* ส่วนซ้าย - เมนู */}
              <div className="col-span-3 space-y-2 bg-white pt-6 h-[430px] rounded-xl shadow-sm">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    เลือกหัวข้อ
                  </h2>
                  <AlignCenter className="w-5 h-5" />
                </div>
                <button
                  onClick={() => setActiveTab("record")}
                  className={`w-full px-4 py-3 text-left rounded-lg transition-colors ${activeTab === "record"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  บันทึกข้อมูลการทำงาน
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`w-full px-4 py-3 text-left rounded-lg transition-colors ${activeTab === "history"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  ประวัติการบันทึก
                </button>
              </div>

              {/* ส่วนขวา - เนื้อหา */}
              <div className="col-span-9 bg-white p-6 h-[430px]   border-l border-gray-200 ">
                {activeTab === "record" ? (
                  <>
                    {/* หัวข้อ */}

                    <div className="mb-6 relative">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                          บันทึกการทำงานประจำวัน
                        </h2>
                        <div className="relative">
                          <CircleAlert
                            onClick={() => setShowTooltip(!showTooltip)}
                            className="w-5 h-5 text-blue-700 cursor-pointer hover:text-blue-900 transition-colors"
                          />

                          {/* Tooltip */}
                          {showTooltip && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-blue-50 p-4 rounded-lg shadow-lg z-10">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-lg font-semibold text-blue-700">
                                  คำแนะนำ
                                </h3>
                              </div>
                              <ul className="text-sm text-blue-600 space-y-1">
                                <li>• กรุณาบันทึกข้อมูลการทำงานทุกวัน</li>
                                <li>• ระบุจำนวนชั่วโมงตามความเป็นจริง</li>
                                <li>• หากมีงานพิเศษให้ระบุในช่องหมายเหตุ</li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600">
                        วันที่{" "}
                        {new Date().toLocaleDateString("th-TH", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {/* คำแนะนำ */}

                    <form onSubmit={handleSubmit} className="space-y-6 ">
                      {/* ฟอร์มบันทึก */}
                      <div className="grid grid-cols-2 gap-6">
                        {/* เลือกงาน */}
                        <div>
                          <label className="text-gray-700 mb-2 block">
                            งาน*
                          </label>
                          <p className="text-sm text-gray-500 mb-2">
                            เลือกงานที่คุณทำในวันนี้
                          </p>
                          <div className="relative">
                            <select
                              value={selectedTask}
                              onChange={(e) => setSelectedTask(e.target.value)}
                              className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              required
                            >
                              <option value="">เลือกงาน</option>
                              {userDepartment &&
                                positionTasks[userDepartment]?.map((task) => (
                                  <option key={task} value={task}>
                                    {task}
                                  </option>
                                ))}
                            </select>
                            <Briefcase className="absolute right-7 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                          </div>
                        </div>

                        {/* จำนวนชั่วโมง */}
                        <div>
                          <label className="text-gray-700 mb-2 block">
                            จำนวนชั่วโมง*
                          </label>
                          <p className="text-sm text-gray-500 mb-2">
                            ระบุจำนวนชั่วโมงที่ใช้ในการทำงาน (0.5 - 7 ชั่วโมง)
                          </p>
                          <div className="relative">
                            <input
                              type="number"
                              value={workHours}
                              onChange={(e) => setWorkHours(e.target.value)}
                              min="0.5"
                              max="24"
                              step="0.5"
                              className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              required
                              placeholder="ระบุจำนวนชั่วโมง"
                            />
                            <Clock3 className="absolute right-9 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      {/* รายละเอียดการทำงาน */}
                      <div>
                        <label className="text-gray-700 mb-2 block">
                          รายละเอียดการทำงาน
                        </label>
                        <div className="relative">
                          <textarea
                            value={detailwork}
                            onChange={(e) => {
                              // จำกัดความยาวไม่เกิน 300 ตัวอักษร
                              if (e.target.value.length <= 20000) {
                                setDetailWork(e.target.value);
                              }
                            }}
                            className={`w-[850px] h-[80px] px-4 py-4  bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500
        resize-none overflow-auto break-words whitespace-pre-wrap
        ${detailwork ? "text-left" : "text-center pt-[30px]"}`}
                            placeholder="เพิ่มหมายเหตุเพิ่มเติม (ไม่บังคับ)"
                          />
                          <div
                            className={`absolute bottom-2 right-2 text-sm 
        ${detailwork.length > 250 ? "text-red-500" : "text-gray-500"}
      `}
                          >
                            {detailwork.length}/300
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-700 mb-2 block">
                          หมายเหตุ
                        </label>
                        <div className="relative">
                              <input
                                value={note}
                                onChange={(e) => {
                                  setNote(e.target.value);
                                }}
                                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                              </input>
                        </div>
                      </div>

                      {/* ปุ่มดำเนินการ */}
                      <div className="flex items-center justify-end space-x-4">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTask("");
                            setWorkHours("");
                            setDetailWork("");
                            setNote("");
                          }}
                          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                        >
                          ยกเลิก
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2 disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5" />
                          )}
                          <span>
                            {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                          </span>
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  // หน้าประวัติการทำงาน
                  <>
                    <div className="mb-6 ">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2 ">
                        ประวัติการทำงาน
                      </h2>
                      <p className="text-gray-600">
                        ประวัติการบันทึกการทำงานทั้งหมดของคุณ
                      </p>
                    </div>

                    <div className="space-y-4 max-h-[430px] overflow-y-auto">
                      {workRecords.map((record) => (
                        <div
                          key={record.report_id}
                          className="bg-gray-100 p-4 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-800">
                              {record.task}
                            </h3>
                            <div className="text-right ">
                              <span className="text-sm text-gray-500 block">
                                {new Date(record.work_date).toLocaleDateString(
                                  "th-TH"
                                )}
                              </span>
                              <span className="text-sm text-gray-500 block">
                                เวลา {""}
                                {new Date(record.work_date).toLocaleTimeString(
                                  "th-TH",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}{" "}
                                นาที
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            {record.detail_work}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">
                              {record.hours} ชั่วโมง
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ml-[-590px]
                                     ${record.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : record.status === "Success"
                                    ? "bg-green-100 text-green-600"
                                    : record.status === "Fail"
                                      ? "bg-red-100 text-red-600"
                                      : ""
                                }`}
                            >
                              {record.status}
                            </span>
                            <button
                              onClick={() =>
                                setExpandedRecordId(
                                  expandedRecordId === record.report_id
                                    ? null
                                    : record.report_id
                                )
                              }
                              className="px-2 py-1 text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              {expandedRecordId === record.report_id
                                ? "ซ่อนรายละเอียด"
                                : "ดูรายละเอียด"}
                            </button>
                          </div>
                          {expandedRecordId === record.report_id && (
                            <div className="mt-3 p-3 bg-white rounded-lg space-y-2">
                              {record.note && (
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-medium text-gray-700">
                                    หมายเหตุ:
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {record.note}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkLogging;
