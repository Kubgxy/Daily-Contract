import mongoose, { Schema, Document } from 'mongoose';

// กำหนด interface สำหรับการตรวจสอบ structure ของ Attendance document
interface IAttendance extends Document {
  attendance_id: string;
  employee_id: string; // กำหนดเป็น string แทน ObjectId
  attendance_date: Date;
  check_in_time: Date | null;
  check_out_time: Date | null;
  work_hours: string | null;
  status: 'Present' | 'Leave' | 'Sick Leave' | 'Absent';
}

// สร้าง schema ของ Attendance
const AttendanceSchema: Schema = new Schema({
  attendance_id: { type: String, required: true, unique: true },
  employee_id: { type: String, required: true }, // กำหนดเป็น string สำหรับอ้างอิงถึง employee_id
  attendance_date: { type: Date, required: true },
  check_in_time: { type: Date, default: null },
  check_out_time: { type: Date, default: null },
  work_hours: { type : String, default: null},
  status: { 
    type: String, 
    enum: ['Present', 'Leave', 'Sick Leave', 'Absent'],
    required: true 
  }
}, { collection: 'Attendance' });

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
