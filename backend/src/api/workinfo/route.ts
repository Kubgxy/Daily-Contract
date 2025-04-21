import express from "express";
import WorkInfo from "../../models/WorkInfo";
import Notification from "../../models/Notification";
import Employee from "../../models/Employee";
import moment from "moment";
import { verifyToken } from "../../middleware/verifyToken";
import { requireManagerOrAdmin } from "../../middleware/requireManagerOrAdmin";
import { io , onlineUsers } from "../../app";

const workinfo = express.Router();
workinfo.use(verifyToken);

// ✅ ฝังรายการ task ตามตำแหน่ง
const positionTasks = {
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

// 1. API สำหรับพนักงานบันทึกการทำงาน
workinfo.post("/recordwork", verifyToken, async (req, res) => {
  console.log("✅ req.user:", req.user); // ตรวจสอบ token ที่ถอดออกแล้ว

  try {
    const {
      detail_work,
      position,
      task,
      hours,
      status = "Pending",
      note = "",
    } = req.body;

    // ✅ ดึง employee_id จาก token ที่ verify แล้ว
    const employee_id = req.user?.employee_id;

    if (!employee_id || !position || !task || !hours) {
      return res.status(400).json({
        status: "error",
        message: "กรุณากรอกข้อมูลให้ครบถ้วน",
      });
    }

    // ตรวจสอบตำแหน่ง
    const validPositions = Object.keys(positionTasks);
    const validStatuses = ["Pending", "Success", "Fail"];

    if (!validPositions.includes(position)) {
      return res.status(400).json({
        status: "error",
        message: "ตำแหน่งไม่ถูกต้อง",
      });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: "error",
        message: "สถานะไม่ถูกต้อง",
      });
    }

    // ตรวจสอบชั่วโมงการทำงาน
    if (hours < 0.5 || hours > 7) {
      return res.status(400).json({
        status: "error",
        message: "ชั่วโมงการทำงานต้องอยู่ระหว่าง 0.5 - 7 ชั่วโมง",
      });
    }


    const workLog = new WorkInfo({
      employee_id,
      work_date: new Date(),
      detail_work,
      position,
      task,
      hours,
      status,
      note,
    });

    await workLog.save();

    res.status(201).json({
      status: "success",
      message: "บันทึกข้อมูลสำเร็จ",
      data: workLog,
    });
  } catch (error: unknown) {
  const err = error as { code?: number; message?: string; stack?: string };

  if (err.code === 11000) {
    return res.status(400).json({
      status: "error",
      message: "คุณได้บันทึกข้อมูลการทำงานของวันนี้ไปแล้ว",
    });
  }

  console.error("🔥 Record Error:", err.message, err.stack);

  res.status(500).json({
    status: "error",
    message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
  });
  }
});

// 2. API สำหรับพนักงานดูประวัติการทำงานของตัวเอง
workinfo.get("/my-records", verifyToken, async (req, res) => {
  const employee_id = req.user?.employee_id;
  try {
    const records = await WorkInfo.find({
      employee_id,
    }).sort({ work_date: -1 });

    res.json({
      status: "success",
      data: records,
    });
  } catch (error: unknown) {
  const err = error as { code?: number; message?: string; stack?: string };

  if (err.code === 11000) {
    return res.status(400).json({
      status: "error",
      message: "คุณได้บันทึกข้อมูลการทำงานของวันนี้ไปแล้ว",
    });
  }

  console.error("🔥 Record Error:", err.message, err.stack);

  res.status(500).json({
    status: "error",
    message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
  });
  }
  });
// 3. API สำหรับแอดมินดูข้อมูลทั้งหมด
workinfo.get("/admin/all-records", requireManagerOrAdmin, async (req, res) => {
  try {
    const { work_date, position, status } = req.query;

    const query: {
      work_date?: {
        $gte: Date;
        $lte: Date;
      };
      position?: string;
      status?: string;
    } = {};

    if (work_date) {
      const startOfDay = moment(work_date as string, "YYYY-MM-DD").startOf(
        "day"
      );
      const endOfDay = moment(work_date as string, "YYYY-MM-DD").endOf("day");

      query.work_date = {
        $gte: startOfDay.toDate(),
        $lte: endOfDay.toDate(),
      };
    }

    if (position) {
      query.position = position as string;
    }

    if (status) {
      query.status = status as string;
    }

    const records = await WorkInfo.find(query).sort({ work_date: -1 });

    res.json({
      status: "success",
      data: records,
    });
  } catch (error: unknown) {
  const err = error as { code?: number; message?: string; stack?: string };

  if (err.code === 11000) {
    return res.status(400).json({
      status: "error",
      message: "คุณได้บันทึกข้อมูลการทำงานของวันนี้ไปแล้ว",
    });
  }

  console.error("🔥 Record Error:", err.message, err.stack);

  res.status(500).json({
    status: "error",
    message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
  });
  }
  });

