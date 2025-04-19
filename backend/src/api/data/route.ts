import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import moment from "moment-timezone";
import path from "path";
import multer from "multer";
import bcrypt from "bcryptjs";
//Models
import Employee from "../../models/Employee";
import Attendance from "../../models/Attendance";
import Notification from "../../models/Notification";
import Requests from "../../models/Request";
import Payroll from "../../models/Payroll";
import Overtime from "../../models/Overtime";
import LeaveRecords from "../../models/LeaveRequest";
import WorkInfo from "../../models/WorkInfo";
//Middleware
import { verifyToken } from "../../middleware/verifyToken";

const data = express.Router();
data.use(verifyToken);
dotenv.config();

// กำหนด secret key ไว้ตรวจสอบ token
const SECRET_KEY =
  process.env.SECRET_KEY || "japaitarmhasecrettummai-secretuyounii";
console.log("Your secret key is:", SECRET_KEY);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // โฟลเดอร์ที่จะเก็บไฟล์อัปโหลด
  },
  filename: (req, file, cb) => {
    const employeeId = req.body.employee_id; // ใช้ employee_id เป็นส่วนหนึ่งของชื่อไฟล์
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${employeeId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

// API สำหรับดึงข้อมูลพนักงานทั้งหมด
data.get("/getEmployees", async (req: Request, res: Response) => {
  try {
    res.status(200).json(await Employee.find()); // ดึงข้อมูลพนักงานทั้งหมดและส่งกลับไปที่ client
  } catch (error) {
    res.status(500).json({ message: "Error retrieving employees", error }); // ส่ง error ถ้าเกิดข้อผิดพลาด
  }
});

//Api สำหรับอัพเดทการแก้ไขหน้า Employee
data.put("/updateEmployee/:id", async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // คืนค่าที่อัปเดตแล้ว
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error });
  }
});

//Api สำหรับลบ Employee
data.delete("/deleteEmployee/:id", async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error });
  }
});

// API สำหรับการตั้งค่าข้อมูลของพนักงาน
data.patch("/settings", upload.single("avatar"), async (req: Request, res: Response) => {
    const employee_id = req.user?.employee_id;
    const { phone_number, address, avatar } = req.body;

    interface UpdateData {
      phone_number?: string;
      address?: string;
      avatar?: string;
    }
    
    const updateData: UpdateData = {};    
    if (phone_number) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone_number)) {
        return res.status(400).json({
          message: "หมายเลขโทรศัพท์ต้องมีความยาว 10 ตัว และเป็นตัวเลขเท่านั้น",
        });
      }
      updateData.phone_number = phone_number;
    }

    if (address) {
      updateData.address = address;
    }

    if (avatar) {
      updateData.avatar = avatar;
    }

    try {
      const updatedEmployee = await Employee.findOneAndUpdate(
        { employee_id },
        updateData,
        { new: true }
      );

      if (!updatedEmployee) {
        return res.status(404).json({ message: "ไม่พบพนักงาน" });
      }

      res.json({
        message: "การตั้งค่าสำเร็จ",
        data: updatedEmployee,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Server error", error: (error as Error).message });
    }
  }
);

