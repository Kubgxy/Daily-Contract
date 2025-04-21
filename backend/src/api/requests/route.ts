import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import { io , onlineUsers } from "../../app";

//Models
import Requests from "../../models/Request";
import Overtime from "../../models/Overtime";
import WorkInfo from "../../models/WorkInfo";
import LeaveRecords from "../../models/LeaveRequest";
import Attendance from "../../models/Attendance";


//Middleware
import { verifyToken } from "../../middleware/verifyToken";
import { requireManagerOrAdmin } from "../../middleware/requireManagerOrAdmin";

const requests = express.Router();
requests.use(verifyToken);
dotenv.config();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads"); // โฟลเดอร์ที่จะเก็บไฟล์อัปโหลด
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage: storage });

  type WorkInfoDetails = {
    original_check_in: string;
    corrected_check_in: string;
    corrected_check_out: string;
  };

  const calculateHours = (start: string, end: string): number => {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
  
    const startDate = new Date(0, 0, 0, sh, sm);
    const endDate = new Date(0, 0, 0, eh, em);
  
    // ถ้าเลยเที่ยงคืน
    if (endDate <= startDate) endDate.setDate(endDate.getDate() + 1);
  
    const diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    return parseFloat(diff.toFixed(2));
  };
  
  
  
// API สำหรับดึงข้อมูลคำขอของพนักงาน
/**
 * @swagger
 * /api/v1/requests/getRequests:
 *   get:
 *     summary: Get requests for the authenticated employee
 *     description: Retrieves all requests made by the currently authenticated employee based on their token.
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the employee's requests.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "Success-01-0003"
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       request_id:
 *                         type: string
 *                         description: The unique ID of the request.
 *                         example: "REQ12345"
 *                       employee_id:
 *                         type: string
 *                         description: The ID of the employee who made the request.
 *                         example: "20240001"
 *                       type:
 *                         type: string
 *                         description: The type of the request (e.g., leaveRequest, overtimeRequest).
 *                         example: "leaveRequest"
 *                       status:
 *                         type: string
 *                         description: The current status of the request (e.g., Approved, Pending).
 *                         example: "Pending"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the request was created.
 *                         example: "2024-01-01T08:00:00Z"
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "ERROR-01-0003"
 *                 status:
 *                   type: string
 *                   example: "Error"
 *                 data:
 *                   type: object
 *                   properties:
 *                     msg:
 *                       type: string
 *                       example: "Unauthorized"
 *       500:
 *         description: Server error while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "ERROR-01-0003"
 *                 status:
 *                   type: string
 *                   example: "Error"
 *                 data:
 *                   type: object
 *                   properties:
 *                     msg:
 *                       type: string
 *                       example: "An error occurred while processing the request"
 */
requests.get("/getRequests", async (req: Request, res: Response) => {
    try {
        const employeeId = req.user?.employee_id;

        const responseData = await Requests.find({employee_id: employeeId});
        return res.status(200).json({
            code: "Success-01-0003",
            status: "Success",
            data: responseData,
        });
    } catch (error) {
        // Handle the error here
        console.error(error);
        res.status(500).json({
            code: "ERROR-01-0003",
            status: "Error",
            data: {
                msg: "An error occurred while processing the request",
            },
        });
    }
});

// API สำหรับดึงข้อมูลคำขอทั้งหมด
/**
 * @swagger
 * /api/v1/requests/getAllRequests:
 *   get:
 *     summary: Get all requests
 *     description: Retrieves all requests from the database. Requires authentication.
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all requests.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "Success-01-0003"
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       request_id:
 *                         type: string
 *                         description: The unique ID of the request.
 *                         example: "REQ12345"
 *                       employee_id:
 *                         type: string
 *                         description: The ID of the employee who made the request.
 *                         example: "20240001"
 *                       type:
 *                         type: string
 *                         description: The type of the request (e.g., leaveRequest, overtimeRequest).
 *                         example: "leaveRequest"
 *                       status:
 *                         type: string
 *                         description: The current status of the request (e.g., Approved, Pending).
 *                         example: "Pending"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the request was created.
 *                         example: "2024-01-01T08:00:00Z"
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "ERROR-01-0003"
 *                 status:
 *                   type: string
 *                   example: "Error"
 *                 data:
 *                   type: object
 *                   properties:
 *                     msg:
 *                       type: string
 *                       example: "Unauthorized"
 *       500:
 *         description: Server error while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "ERROR-01-0003"
 *                 status:
 *                   type: string
 *                   example: "Error"
 *                 data:
 *                   type: object
 *                   properties:
 *                     msg:
 *                       type: string
 *                       example: "An error occurred while processing the request"
 */
