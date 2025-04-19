// routes/workLocation.ts
import express from "express";
import LocationConfig from "../../models/LocationConfig";
import { requireManagerOrAdmin } from "../../middleware/requireManagerOrAdmin";
import { verifyToken } from "../../middleware/verifyToken";
import { Request, Response } from "express";

const worklocation = express.Router();
worklocation.use(verifyToken); // ✅ ใช้ middleware ตรวจสอบ JWT

// ดึง config ปัจจุบัน
worklocation.get("/location", async (req, res) => {
  const config = await LocationConfig.findOne({
    name: "สถานที่ทำงานของพวกวายร้าย",
  });
  res.json(config);
});

// อัปเดต config
worklocation.patch("/configlocation", requireManagerOrAdmin,async (req: Request, res: Response) => {
  
    const { latitude, longitude, radius } = req.body;
    const config = await LocationConfig.findOneAndUpdate(
      { name: "สถานที่ทำงานของพวกวายร้าย" },
      { latitude, longitude, radius },
      { new: true, upsert: true }
    );
    res.json(config);
  }
);

export default worklocation;