// API สำหรับการเปลี่ยนรหัสผ่าน
data.patch("/change-password", async (req: Request, res: Response) => {
    const employee_id = req.user?.employee_id;
    const { password, new_password, confirm_password } = req.body;

    try {
      // ตรวจสอบว่าพนักงานมีอยู่ในระบบหรือไม่
      const employee = await Employee.findOne({ employee_id });
      if (!employee) {
        return res.status(404).json({ message: "ไม่พบพนักงาน" });
      }

      // ตรวจสอบว่ารหัสผ่านเดิมถูกต้องหรือไม่
      const isPasswordValid = await bcrypt.compare(password, employee.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง." });
      }

      // ตรวจสอบเงื่อนไขของ new_password: ต้องมีความยาวอย่างน้อย 6 ตัวอักษร
      const passwordRegex = /^.{6,}$/; // เช็คเฉพาะความยาวที่ต้องไม่น้อยกว่า 6 ตัว
      if (!passwordRegex.test(new_password)) {
        return res.status(400).json({
          message: "รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร",
        });
      }

      // ตรวจสอบว่ารหัสผ่านใหม่และยืนยันรหัสผ่านตรงกันหรือไม่
      if (new_password !== confirm_password) {
        return res
          .status(400)
          .json({ message: "รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน" });
      }

      // เข้ารหัสรหัสผ่านใหม่
      const hashedNewPassword = await bcrypt.hash(new_password, 10);

      // อัปเดตรหัสผ่านใหม่ในฐานข้อมูล
      employee.password = hashedNewPassword;
      await employee.save();

      res.json({ message: "อัปเดตรหัสผ่านเรียบร้อยแล้ว" });
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ message: "Server error", error: errMessage });
    }
  }
);

// API สำหรับดึงข้อมูลการเช็คอิน-เอาท์ทั้งหมด
data.get("/attendance", async (req, res) => {
  const { date } = req.query;

  try {
    let filter = {};

    if (date) {
      // Check if `date` is a valid string and convert it to a Date object
      const selectedDate = new Date(date as string);
      if (!isNaN(selectedDate.getTime())) {
        filter = {
          attendance_date: {
            $gte: selectedDate,
            $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000),
          },
        };
      } else {
        return res.status(400).json({
          code: "ERROR",
          status: "Error",
          data: { msg: "Invalid date format" },
        });
      }
    }

    const attendanceRecords = await Attendance.find(filter);

    const formattedRecords = attendanceRecords.map((record) => ({
      attendance_id: record.attendance_id,
      employee_id: record.employee_id,
      attendance_date: record.attendance_date.toISOString().split("T")[0],
      check_in_time: record.check_in_time
        ? record.check_in_time.toLocaleTimeString("en-GB")
        : "N/A",
      check_out_time: record.check_out_time
        ? record.check_out_time.toLocaleTimeString("en-GB")
        : "N/A",
      work_hours: record.work_hours,
      status: record.status,
    }));

    return res.status(200).json({
      code: "Success",
      status: "Success",
      data: formattedRecords,
    });
  } catch (error) {
    console.error("Fetch attendance error:", error);
    return res.status(500).json({
      code: "ERROR",
      status: "Error",
      data: { msg: "Failed to fetch attendance records" },
    });
  }
});

