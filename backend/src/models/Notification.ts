import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Import uuid เพื่อสร้าง UUID

// Interface สำหรับ Notification
interface INotification extends Document {
  notification_id: string; // เพิ่มฟิลด์ notification_id
  employee_id: string;
  category: string;
  message: string;
  details: string;
  is_read: string;
  created_at: Date;
}

// Schema สำหรับ Notification
const notificationSchema = new Schema<INotification>(
  {
    notification_id: {
      type: String,
      default: uuidv4, // กำหนดค่าเริ่มต้นให้ใช้ uuidv4()
      unique: true, // กำหนดให้ฟิลด์นี้ต้องไม่ซ้ำกัน
      required: true, // ฟิลด์นี้ต้องมีค่า
    },
    employee_id: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    is_read: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "Notifications" }
);

// สร้าง Model สำหรับ Notification
const Notification = model<INotification>("Notification", notificationSchema);

export default Notification;
