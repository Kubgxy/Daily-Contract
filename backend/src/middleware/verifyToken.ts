import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// ถ้ายังไม่ได้ตั้ง ENV ก็ใช้ fallback string
const SECRET_KEY = process.env.SECRET_KEY || "japaitarmhasecrettummai-secretyounii";

// ✨ ประกาศ Type สำหรับ req.user เพื่อให้ TypeScript เข้าใจ
interface JwtPayload {
  userId: string;
  employee_id: string;
  role: string;
  position: string; // ✅ เพิ่มตรงนี้เลย
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// ✅ Middleware ตรวจสอบ JWT จาก Cookie
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.employee_token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