// API สำหรับดึงข้อมูลการเช็คอินและเช็คเอาท์รายบุคคล
data.get("/getNotifications", verifyToken, async (req: Request, res: Response) => {
    const employeeId = req.user?.employee_id;
    try {
      const notifications = await Notification.find({
        employee_id: employeeId,
      }).sort({ created_at: -1 });

      const notificationsWithTimeAgo = notifications.map((notification) => ({
        ...notification.toObject(),
        timeAgo: moment(notification.created_at).fromNow(),
      }));

      res.status(200).json({
        code: "Success-02-0002",
        status: "Success",
        data: notificationsWithTimeAgo,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({
        code: "ERROR-02-0003",
        status: "Error",
        data: {
          msg: "Failed to fetch notifications",
          error,
        },
      });
    }
  }
);

// API สำหรับ Check-In
data.post("/checkIn", async (req: Request, res: Response) => {
  const employeeId = req.user?.employee_id;
  console.log("Employee ID found:", employeeId);

  try {
    const today = moment().tz("Asia/Bangkok").format("YYYY-MM-DD");

    // ตรวจสอบว่ามีพนักงานที่เช็คอินแล้วในวันนี้หรือไม่
    const existingAttendance = await Attendance.findOne({
      employee_id: employeeId,
      attendance_date: today,
    });

    if (existingAttendance) {
      if (existingAttendance.check_out_time) {
        return res.status(400).json({
          code: "ERROR-01-0003",
          status: "Error",
          data: {
            msg: "You have already checked in and checked out today",
          },
        });
      } else {
        return res.status(400).json({
          code: "ERROR-01-0004",
          status: "Error",
          data: {
            msg: "You have already checked in today",
          },
        });
      }
    }

    const currentTime = new Date();

    const checkInDeadline = new Date();
    checkInDeadline.setHours(9, 1, 0, 0); // ตั้งเวลาเป็น 9:01:00

    let checkInTime = new Date();

    // ตรวจสอบเวลาการกดเช็คอิน
    if (currentTime < checkInDeadline) {
      checkInTime.setHours(9, 0, 0, 0); // ตั้งเวลาเช็คอินเป็น 9:00
    } else {
      checkInTime = currentTime;
    }

    // สร้าง record การเช็คอินใหม่
    const attendance = new Attendance({
      attendance_id: uuidv4(),
      employee_id: employeeId, // ใช้ employee_id เป็น string
      attendance_date: today,
      check_in_time: checkInTime,
      status: "Present",
    });

    await attendance.save();

    return res.status(200).json({
      code: "Success-01-0001",
      status: "Success",
      data: {
        msg: "Check in successfully",
      },
    });
  } catch (error) {
    console.error("Check in error:", error);
    return res.status(500).json({
      code: "ERROR-01-0005",
      status: "Error",
      data: {
        msg: "Check in failed due to server error",
      },
    });
  }
});

// API สำหรับ Check-Out
data.post("/checkOut", async (req: Request, res: Response) => {
  const employeeId = req.user?.employee_id;

  try {
    const today = moment().tz("Asia/Bangkok").format("YYYY-MM-DD");

    // ค้นหา record ของการเช็คอินวันนี้ที่ยังไม่มีเวลาเช็คเอาท์
    const attendance = await Attendance.findOne({
      employee_id: employeeId,
      attendance_date: today,
    });

    // ถ้ายังไม่มีการเช็คอินหรือเช็คเอาท์ ส่ง error กลับ
    if (!attendance) {
      return res.status(400).json({
        code: "ERROR-01-0002",
        status: "Error",
        data: {
          msg: "You have not checked in yet or have already checked out",
        },
      });
    }

    // ถ้ามีเวลาเช็คเอาท์แล้ว ส่ง error ว่าได้เช็คเอาท์ไปแล้ว
    if (attendance.check_out_time) {
      return res.status(400).json({
        code: "ERROR-01-0002",
        status: "Error",
        data: {
          msg: "You have already checked out today",
        },
      });
    }

    if (!attendance.check_in_time) {
      return res.status(400).json({
        code: "ERROR-01-0004",
        status: "Error",
        data: {
          msg: "Check-in time is missing. Cannot proceed with check-out.",
        },
      });
    }

    attendance.check_out_time = new Date(); // กำหนดเวลาเช็คเอาท์

    // คำนวณเวลาทำงาน (เป็นชั่วโมง)
    const workHours = Math.min(
      (new Date(attendance.check_out_time).getTime() -
        new Date(attendance.check_in_time).getTime()) /
        (1000 * 60 * 60), // แปลง ms เป็นชั่วโมง
      8 // จำกัดเวลาสูงสุดไม่เกิน 8 ชั่วโมง
    );

    console.log(`ชั่วโมงการทำงาน: ${workHours} ชั่วโมง`);

    attendance.work_hours = workHours.toFixed(2); // บันทึก work_hours เป็น string (เช่น '8.50')
    await attendance.save();

    // ส่งข้อความ success กลับไปที่ client
    return res.status(200).json({
      code: "Success-01-0001",
      status: "Success",
      data: {
        msg: "Check out successfully",
      },
    });
  } catch (error) {
    // ส่ง error กลับถ้าเกิดปัญหาในการเช็คเอาท์
    console.error("Check out error:", error);
    return res.status(500).json({
      code: "ERROR-01-0003",
      status: "Error",
      data: {
        msg: "Check out failed due to server error",
      },
    });
  }
});

// API สำหรับดึงข้อมูลการแจ้งเตือนสำหรับพนักงาน
data.get("/getNotifications", async (req: Request, res: Response) => {
  const employeeId = req.body?.employee_id as string;
  try {
    const notifications = await Notification.find({
      employee_id: employeeId,
    }).sort({ created_at: -1 });

    // เพิ่ม timeAgo ในการแจ้งเตือนแต่ละอัน
    const notificationsWithTimeAgo = notifications.map((notification) => ({
      ...notification.toObject(),
      timeAgo: moment(notification.created_at).fromNow(), // เช่น "5 นาทีที่แล้ว"
    }));

    res.status(200).json({
      code: "Success-02-0002",
      status: "Success",
      data: notificationsWithTimeAgo,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      code: "ERROR-02-0003",
      status: "Error",
      data: {
        msg: "Failed to fetch notifications",
        error,
      },
    });
  }
});

// API สำหรับดึงข้อมูลการแจ้งเตือนทั้งหมด
data.get("/getAllNotifications", async (req: Request, res: Response) => {

  try {
    const notifications = await Notification.find().sort({ created_at: -1 });
    res.status(200).json({
      code: "Success-02-0001",
      status: "Success",
      data: notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      code: "ERROR-02-0002",
      status: "Error",
      data: {
        msg: "Failed to fetch notifications",
        error,
      },
    });
  }
});

// API การเพิ่มการแจ้งเตือน
data.post("/addNotification", async (req: Request, res: Response) => {
  const { category, message, details, employee_id } = req.body;
  // ตรวจสอบว่า category, message, details มีค่าหรือไม่
  if (!category || !message || !details) {
    return res.status(400).json({
      code: "ERROR-02-0002",
      status: "Error",
      data: {
        msg: "All fields are required (category, message, details)",
      },
    });
  }

  try {
    // ตรวจสอบกรณีที่ไม่ได้ระบุ employee_id
    if (!employee_id || employee_id.trim() === "") {
      const employees = await Employee.find();

      // สร้างรายการการแจ้งเตือนสำหรับพนักงานทุกคน
      const notifications = employees.map((emp) => ({
        notification_id: uuidv4(),
        employee_id: emp.employee_id, // ใช้ employee_id จาก MongoDB
        category,
        message,
        details,
        created_at: new Date(),
      }));

      // บันทึกการแจ้งเตือนทั้งหมดลงในฐานข้อมูล
      await Notification.insertMany(notifications);

      // ส่งข้อมูลตอบกลับพร้อมข้อมูลการแจ้งเตือนที่ถูกสร้าง
      return res.status(201).json({
        code: "Success-02-0001",
        status: "Success",
        data: {
          msg: `Notifications sent to ${employees.length} employees`,
          notifications,
        },
      });
    }

    // กรณีที่มี employee_id ระบุมาในคำขอ
    const notification_id = uuidv4();

    const notification = new Notification({
      notification_id,
      employee_id, // ใช้ employee_id ที่ระบุมา
      category,
      message,
      details,
      created_at: new Date(),
    });

    // บันทึกการแจ้งเตือนสำหรับพนักงานที่ระบุ
    await notification.save();

    // ส่งข้อมูลตอบกลับเมื่อการแจ้งเตือนสำเร็จ
    return res.status(201).json({
      code: "Success-02-0002",
      status: "Success",
      data: {
        msg: "Notification created successfully",
        notification,
      },
    });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error) {
      const err = error as { code?: number; message?: string };
  
      if (err.code === 11000) {
        return res.status(400).json({
          code: "ERROR-02-0004",
          status: "Error",
          data: {
            msg: "Duplicate key error: notification_id must be unique",
            error,
          },
        });
      }
    }

    // ส่งข้อผิดพลาดทั่วไป
    res.status(500).json({
      code: "ERROR-02-0005",
      status: "Error",
      data: {
        msg: "Failed to create notification",
        error,
      },
    });
  }
});

// API สำหรับแก้ไขข้อมูลการแจ้งเตือน
data.patch("/updateNotification/:id", async (req: Request, res: Response) => {
  try {
    const notificationId = req.params.id;
    const updatedNotification = await Notification.findOneAndUpdate(
      { _id: notificationId },
      req.body,
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({
        code: "ERROR-02-0003",
        status: "Error",
        data: {
          msg: "Notification not found",
        },
      });
    }

    res.status(200).json({
      code: "Success-02-0001",
      status: "Success",
      data: updatedNotification,
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({
      code: "ERROR-02-0004",
      status: "Error",
      data: {
        msg: "Failed to update notification",
        error,
      },
    });
  }
});

// API สำหรับทำเครื่องหมายการแจ้งเตือนทั้งหมดเป็นอ่านแล้ว
data.patch("/markAsRead/:_id", verifyToken, async (req: Request, res: Response) => {
    try {
      const idOfNoti = req.params._id;

      if (!idOfNoti) {
        return res.status(400).json({
          code: "ERROR-02-0002",
          status: "Error",
          data: {
            msg: "Notification ID is required",
          },
        });
      }

      // อัปเดตการแจ้งเตือนทั้งหมดเป็นอ่านแล้ว
      await Notification.updateOne(
        { _id: idOfNoti },
        { $set: { is_read: "read" } }
      );
      res.status(200).json({
        code: "Success-02-0003",
        status: "Success",
        data: {
          msg: `${idOfNoti} : Notifications marked as read`,
        },
      });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      res.status(500).json({
        code: "ERROR-02-0004",
        status: "Error",
        data: {
          msg: "Failed to mark notifications as read",
          error,
        },
      });
    }
  }
);

// API สำหรับลบการแจ้งเตือน
data.delete("/deleteNotification/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    console.log("Notification ID:", req.params.id);
    const notification = await Notification.findOneAndDelete({ _id: id });
    console.log("Notification to delete:", notification);
    res.status(200).json({
      code: "Success-02-0004",
      status: "Success",
      data: {
        msg: "Notification deleted successfully",
      },
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      code: "ERROR-02-0005",
      status: "Error",
      data: {
        msg: "Failed to delete notification",
        error,
      },
    });
  }
});

// สร้าง API สำหรับการดึงข้อมูลหน้า Dashboard //
data.get("/db/employees/count", verifyToken, async (req: Request, res: Response) => {
    try {
      const count = await Employee.countDocuments();
      res.status(200).json({ count });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch employee count" });
    }
  }
);

// สร้าง API สำหรับการดึงข้อมูลหน้า Dashboard //
data.get("/db/attendance/today", verifyToken, async (req: Request, res: Response) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // ตั้งค่าเป็นเที่ยงคืนของวันนี้
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); // วันถัดไปตอนเที่ยงคืน

      const presentCount = await Attendance.countDocuments({
        status: "Present",
        attendance_date: { $gte: today, $lt: tomorrow }, // วันนี้เท่านั้น
      });
      res.status(200).json({ present: presentCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch today attendance" });
    }
  }
);