// 4. API สำหรับ Manager ดูประวัติการทำงาน
workinfo.get("/manager/records", requireManagerOrAdmin, async (req, res) => {
  try {
    const managerPosition = req.user?.position;

    if (!managerPosition) {
      return res.status(400).json({ message: "ไม่พบตำแหน่งของผู้ใช้" });
    }

    // ดึงคำขอของพนักงานที่อยู่แผนกเดียวกันเท่านั้น
    const records = await WorkInfo.find({ position: { $regex: managerPosition.replace("Manager", "") } });

    return res.status(200).json({
      status: "success",
      data: records,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการโหลดข้อมูล" });
  }
});

// 5. API สำหรับ Manager, Admin อนุมัติการทำงาน
workinfo.patch("/approve/:id", requireManagerOrAdmin, async (req, res) => {
  console.log("📥 ได้รับคำขออนุมัติ:", req.params.id);
  try {
    const reportId = req.params.id;

    const work = await WorkInfo.findOne({ report_id: reportId });
    if (!work) return res.status(404).json({ message: "ไม่พบรายการงานนี้" });

    // ดึงข้อมูลพนักงานเจ้าของงาน
    const employee = await Employee.findOne({ employee_id: work.employee_id });
    if (!employee) return res.status(404).json({ message: "ไม่พบพนักงาน" });

    // เช็คว่าตำแหน่งตรงกัน
    if (req.user?.role === "Manager" && employee.position !== req.user.position) {
      return res.status(403).json({ message: "ไม่สามารถปฏิเสธงานของตำแหน่งอื่นได้" });
    }

    work.status = "Success";
    console.log("📌 work.status ก่อนบันทึก:", work.status);
    await work.save();
    console.log("✅ บันทึกสถานะงานเรียบร้อย");

    // สร้าง Notification
    await Notification.create({
      employee_id: work.employee_id,
      category: "อนุมัติการทำงาน",
      message: `งาน "${work.task}" ของคุณได้รับการอนุมัติแล้ว`,
      details: `โดยผู้จัดการตำแหน่ง: `,
    });

    const socketId = onlineUsers.get(work.employee_id);
    if (socketId) {
      io.to(socketId).emit("notify", {
        title: work.status === "Success" ? "ได้รับการอนุมัติ" : "งานถูกปฏิเสธ",
        message: work.status === "Success"
          ? `งาน "${work.task}" ของคุณได้รับการอนุมัติแล้ว`
          : `งาน "${work.task}" ของคุณถูกปฏิเสธ`,
      });
    }

    return res.status(200).json({ 
      status: "success", 
      message: "อัปเดตสถานะเรียบร้อยแล้ว" 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
});

// 6. API สำหรับ Manager, Admin ปฏิเสธการทำงาน
workinfo.patch("/reject/:id", requireManagerOrAdmin , async (req, res) => {
  try {
    const reportId = req.params.id;
    const { note } = req.body; // note เป็น optional

    const work = await WorkInfo.findOne({ report_id: reportId });
    if (!work) return res.status(404).json({ message: "ไม่พบรายการงานนี้" });

    const employee = await Employee.findOne({ employee_id: work.employee_id });
    if (!employee) return res.status(404).json({ message: "ไม่พบพนักงาน" });

    if (req.user?.role === "Manager" && employee.position !== req.user.position) {
      return res.status(403).json({ message: "ไม่สามารถปฏิเสธงานของตำแหน่งอื่นได้" });
    }

    work.status = "Fail";
    if (note) {
      work.note_from_manager = note;
    }
    await work.save();

    await Notification.create({
      employee_id: work.employee_id,
      category: "ปฏิเสธการทำงาน",
      message: `งาน "${work.task}" ของคุณถูกปฏิเสธ`,
      details: note || "ไม่มีหมายเหตุเพิ่มเติม",
    });

    const socketId = onlineUsers.get(work.employee_id);
    if (socketId) {
      io.to(socketId).emit("notify", {
        title: work.status === "Success" ? "ได้รับการอนุมัติ" : "งานถูกปฏิเสธ",
        message: work.status === "Success"
          ? `งาน "${work.task}" ของคุณได้รับการอนุมัติแล้ว`
          : `งาน "${work.task}" ของคุณถูกปฏิเสธ`,
      });
    }

    return res.status(200).json({ 
      message: "ปฏิเสธงานเรียบร้อย", 
      status: "fail" 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
});

export default workinfo;
