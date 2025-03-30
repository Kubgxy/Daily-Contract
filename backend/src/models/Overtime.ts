import mongoose, { Schema, Document } from 'mongoose';

interface IOvertime extends Document {
    employee_id: number;
    overtime_date: Date;
    start_time: string;
    end_time: string;
    overtime_hours: number;
    approved_by: string;
}

const OvertimeSchema: Schema = new Schema({
    employee_id: { type: Number, required: true },
    overtime_date: { type: Date, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    overtime_hours: { type: Number, required: true },
    approved_by: { type: String, required: true },
},{collection : "Overtimes"});

const Overtime = mongoose.model<IOvertime>("Overtime", OvertimeSchema);
export default Overtime;
