// ✅ middleware/requireManagerOrAdmin.ts
import { Request, Response, NextFunction } from "express";

export const requireManagerOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.role;

  if (role !== "Manager" && role !== "Admin") {
    return res.status(403).json({
      code: "ERROR-01-0003",
      status: "Error",
      data: {
        msg: "Unauthorized: Manager or Admin only",
      },
    });
  }

  next(); // ✅ ผ่านแล้วไปต่อ
};
