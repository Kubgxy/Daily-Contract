import mongoose, { Schema, Document } from "mongoose";

// Interface และ Schema หลักของ Request

interface IRequest extends Document {
  employee_id: string;
  type: "leaveRequest" | "overtimeRequest" | "workInfoRequest";
  status: "Pending" | "Approved" | "Rejected";
  created_at: Date;
  updated_at: Date;
  details: Record<string, unknown>;
  approved_by: string;
}

const RequestSchema: Schema = new Schema(
  {
    employee_id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["leaveRequest", "overtimeRequest", "workInfoRequest"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    details: {
      type: Object,
      required: true,
    },
    approved_by: { 
      type: String 
    },
  },
  { collection: "Requests" }
);


const Request = mongoose.model<IRequest>("Requests", RequestSchema);

export default Request;