requests.get("/getAllRequests",requireManagerOrAdmin, async (req: Request, res: Response) => {
    try {
        const responseData = await Requests.find();
        return res.status(200).json({
            code: "Success-01-0003",
            status: "Success",
            data: responseData,
        });
    } catch (error) {
        // Handle the error here
        console.error(error);
        res.status(500).json({
            code: "ERROR-01-0003",
            status: "Error",
            data: {
                msg: "An error occurred while processing the request",
            },
        });
    }
});

// API สำหรับบันทึกคำขอ
requests.post('/formRequest', upload.single("attachment"), async (req: Request, res: Response) => {
    const { type, details } = req.body;

    console.log("Type:", type);
    console.log("Details:", details);

    if (!type || Object.keys(details).length === 0) {
        return res.status(400).json({
            code: "ERROR-01-0002",
            status: "Error",
            data: {
                msg: "Form request failed: missing required fields",
            },
        });
   }

    try {
        const employeeId = req.user?.employee_id;

        // ตรวจสอบประเภทคำขอ
        let newRequest;

        if (type === "leaveRequest") {
            const { leave_type, start_date, end_date, reason } = details;
            if (!leave_type || !start_date || !end_date || !reason) {
                // ถ้าไม่มีข้อมูลที่จำเป็น ส่ง error กลับ
                return res.status(400).json({
                    code: "ERROR-01-0002",
                    status: "Error",
                    data: {
                        msg: "Form request failed: missing required fields",
                    },
                });
            }

            // สร้างคำขอ leaveRequest
            newRequest = new Requests({
                employee_id: employeeId,
                type,
                details: { leave_type, start_date, end_date, reason },
            });
        } else if (type === "overtimeRequest") {
            const { overtime_date, start_time, end_time, reason } = details;
            if (!overtime_date || !start_time || !end_time || !reason) {
                // ถ้าไม่มีข้อมูลที่จำเป็น ส่ง error กลับ
                return res.status(400).json({
                    code: "ERROR-01-0002",
                    status: "Error",
                    data: {
                        msg: "Form request failed: missing required fields",
                    },
                });
            }

            // สร้างคำขอ overtimeRequest
            newRequest = new Requests({
                employee_id: employeeId,
                type,
                details: { overtime_date, start_time, end_time, reason },
            });
        } else if (type === "workInfoRequest") {
            const { original_check_in, original_check_out, corrected_check_in, corrected_check_out, reason } = details;
            const attachment = req.file ? req.file.filename : undefined;

            if (!original_check_in || !original_check_out || !corrected_check_in || !corrected_check_out || !reason) {
                return res.status(400).json({
                    code: "ERROR-01-0002",
                    status: "Error",
                    data: {
                        msg: "Form request failed: missing required fields",
                    },
                });
            }

            newRequest = new Requests({
                employee_id: employeeId,
                type,
                details: { 
                    original_check_in, 
                    original_check_out, 
                    corrected_check_in, 
                    corrected_check_out, 
                    reason, 
                    attachment 
                },
            });
        } else {
            // ถ้าประเภทคำขอไม่ถูกต้อง ส่ง error กลับ
            return res.status(400).json({
                code: "ERROR-01-0002",
                status: "Error",
                data: {
                    msg: "Form request failed: invalid request type",
                },
            });
        }

        // บันทึกคำขอลงฐานข้อมูล
        await newRequest.save();

        return res.status(200).json({
            code: "Success-01-0003",
            status: "Success",
            data: {
                msg: "Form request successful",
                data: newRequest,
            }
            })
    } catch (error) {
        // Handle the error here
        console.error(error);
        res.status(500).json({
            code: "ERROR-01-0003",
            status: "Error",
            data: {
                msg: "An error occurred while processing the request",
            },
        });
    }
})

