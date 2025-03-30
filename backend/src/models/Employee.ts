import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  username: string;
  password: string;
  contract_start_date: Date;
  contract_end_date: Date;
  position: string;
  status: string;
  avatar: string;
  detail: string;
  type_contract: string;
  role: string; // เพิ่มฟิลด์ role
  renewal_status: string;
}

const EmployeeSchema: Schema = new Schema({
  employee_id: { type: String, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: String,
  address: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  position: String,
  detail: { type: String },
  contract_start_date: Date,
  contract_end_date: Date,
  type_contract: { type: String, default: 'รายวัน' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  renewal_status: {
    type: String,
    enum: ['None', 'Pending', 'Approved', 'Rejected'],
    default: 'None',
  },
  role: { type: String, enum: ['Admin', 'Manager', 'Employee'], required: true, default: 'Employee' }, // เพิ่มฟิลด์ role
  avatar: { type: String },
}, { collection: 'Employee', timestamps: true });

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);