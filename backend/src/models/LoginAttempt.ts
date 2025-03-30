import mongoose, { Schema, Document } from "mongoose";

interface ILoginAttempt extends Document {
    employee_id: mongoose.Types.ObjectId; // ObjectId ของ Employee ที่เชื่อมโยง
    attempt_date: Date;
    is_successful: boolean;
    ip_address: string;
}

const LoginAttemptSchema: Schema = new Schema({
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    attempt_date: { type: Date, default: Date.now },
    is_successful: { type: Boolean, required: true },
    ip_address: { type: String, required: true },
}, { collection: 'LoginAttempt' });

export default mongoose.model<ILoginAttempt>('LoginAttempt', LoginAttemptSchema);