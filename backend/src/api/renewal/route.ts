import express, { Request, Response } from "express";
import dotenv from "dotenv";

//Models
import Employee from "../../models/Employee";

//Middleware
import { verifyToken } from "../../middleware/verifyToken";
import { requireManagerOrAdmin } from "../../middleware/requireManagerOrAdmin";

const renewal = express.Router();
renewal.use(verifyToken);
dotenv.config();

// กำหนด secret key ไว้ตรวจสอบ token
const SECRET_KEY =
  process.env.SECRET_KEY || "japaitarmhasecrettummai-secretuyounii";
console.log("Your secret key is:", SECRET_KEY);

// API สำหรับดูสถานะการต่อสัญญาของพนักงาน (แบบสั้น)
renewal.get("/pending-count", requireManagerOrAdmin, async (req, res) => {
  try {
    const count = await Employee.countDocuments({ renewal_status: "Pending" });
    res.json({ status: "success", count });
  } catch (err) {
    console.error("❌ Error getting pending count:", err);
    res.status(500).json({ status: "error", message: "เกิดข้อผิดพลาด" });
  }
});

// API สำหรับดูสถานะการต่อสัญญาของพนักงาน
renewal.get("/renewal-requests", requireManagerOrAdmin, async (req, res) => {
    try {
      const pendingRenewals = await Employee.find({
        renewal_status: "Pending"
      });
  
      res.status(200).json({
        status: "success",
        data: pendingRenewals
      });
    } catch (err) {
      console.error("❌ Error fetching renewal requests:", err);
      res.status(500).json({ status: "error", message: "เกิดข้อผิดพลาด" });
    }
  });
  
// API สำหรับอนุมัติการต่อสัญญาของพนักงาน
renewal.patch("/renewal-approve/:id", requireManagerOrAdmin, async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) return res.status(404).json({ message: "ไม่พบพนักงาน" });
  
      const newStart = new Date(employee.contract_end_date);
      const newEnd = new Date(newStart);
      newEnd.setMonth(newEnd.getMonth() + 3); // เลื่อน 3 เดือน
  
      employee.contract_start_date = newStart;
      employee.contract_end_date = newEnd;
      employee.renewal_status = "Approved";
      employee.status = "Active";
  
      await employee.save();
  
      res.json({ status: "success", message: "ต่อสัญญาเรียบร้อยแล้ว" });
    } catch (err) {
      console.error("❌ Error approving renewal:", err);
      res.status(500).json({ status: "error", message: "เกิดข้อผิดพลาด" });
    }
  });
  
// API สำหรับปฏิเสธการต่อสัญญาของพนักงาน
renewal.patch("/renewal-reject/:id", requireManagerOrAdmin, async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) return res.status(404).json({ message: "ไม่พบพนักงาน" });
  
      employee.status = "Inactive";
      employee.renewal_status = "Rejected";
  
      await employee.save();
  
      res.json({ status: "success", message: "ปฏิเสธการต่อสัญญาเรียบร้อยแล้ว" });
    } catch (err) {
      console.error("❌ Error rejecting renewal:", err);
      res.status(500).json({ status: "error", message: "เกิดข้อผิดพลาด" });
    }
  });

export default renewal