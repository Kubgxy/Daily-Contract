import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import http from "http"; // ✅ เพิ่มสำหรับ Socket.IO
import { Server } from "socket.io"; // ✅ Socket.IO
import cookieParser from "cookie-parser";
import { useSwagger } from "./middleware/swagger";
import './utils/contractScheduler';

dotenv.config();

const app = express();
const server = http.createServer(app); // ✅ แทน app.listen เพื่อให้ใช้กับ Socket ได้

// ✅ ส่วนที่สร้าง Socket.IO server
const io = new Server(server, {
  cors: {
    // ✅ แก้ตรงนี้ เพื่อให้รองรับทั้ง localhost และ Docker
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  },
});

const onlineUsers = new Map<string, string>(); // ✅ employee_id → socketId

// ✅ จัดการการเชื่อมต่อของ Socket
io.on("connection", (socket) => {
  console.log("🔥 Client connected:", socket.id);

  socket.on("register", (employee_id: string) => {
    if (!employee_id) {
      console.log("❌ Register failed: employee_id is undefined");
    } else {
      console.log("✅ Registered:", employee_id);
      onlineUsers.set(employee_id, socket.id);
    }
  });

  socket.on("disconnect", () => {
    for (const [empId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(empId);
        console.log(`❌ Disconnected: ${empId}`);
        break;
      }
    }
  });
});

// ✅ export ไปใช้ใน route ต่าง ๆ
export { io, onlineUsers };

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/uploads", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.static("public"));
app.use(helmet());
useSwagger(app);

// ✅ Multer Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

interface MulterRequest extends Request {
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
}

const uploadMiddleware = upload.single("attachment") as express.RequestHandler;

app.post("/api/upload", uploadMiddleware, ((req, res) => {
  const typedReq = req as MulterRequest;
  if (!typedReq.file) {
    return res.status(400).json({
      code: "ERROR-02-0001",
      status: "Error",
      data: { msg: "No file uploaded" },
    });
  }
  const fileUrl = `/uploads/${typedReq.file.filename}`;
  res.status(200).json({
    code: "SUCCESS-02-0001",
    status: "success",
    data: {
      filename: typedReq.file.filename,
      path: fileUrl,
      msg: "File uploaded successfully",
    },
  });
}) as express.RequestHandler);

app.get("/", (req, res) => {
  res.send("Hello from Express + Socket.IO! 🚀");
});

// ✅ เชื่อม MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ✅ นำเข้า Route
import data from './api/data/route';
import auth from './api/auth/route';
import requests from "./api/requests/route";
import WorkInfo from "./api/workinfo/route";
import renewal from "./api/renewal/route";

app.use('/api/data', data);
app.use('/api/auth', auth);
app.use('/api/requests', requests);
app.use('/api/workinfo', WorkInfo);
app.use('/api/renewal', renewal);

// ✅ เริ่มต้นเซิร์ฟเวอร์ด้วย server.listen แทน app.listen
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