// API สำหรับอนุมัติคำขอและอัปเดตข้อมูลใน OverTime
requests.post("/updateRequestStatus", async (req: Request, res: Response) => {
    const { requestId, action, type, overtimeData, approved_by } = req.body;
  
    try {
      const request = await Requests.findByIdAndUpdate(
        requestId,
        { status: action === "approved" ? "Approved" : "Rejected", approved_by },
        { new: true }
      );
  
      if (!request) return res.status(404).json({ status: "Error", data: { msg: "Request not found" } });
  
      if (type === "workInfoRequest" && action === "approved") {
        const details = request.details as {
          original_check_in: string;
          corrected_check_in: string;
          corrected_check_out: string;
        };
  
        const attendanceDate = details.original_check_in.split("T")[0];
  
        const updatedAttendance = await Attendance.findOneAndUpdate(
          {
            employee_id: request.employee_id,
            attendance_date: attendanceDate,
          },
          {
            check_in_time: details.corrected_check_in,
            check_out_time: details.corrected_check_out,
          },
          { new: true }
        );
  
        if (updatedAttendance) {
          const checkIn = new Date(details.corrected_check_in);
          const checkOut = new Date(details.corrected_check_out);
          const hours = Math.abs((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60));
          updatedAttendance.work_hours = hours.toFixed(2);
          await updatedAttendance.save();
        }
      }

      if (type === "overtimeRequest" && action === "approved") {
        const overtime = new Overtime({
          employee_id: overtimeData.employee_id,
          overtime_date: new Date(overtimeData.overtime_date),
          start_time: overtimeData.start_time,
          end_time: overtimeData.end_time,
          overtime_hours: calculateHours(overtimeData.start_time, overtimeData.end_time),
          approved_by,
        });
      
        await overtime.save(); // สำคัญมาก!
        console.log("✅ บันทึก overtime สำเร็จแล้ว");
      }
      
      const socketId = onlineUsers.get(request.employee_id);
      if (socketId) {
        io.to(socketId).emit("notify", {
          title: action === "approved" ? "คำขอได้รับการอนุมัติ" : "คำขอถูกปฏิเสธ",
          message: `คำขอ ${type} ของคุณได้รับการ ${action === "approved" ? "อนุมัติ" : "ปฏิเสธ"} โดย ${approved_by}`,
        });
      }
  
      return res.status(200).json({
        status: "Success",
        data: { msg: "Request processed successfully", request },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "Error", data: { msg: "Internal server error" } });
    }
  });
  
// API สำหรับอนุมัติคำขอและอัปเดตข้อมูลใน Attendance
requests.post("/approveWorkInfoRequest", async (req: Request, res: Response) => {
    const { requestId } = req.body;
  
    if (!requestId) {
      return res.status(400).json({
        code: "ERROR-01-0004",
        status: "Error",
        data: { msg: "Missing required field: requestId" },
      });
    }
  
    try {
      // ✅ ค้นหาคำขอ
      const request = await Requests.findById(requestId);
      if (!request) {
        return res.status(404).json({
          code: "ERROR-01-0005",
          status: "Error",
          data: { msg: "Request not found" },
        });
      }
  
      // ✅ ตรวจสอบประเภท
      if (request.type !== "workInfoRequest") {
        return res.status(400).json({
          code: "ERROR-01-0006",
          status: "Error",
          data: { msg: "Invalid request type" },
        });
      }
  
      // ✅ แปลงเป็น type ที่ปลอดภัย
      const details = request.details as WorkInfoDetails;
  
      // ✅ แปลง original_check_in เป็น Date และเคลียร์เวลา
      const attendanceDate = new Date(details.original_check_in);
      attendanceDate.setHours(0, 0, 0, 0); // ตั้งให้ตรงกับค่าที่ Mongo เก็บไว้
  
      // ✅ Debug log ช่วยตรวจสอบ
      console.log("🟦 Matching Attendance:", {
        employee_id: request.employee_id,
        attendance_date: attendanceDate,
      });
  
      // ✅ อัปเดตคำขอ
      request.status = "Approved";
      await request.save();
  
      // ✅ ค้นหาและอัปเดต Attendance
      const updatedAttendance = await Attendance.findOneAndUpdate(
        {
          employee_id: request.employee_id,
          attendance_date: attendanceDate,
        },
        {
          check_in_time: new Date(details.corrected_check_in),
          check_out_time: new Date(details.corrected_check_out),
        },
        { new: true }
      );
  
      if (!updatedAttendance) {
        return res.status(404).json({
          code: "ERROR-01-0008",
          status: "Error",
          data: { msg: "Attendance record not found" },
        });
      }
  
      // ✅ คำนวณเวลาทำงาน
      const checkIn = new Date(details.corrected_check_in);
      const checkOut = new Date(details.corrected_check_out);
      const workHours = Math.abs((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60));
  
      updatedAttendance.work_hours = workHours.toFixed(2);
      await updatedAttendance.save();
  
      return res.status(200).json({
        code: "Success-01-0004",
        status: "Success",
        data: {
          msg: "WorkInfo and Attendance updated successfully",
          updatedAttendance,
        },
      });
    } catch (error) {
      console.error("❌ Error approving work info request:", error);
      return res.status(500).json({
        code: "ERROR-01-0007",
        status: "Error",
        data: { msg: "Internal server error while approving request" },
      });
    }
  });

