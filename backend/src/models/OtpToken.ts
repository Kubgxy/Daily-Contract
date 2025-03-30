import mongoose, { Schema, Document } from "mongoose";

export interface IOtpToken extends Document {
  email: string;
  otp: string;
  ref: string;
  expiresAt: Date;
  verified: boolean;
  attempts: number;
  requestCount: number;
  lastRequestAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const OtpTokenSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    ref: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
    requestCount: { type: Number, default: 1 },
    lastRequestAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "OtpToken" }
);

const OtpToken = mongoose.model<IOtpToken>("OtpToken", OtpTokenSchema);

export default OtpToken;
