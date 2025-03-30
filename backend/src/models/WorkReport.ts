import mongoose, { Schema, Document } from 'mongoose';

interface IWorkReport extends Document {
  report_id: string; // รหัสรายงาน
  employee_id: string; // รหัสพนักงาน
  check_in_time?: Date; // เวลาเข้า
  check_out_time?: Date; // เวลาออก
  type_work: string; // ประเภทงาน
  detail_work: string; // รายละเอียดงาน
  total_hours?: number; // ชั่วโมงทั้งหมด
  overtime_hours?: number; // ชั่วโมงทำงานล่วงเวลา
  leaves?: number; // จำนวนวันที่ลา
  status: 'Present' | 'Absent' | 'Leave' | 'Sick Leave'; // สถานะการทำงาน
  created_at: Date; // วันที่สร้าง
  updated_at: Date; // วันที่อัปเดต
}

const WorkReportSchema: Schema = new Schema(
  {
    report_id: {
      type: String,
      required: true,
      unique: true, // ให้รหัสรายงานไม่ซ้ำกัน
      default: () => `WR-${Date.now()}`, // สร้างค่า default อัตโนมัติ
    },
    employee_id: {
      type: String,
      required: true, // รหัสพนักงานเป็นข้อมูลที่จำเป็น
    },
    check_in_time: {
      type: Date,
      required: false, // เวลาเข้างานเป็นข้อมูลที่ไม่จำเป็น
    },
    check_out_time: {
      type: Date,
      required: false, // เวลาออกงานเป็นข้อมูลที่ไม่จำเป็น
    },
    type_work: {
      type: String,
      required: true, // ประเภทงานเป็นข้อมูลที่จำเป็น
    },
    detail_work: {
      type: String,
      required: true, // รายละเอียดงานเป็นข้อมูลที่จำเป็น
    },
    total_hours: {
      type: Number,
      required: false, // ชั่วโมงรวมเป็นข้อมูลที่ไม่จำเป็น
      default: 0, // กำหนดค่าเริ่มต้นเป็น 0
    },
    overtime_hours: {
      type: Number,
      required: false, // ชั่วโมงทำงานล่วงเวลาเป็นข้อมูลที่ไม่จำเป็น
      default: 0, // กำหนดค่าเริ่มต้นเป็น 0
    },
    leaves: {
      type: Number,
      required: false, // จำนวนวันที่ลาเป็นข้อมูลที่ไม่จำเป็น
      default: 0, // กำหนดค่าเริ่มต้นเป็น 0
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Leave', 'Sick Leave'], // กำหนดค่าที่อนุญาต
      required: true, // สถานะเป็นข้อมูลที่จำเป็น
    },
    created_at: {
      type: Date,
      default: Date.now, // วันที่สร้างจะถูกตั้งค่าเป็นวันที่ปัจจุบันโดยอัตโนมัติ
    },
    updated_at: {
      type: Date,
      default: Date.now, // วันที่อัปเดตจะถูกตั้งค่าเป็นวันที่ปัจจุบันโดยอัตโนมัติ
    },
  },
  { collection: 'WorkReport', timestamps: true } // ใช้ timestamps เพื่อบันทึก created_at และ updated_at
);

const WorkReport = mongoose.model<IWorkReport>('WorkReport', WorkReportSchema);

export default WorkReport;