// API สำหรับอนุมัติคำขอและอัปเดตข้อมูลใน LeaveRecords
requests.post("/approveLeaveRequest", async (req: Request, res: Response) => {
    const { requestId, action, approved_by } = req.body;

    if (!requestId || !action) {
        return res.status(400).json({
            code: "ERROR-02-0004",
            status: "Error",
            data: {
                msg: "Missing required fields: requestId or action",
            },
        });
    }

    try {
        // ค้นหาคำขอ
        const request = await Requests.findById(requestId);

        if (!request) {
            return res.status(404).json({
                code: "ERROR-02-0005",
                status: "Error",
                data: {
                    msg: "Leave request not found",
                },
            });
        }

        // ตรวจสอบว่าเป็น leaveRequest
        if (request.type !== "leaveRequest") {
            return res.status(400).json({
                code: "ERROR-02-0006",
                status: "Error",
                data: {
                    msg: "Invalid request type for this endpoint",
                },
            });
        }

        // อัปเดตสถานะคำขอ
        request.status = action === "approved" ? "Approved" : "Rejected";
        request.approved_by = approved_by;
        await request.save();

        // กรณีอนุมัติ สามารถเพิ่มการบันทึกลงในระบบ LeaveRecords ได้
        if (action === "approved") {
            const newLeaveRecord = {
                employee_id: request.employee_id,
                leave_type: request.details.leave_type,
                start_date: request.details.start_date,
                end_date: request.details.end_date,
                reason: request.details.reason,
                approved_by,
            };

            // บันทึก LeaveRecord
            await LeaveRecords.create(newLeaveRecord);
        }

        const socketId = onlineUsers.get(request.employee_id);
        if (socketId) {
            io.to(socketId).emit("notify", {
                title: action === "approved" ? "คำขอได้รับการอนุมัติ" : "คำขอถูกปฏิเสธ",
                message: `คำขอลาของคุณได้รับการ ${action === "approved" ? "อนุมัติ" : "ปฏิเสธ"} โดย ${approved_by}`,
        })
        }
        
        return res.status(200).json({
            code: "Success-02-0004",
            status: "Success",
            data: {
                msg: `Leave request ${action === "approved" ? "approved" : "rejected"} successfully`,
            },
        });
    } catch (error) {
        console.error("Error approving leave request:", error);
        res.status(500).json({
            code: "ERROR-02-0007",
            status: "Error",
            data: {
                msg: "An error occurred while processing the leave request",
            },
        });
    }
});

// API สำหรับดึงข้อมูลการทำงานของพนักงานทั้งหมด
requests.get('/work-info', async (req: Request, res: Response) => {
    try {
        const workInfos = await WorkInfo.find();
        return res.status(200).json({
            code: 'Success',
            status: 'Success',
            data: workInfos,
        });
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการทำงาน:", error);
        res.status(500).json({
            code: 'Error',
            message: 'ไม่สามารถดึงข้อมูลการทำงานได้',
        });
    }
});

// ดึงข้อมูลการทำงานล่วงเวลาตามวันที่หรือทั้งหมด
requests.get('/overtime', async (req: Request, res: Response) => {
    try {
      const date = req.query.date as string;
  
      let query = {};
      if (date) {
        const endOfDay = new Date(date);
        endOfDay.setDate(endOfDay.getDate() + 1); // เพิ่มเป็นวันถัดไป
  
        query = {
            overtime_date: date,
        };
      }
  
      const overtimeRecords = await Overtime.find(query);
      console.log("📦 [Backend] Query Date:", date);
      console.log("📦 [Backend] Query Mongo:", query);
      console.log("📦 [Backend] Records:", overtimeRecords.length);
  
      res.status(200).json({
        code: 'Success',
        status: 'Success',
        data: overtimeRecords,
      });
    } catch (error) {
      console.error('❌ Backend Error:', error);
      res.status(500).json({
        code: 'Error',
        status: 'Failed to fetch overtime records',
      });
    }
  });
  
// API สำหรับดึงข้อมูลการลาทั้งหมด 
requests.get("/getLeaveRequests", async (req: Request, res: Response) => {
    try {
        const leaveRequests = await LeaveRecords.find();
        return res.status(200).json({
            code: "Success-01-0003",
            status: "Success",
            data: leaveRequests,
        });
    } catch (error) {
        console.error("Error fetching leave requests:", error);
        return res.status(500).json
    }
});

// ✅ Attendance Request: type = workInfoRequest
requests.get("/attendance", async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    
    const query = {
      type: "workInfoRequest"
    } as { type: string; updated_at?: { $gte: Date; $lte: Date } };
    
    if (date) {
      const start = new Date(date as string);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
    
      query.updated_at = { $gte: start, $lte: end };
    }
    
    const data = await Requests.find(query).sort({ updated_at: -1 }); // ✅ เปลี่ยน sort ให้ match กับ query ด้วย
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("❌ Attendance request fetch failed:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

  
export { upload }
export default requests