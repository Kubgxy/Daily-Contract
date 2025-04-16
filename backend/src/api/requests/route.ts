import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";

//Models
import Requests from "../../models/Request";
import Overtime from "../../models/Overtime";
import WorkInfo from "../../models/WorkInfo";
import Attendance from "../../models/Attendance";
import LeaveRecords from "../../models/LeaveRequest";

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
    console.log("Request Body:", req.body);

    if (!requestId || !action || !type) {
        return res.status(400).json({
            code: "ERROR-01-0004",
            status: "Error",
            data: {
                msg: "Missing required fields: requestId, action, or type",
            },
        });
    }

    try {
        // อัปเดตคำขอใน Requests
        const updatedRequest = await Requests.findByIdAndUpdate(
            requestId,
            {
                status: action === "approved" ? "Approved" : "Rejected",
                approved_by,
            },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({
                code: "ERROR-01-0005",
                status: "Error",
                data: {
                    msg: "Request not found",
                },
            });
        }

        function calculateOvertimeHours(start_time: string, end_time: string): number {
            if (!start_time || !end_time) {
                throw new Error("Invalid input: start_time and end_time are required");
            }
        
            const [startHour, startMinute] = start_time.split(":").map(Number);
            const [endHour, endMinute] = end_time.split(":").map(Number);
        
            if (
                isNaN(startHour) ||
                isNaN(startMinute) ||
                isNaN(endHour) ||
                isNaN(endMinute)
            ) {
                throw new Error("Invalid input: time must be in HH:mm format");
            }
        
            // แปลงเวลาเป็นชั่วโมงแบบทศนิยม
            const start = startHour + startMinute / 60;
            const end = endHour + endMinute / 60;
        
            // ตรวจสอบกรณีเวลาข้ามวัน
            const overtimeHours =
                end >= start ? end - start : 24 - start + end;
        
            if (overtimeHours <= 0) {
                throw new Error("Invalid time range: start_time is after end_time");
            }
        
            return overtimeHours;
        }        

        // จัดการตามประเภทคำขอ
        if (type === "overtimeRequest" && action === "approved") {
            if (!overtimeData || !overtimeData.start_time || !overtimeData.end_time) {
                return res.status(400).json({
                    code: "ERROR-01-0008",
                    status: "Error",
                    data: {
                        msg: "start_time and end_time are required in overtimeData",
                    },
                });
            }
        
            let overtimeHours;
            try {
                overtimeHours = calculateOvertimeHours(
                    overtimeData.start_time,
                    overtimeData.end_time
                );
            } catch (error) {
                console.error("Error calculating overtime hours:", error);
                return res.status(400).json({
                    code: "ERROR-01-0009",
                    status: "Error",
                    data: {
                        msg: "Invalid start_time or end_time in overtimeData",
                    },
                });
            }

            // บันทึก Overtime
            const newOvertime = new Overtime({
                employee_id: overtimeData.employee_id,
                overtime_date: overtimeData.overtime_date,
                start_time: overtimeData.start_time,
                end_time: overtimeData.end_time,
                overtime_hours: overtimeHours,
                approved_by: approved_by,
            });
        
            await newOvertime.save();
        }        

        return res.status(200).json({
            code: "Success-01-0004",
            status: "Success",
            data: {
                msg: `Request ${action === "approved" ? "Approved" : "Rejected"} successfully`,
                request: updatedRequest,
            },
        });
    } catch (error) {
        console.error("Error updating request status:", error);
        res.status(500).json({
            code: "ERROR-01-0006",
            status: "Error",
            data: {
                msg: "An error occurred while updating the request status",
            },
        });
    }
});

// API สำหรับอนุมัติคำขอและอัปเดตข้อมูลใน Attendance
// requests.post("/approveWorkInfoRequest", async (req: Request, res: Response) => {
//     const { requestId } = req.body;

//     if (!requestId) {
//         return res.status(400).json({
//             code: "ERROR-01-0004",
//             status: "Error",
//             data: {
//                 msg: "Missing required field: requestId",
//             },
//         });
//     }

//     try {
//         // ค้นหาคำขอที่ต้องการอนุมัติ
//         const request = await Requests.findById(requestId);

//         if (!request) {
//             return res.status(404).json({
//                 code: "ERROR-01-0005",
//                 status: "Error",
//                 data: {
//                     msg: "Request not found",
//                 },
//             });
//         }

//         // ตรวจสอบว่าเป็นประเภทคำขอแก้ไขข้อมูลการทำงาน (workInfoRequest)
//         if (request.type !== "workInfoRequest") {
//             return res.status(400).json({
//                 code: "ERROR-01-0006",
//                 status: "Error",
//                 data: {
//                     msg: "Invalid request type",
//                 },
//             });
//         }

//         // อัปเดตสถานะคำขอเป็น "approved"
//         request.status = "Approved";
//         await request.save();

//         // ตรวจสอบวันที่จาก original_check_in
//         const attendanceDate = request.details.original_check_in.split("T")[0];

//         // อัปเดตข้อมูลใน Attendance
//         const updatedAttendance = await Attendance.findOneAndUpdate(
//             {
//                 employee_id: request.employee_id,
//                 attendance_date: attendanceDate, // ตรวจสอบว่า attendance_date ตรงกับคำขอ
//             },
//             {
//                 check_in_time: request.details.corrected_check_in, // เวลาเข้างานใหม่
//                 check_out_time: request.details.corrected_check_out, // เวลาออกงานใหม่
//             },
//             { new: true } // ส่งคืนข้อมูลที่อัปเดตแล้ว
//         );

//         if (!updatedAttendance) {
//             return res.status(404).json({
//                 code: "ERROR-01-0008",
//                 status: "Error",
//                 data: {
//                     msg: "Attendance record not found",
//                 },
//             });
//         }

//         // คำนวณ work_hours
//         const checkIn = new Date(request.details.corrected_check_in);
//         const checkOut = new Date(request.details.corrected_check_out);

//         const workHours = Math.abs((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)); // เปลี่ยน ms -> ชั่วโมง

//         // อัปเดต work_hours ใน Attendance
//         updatedAttendance.work_hours = workHours.toFixed(2); // จำกัดทศนิยม 2 ตำแหน่ง
//         await updatedAttendance.save();

//         return res.status(200).json({
//             code: "Success-01-0004",
//             status: "Success",
//             data: {
//                 msg: "WorkInfo and Attendance updated successfully",
//                 updatedAttendance,
//             },
//         });
//     } catch (error) {
//         console.error("Error approving request and updating Attendance:", error);
//         res.status(500).json({
//             code: "ERROR-01-0007",
//             status: "Error",
//             data: {
//                 msg: "An error occurred while approving the request and updating Attendance",
//             },
//         });
//     }
// });

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
        const startOfDay = new Date(date);
        const endOfDay = new Date(date);
        endOfDay.setDate(endOfDay.getDate() + 1); // เพิ่มเป็นวันถัดไป
  
        query = {
          overtime_date: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
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
  
//Api 
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
  
export { upload }
export default requests