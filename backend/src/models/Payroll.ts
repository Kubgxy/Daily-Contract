import mongoose, { Schema, Document } from "mongoose";

interface IPayroll extends Document {
  employee_id: string;
  employee_name: string;
  work_hours: string;
  overtime_hours: number;
  SalaryOfDay: number;
  SalaryOfOvertime: number;
  TotalSalary: number;
  created_at: Date;
  statusPayroll: { type: String, default: "UnPaid" },
}

const PayrollSchema: Schema = new Schema(
  {
    employee_id: { type: String, required: true, unique: true },
    employee_name: { type: String, required: true },
    work_hours: { type: String, default: "N/A" },
    overtime_hours: { type: Number, default: 0 },
    SalaryOfDay: { type: Number, default: 0 },
    SalaryOfOvertime: { type: Number, default: 0 },
    TotalSalary: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    statusPayroll: {
      type: String,
      enum: ["UnPaid", "paid"], // กำหนดค่าที่อนุญาต
      default: "UnPaid",
    },
  },
  { collection: "Payroll" }
);

export default mongoose.model<IPayroll>("Payroll", PayrollSchema);
