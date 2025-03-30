import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const RenewalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRenewalRequests = async () => {
    try {
      const me = await axios.get("http://localhost:3000/api/auth/employees/me", {
        withCredentials: true,
      })
      
      if (me.data.role === "Admin") {
        const res = await axios.get("http://localhost:3000/api/renewal/renewal-requests",
            {
          withCredentials: true,
        });
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error("❌ Failed to fetch renewal requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRenewalRequests();
  }, []);

  const handleApprove = async (id) => {
    const confirm = await Swal.fire({
      title: "ยืนยันการต่อสัญญา?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#22c55e",
    });
    if (!confirm.isConfirmed) return;

    try {
      await axios.patch(`http://localhost:3000/api/renewal/renewal-approve/${id}`, {}, {
        withCredentials: true,
      });
      Swal.fire("สำเร็จ", "ต่อสัญญาแล้ว", "success");
      fetchRenewalRequests();
    } catch (err) {
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถต่อสัญญาได้", "error");
    }
  };

  const handleReject = async (id) => {
    const confirm = await Swal.fire({
      title: "ยืนยันการปฏิเสธการต่อสัญญา?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#ef4444",
    });
    if (!confirm.isConfirmed) return;

    try {
      await axios.patch(`http://localhost:3000/api/renewal/renewal-reject/${id}`, {}, {
        withCredentials: true,
      });
      Swal.fire("สำเร็จ", "ปฏิเสธการต่อสัญญาแล้ว", "success");
      fetchRenewalRequests();
    } catch (err) {
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถปฏิเสธการต่อสัญญาได้", "error");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        คำขอต่อสัญญา
      </h1>

      {loading ? (
        <p>กำลังโหลด...</p>
      ) : requests.length === 0 ? (
        <p>ไม่มีคำขอต่อสัญญา</p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-dark-800 shadow rounded-xl">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  รหัสพนักงาน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ชื่อ - นามสกุล
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ตำแหน่ง
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  สัญญาเดิมสิ้นสุด
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {requests.map((emp) => (
                <tr key={emp._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {emp.employee_id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {emp.first_name} {emp.last_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {emp.position}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {new Date(emp.contract_end_date).toLocaleDateString("th-TH")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleApprove(emp._id)}
                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
                      >
                        อนุมัติ
                      </button>
                      <button
                        onClick={() => handleReject(emp._id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                      >
                        ปฏิเสธ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RenewalRequests;
