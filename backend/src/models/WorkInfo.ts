import mongoose, { Schema, Document } from 'mongoose';

interface WorkInfoDocument extends Document {
  report_id: string;
  employee_id: string;
  work_date: Date;
  detail_work: string;
  position: string;
  task: string;
  hours: number;
  status: string;
  note?: string;
  note_from_manager?: string;
  created_at: Date;
  updated_at: Date;
}

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
};

const WorkInfoSchema: Schema = new Schema(
  {
    report_id: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `WL-${year}${month}${day}-${Math.random()
          .toString(36)
          .substr(2, 3)
          .toUpperCase()}`;
      },
    },
    employee_id: {
      type: String,
      required: true,
    },
    work_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    detail_work: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
      enum: Object.keys(positionTasks), // ✅ enum ตรงจากตำแหน่งจริง
    },
    task: {
      type: String,
      required: true,
    },
    hours: {
      type: Number,
      required: true,
      min: 0.5,
      max: 7,
    },
    status: {
      type: String,
      enum: ["Pending", "Success", "Fail"],
      required: true,
      default: "Pending",
    },
    note: {
      type: String,
      required: false,
    },
    note_from_manager: {
      type: String,
      default: "",
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "WorkInfo",
    timestamps: true,
  }
);

// ✅ ฝัง tasks สำหรับแต่ละตำแหน่งไว้ใน Schema แบบ static




// ✅ compound index
WorkInfoSchema.index({ employee_id: 1, work_date: 1 }, { unique: true });

export default mongoose.model<WorkInfoDocument>("WorkInfo", WorkInfoSchema);