// สร้าง API สำหรับการดึงข้อมูลหน้า Dashboard //
data.get("/db/requests/leaves", verifyToken, async (req: Request, res: Response) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // ตั้งค่าเป็นเที่ยงคืนของวันนี้

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); // วันถัดไปตอนเที่ยงคืน

      const leaveCount = await Requests.countDocuments({
        type: "leaveRequest",
        status: "Approved",
        updated_at: { $gte: today, $lt: tomorrow }, // กรอง created_at ภายในวันนี้
      });
      res.status(200).json({ count: leaveCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch leave requests" });
    }
  }
);

// สร้าง API สำหรับการดึงข้อมูลหน้า Dashboard //
data.get("/db/requests/overtimes", verifyToken, async (req: Request, res: Response) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // ตั้งค่าเป็นเที่ยงคืนของวันนี้

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); // วันถัดไปตอนเที่ยงคืน

      const overtimeCount = await Requests.countDocuments({
        type: "overtimeRequest",
        status: "Approved",
        updated_at: { $gte: today, $lt: tomorrow }, // กรอง created_at ภายในวันนี้
      });
      res.status(200).json({ count: overtimeCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch overtime requests" });
    }
  }
);

// สร้าง API เพื่อแสดงรายงานรายวัน
data.get("/daily-report/:date", verifyToken, async (req: Request, res: Response) => {
    if (req.user?.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden: Admin only" });
    }
    try {
      const { date } = req.params;
      const reportDate = new Date(date);

      // ดึงข้อมูลจาก collections
      const attendanceRecords = await Attendance.find({
        attendance_date: reportDate,
      });
      const employeeData = await Employee.find();
      const leaveRecords = await LeaveRecords.find({
        start_date: { $lte: reportDate },
        end_date: { $gte: reportDate },
      });
      const overtimeRecords = await Overtime.find({
        overtime_date: reportDate,
      });

      const startOfDay = new Date(reportDate);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(reportDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      const workInfoRecords = await WorkInfo.find({
        work_date: { $gte: startOfDay, $lte: endOfDay },
});

      

      // รวมข้อมูลจากทุก collections
      const report = attendanceRecords.map((attendance) => {
        const employee = employeeData.find(
          (emp) => emp.employee_id === attendance.employee_id
        ) || { first_name: "N/A", last_name: "N/A" };

        const leaveInfo = leaveRecords.find(
          (leave) => leave.employee_id === attendance.employee_id
        ) || { leave_type: "N/A" };

        const overtimeInfo = overtimeRecords.filter(
          (overtime) =>
            overtime.employee_id.toString() === attendance.employee_id
        );

        const totalOvertimeHours = overtimeInfo.reduce(
          (sum, overtime) => sum + (overtime.overtime_hours || 0),
          0
        );

        const workInfo = workInfoRecords.find(
          (w) => w.employee_id === attendance.employee_id
        ) || { position: "N/A", detail_work: "N/A" };
        
        console.log("✅ workInfoRecords for", date, workInfoRecords.map(w => ({
          emp: w.employee_id,
          date: w.work_date.toISOString(),
          pos: w.position,
        })));
        
        
        return {
          report_id: `WR-${Date.now()}`, // กำหนด ID สำหรับรายงาน
          employee_id: attendance.employee_id,
          employee_name: `${employee.first_name} ${employee.last_name}`,
          check_in: attendance.check_in_time || "N/A",
          check_out: attendance.check_out_time || "N/A",
          total_hours: attendance.work_hours || "N/A",
          overtime_hours: totalOvertimeHours || "N/A",
          leave_type: leaveInfo.leave_type || "N/A",
          status: attendance.status || "N/A",

          position: workInfo.position || "N/A",
          detail_work: workInfo.detail_work || "N/A",
        };
      });

      res.json({ data: report });
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({ message: "Error generating report" });
    }
  }
);

// สร้าง API สำหรับคำนวณค่าเงินรายวันของพนักงาน
data.get("/payroll", verifyToken, async (req: Request, res: Response) => {
  try {
    const currentDate = new Date();

    // ช่วงเวลาของวันที่
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

    // ดึงข้อมูลจาก collection
    const employeeData = await Employee.find();
    const attendanceData = await Attendance.find({
      attendance_date: { $gte: startOfDay, $lte: endOfDay },
    });
    const overtimeData = await Overtime.find({
      overtime_date: { $gte: startOfDay, $lte: endOfDay },
    });
    const statusPayrollData = await Payroll.find({
      statusPayroll: { $in: ["Paid", "UnPaid"] },
    });

    const overtimeRate = 100;
    const salaryOfHour = 62.5;

    // รวมข้อมูลทุกคอลเลคชั่น
    const payroll = employeeData.map((employee) => {
      const attendanceRecord = attendanceData.find(
        (record) =>
          record.employee_id.toString() === employee.employee_id.toString()
      );
      const overtimeRecords = overtimeData.filter(
        (record) =>
          record.employee_id.toString() === employee.employee_id.toString()
      );
      const statusPayroll = statusPayrollData.find(
        (record) =>
          record.employee_id.toString() === employee.employee_id.toString()
      ) || { statusPayroll: "UnPaid" };

      // รวม OT ชั่วโมง
      const totalOvertimeHours = overtimeRecords.reduce(
        (sum, overtime) => sum + (overtime.overtime_hours || 0),
        0
      );

      const calculateTotalSalary = (
        salaryOfDay: number,
        salaryOfOvertime: number
      ): number => {
        return !isNaN(salaryOfDay) && !isNaN(salaryOfOvertime)
          ? salaryOfDay + salaryOfOvertime
          : salaryOfDay || 0;
      };

      // คํานวณค่าเงิน
      const salaryOfDay = Number(attendanceRecord?.work_hours) * salaryOfHour;
      const salaryOfOvertime: number = totalOvertimeHours * overtimeRate;
      const totalSalary = calculateTotalSalary(salaryOfDay, salaryOfOvertime);

      // ตรวจสอบว่ามี work_hours หรือไม่
      if (
        !attendanceRecord ||
        !attendanceRecord.work_hours ||
        attendanceRecord.work_hours === "N/A"
      ) {
        return {
          employee_id: employee.employee_id,
          employee_name: `${employee.first_name} ${employee.last_name}`,
          work_hours: "N/A",
          overtime_hours: 0,
          SalaryOfDay: 0,
          SalaryOfOvertime: 0,
          TotalSalary: 0,
          created_at: new Date(),
          statusPayroll: "UnPaid",
        };
      }

      return {
        employee_id: employee.employee_id,
        employee_name: `${employee.first_name} ${employee.last_name}`,
        work_hours: attendanceRecord.work_hours,
        overtime_hours: totalOvertimeHours || 0,
        SalaryOfDay: salaryOfDay,
        SalaryOfOvertime: salaryOfOvertime,
        TotalSalary: totalSalary,
        created_at: new Date(),
        statusPayroll: statusPayroll.statusPayroll,
      };
    });

    // บันทึกข้อมูลใน MongoDB โดยใช้ bulkWrite
    const bulkOps = payroll.map((record) => ({
      updateOne: {
        filter: { employee_id: record.employee_id },
        update: { $set: record },
        upsert: true,
      },
    }));
    await Payroll.bulkWrite(bulkOps);

    res.json({
      data: payroll,
      message: "Payroll data generated and saved successfully.",
    });
  } catch (error) {
    console.error("Error generating and saving payroll report:", error);
    res
      .status(500)
      .json({ message: "Error generating and saving payroll report." });
  }
});

// API สำหรับอัปเดต statusPayroll
data.patch("/payroll/:employee_id/status", async (req, res) => {
  const { employee_id } = req.params; // รับ employee_id จาก URL
  const { statusPayroll } = req.body; // รับ statusPayroll จาก request body

  // ตรวจสอบว่า statusPayroll มีค่าที่ถูกต้อง
  if (!["Pending", "Paid", "UnPaid"].includes(statusPayroll)) {
    return res.status(400).json({
      code: "ERROR-02-0004",
      status: "Error",
      message:
        "Invalid status value. Allowed values are 'Pending', 'Paid', or 'UnPaid'.",
    });
  }

  try {
    // ค้นหาและอัปเดต statusPayroll
    const result = await Payroll.updateOne(
      { employee_id }, // ค้นหาเอกสารด้วย employee_id
      { $set: { statusPayroll } } // อัปเดตเฉพาะ statusPayroll
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        code: "ERROR-02-0002",
        status: "Error",
        message: `Employee with ID ${employee_id} not found.`,
      });
    }

    res.status(200).json({
      code: "SUCCESS-02-0001",
      status: "Success",
      message: `Status updated successfully for Employee ID: ${employee_id}`,
    });
  } catch (error) {
    console.error("Error updating statusPayroll:", error);
    res.status(500).json({
      code: "ERROR-02-0003",
      status: "Error",
      message: "Error updating statusPayroll.",
    });
  }
});

export { upload };
export default data; // ส่งออก router
