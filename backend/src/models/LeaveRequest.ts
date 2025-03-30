import mongoose, { Schema, Document } from 'mongoose';

// Interface สำหรับ LeaveRecords
interface ILeaveRecord extends Document {
    employee_id: string;
    leave_type: string;
    start_date: Date;
    end_date: Date;
    reason: string;
    approved_by: string;
    created_at?: Date; // Optional เนื่องจากมี default
}

// Schema สำหรับ LeaveRecords
const LeaveRecordSchema: Schema = new Schema(
    {
        employee_id: { type: String, required: true },
        leave_type: { type: String, required: true },
        start_date: { type: Date, required: true },
        end_date: { type: Date, required: true },
        reason: { type: String, required: true },
        approved_by: { type: String, required: true },
        created_at: { type: Date, default: Date.now },
    },
    { collection: 'LeaveRecords' } // ชื่อ collection ใน MongoDB
);

// โมเดล LeaveRecords
const LeaveRecords = mongoose.model<ILeaveRecord>('LeaveRecords', LeaveRecordSchema);

export default LeaveRecords;