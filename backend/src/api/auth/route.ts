import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Models
import Employee, { IEmployee } from "../../models/Employee";
import OtpToken from "../../models/OtpToken";
import LoginAttempt from "../../models/LoginAttempt";
import { upload } from "../requests/route";
import { verifyToken } from "../../middleware/verifyToken";
import { sendEmail } from "../../utils/sendEmail";

const auth = express.Router();
const SECRET_KEY =
  process.env.SECRET_KEY || "japaitarmhasecrettummai-secretuyounii"; // ใช้ ENV สำหรับความปลอดภัย

// API Register
auth.post(
  "/register",
  upload.single("avatar"),
  async (req: Request, res: Response) => {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      address,
      username,
      password,
      role,
      contract_start_date,
      contract_end_date,
      position,
      detail,
    } = req.body;

    try {
      // Validation ของข้อมูลที่จำเป็น
      console.log(req.body);
      if (
        !username ||
        !password ||
        !email ||
        !first_name ||
        !last_name ||
        !role ||
        !contract_start_date ||
        !contract_end_date ||
        !position ||
        !detail
      ) {
        return res.status(400).json({ message: "Missing field!!!" });
      }

      // ค้นหา employee_id ล่าสุด
      const lastEmployee = await Employee.findOne().sort({ employee_id: -1 });

      // ตรวจสอบ username หรือ email ซ้ำ
      const existingUser = await Employee.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Username or Email already exists" });
      }

      // เข้ารหัสรหัสผ่าน
      const hashedPassword = await bcrypt.hash(password, 10);

      // สร้าง employee_id ใหม่
      const employeeId = lastEmployee
        ? (Number(lastEmployee.employee_id) + 1).toString().padStart(8, "0") // เพิ่ม 1 และจัดรูปแบบ
        : "20240001"; // กำหนดค่าเริ่มต้นเมื่อฐานข้อมูลว่าง
      req.body.employee_id = employeeId; // กำหนดค่า employeeId ใน req.body

      // กำหนด path ของ avatar
      const avatarPath = req.file ? `/uploads/${req.file.filename}` : null;

      // สร้างผู้ใช้ใหม่ในฐานข้อมูล
      const newEmployee = new Employee({
        employee_id: employeeId,
        first_name,
        last_name,
        email,
        phone_number,
        address,
        username,
        password: hashedPassword,
        contract_start_date,
        contract_end_date,
        position,
        detail,
        role,
        avatar: avatarPath,
      });

      await newEmployee.save();

      return res
        .status(201)
        .json({
          message: "User registered successfully",
          employee: newEmployee,
        });
    } catch (error) {
      console.error("Error in registration:", error);
      return res
        .status(500)
        .json({ message: "Server error in registration", error });
    }
  }
);

// API Login
auth.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log("🔥 Login Request:", req.body);

  try {
    console.log("🔍 Checking login for:", username, typeof username);
    console.log("🔍 Converted:", String(username), typeof String(username));

    // ค้นหาผู้ใช้โดยใช้ username
    const inputUsername = String(username); // ✅ บังคับให้เป็น string
    const user = await Employee.findOne({
      $or: [
        { username: inputUsername },
        { employee_id: inputUsername }
      ]
    });

    console.log("🧍 Found user:", user);

    if (!user) {
      await LoginAttempt.create({
        employee_id: null,
        attempt_date: new Date(),
        is_successful: false,
        ip_address: req.ip,
      });
      return res.status(400).json({ message: "Invalid username" });
    }

    // ตรวจสอบ password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await LoginAttempt.create({
        employee_id: user._id,
        attempt_date: new Date(),
        is_successful: false,
        ip_address: req.ip,
      });
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // ✅ สร้าง JWT Token
    const token = jwt.sign(
      { userId: user._id, employee_id: user.employee_id, role: user.role, position: user.position },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // ✅ เก็บ Token ใน HttpOnly Cookie
    res.cookie("employee_token", token, {
      httpOnly: true, // ❌ ป้องกัน JavaScript ดึง Token (XSS Protection)
      // secure: true, // ต้องเป็น true ถ้าใช้กับ cross-origin + chrome
      // sameSite: "none", // สำคัญมาก!!!
      secure: false,        // ✅ สำหรับ dev (ถ้า prod ต้อง true + https)
      sameSite: "strict",   // ✅ ต้อง strict ถ้าใช้ localhost ทั้ง frontend + backend
      maxAge: 3600000, // 1 ชั่วโมง
    });

    // ✅ บันทึกการล็อกอินที่สำเร็จ
    await LoginAttempt.create({
      employee_id: user._id,
      attempt_date: new Date(),
      is_successful: true,
      ip_address: req.ip,
    });

    // ✅ ส่งเฉพาะข้อมูล User (ไม่ส่ง Token แล้ว)
    return res.status(200).json({
      message: "Login successful",
      user: {
        employee_id: user.employee_id,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
        position: user.position,
        detail: user.detail,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ message: "Server error in login" });
  }
});

auth.get("/employees/me", verifyToken, async (req: Request, res: Response) => {
  const employeeId = req.user?.employee_id; // ✅ เปลี่ยนตรงนี้
  console.log("🧁 Cookies:", req.cookies); // ✅ เพิ่มบรรทัดนี้ชั่วคราว

  try {
    const employee = await Employee.findOne({ employee_id: employeeId }).select(
      "-password"
    );
    if (!employee)
      return res.status(404).json({ message: "ไม่พบข้อมูลพนักงาน" });

    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// API Logout
auth.post("/logout", async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error in logout:", error);
    return res.status(500).json({ message: "Server error in logout" });
  }
});

// API ใช้สำหรับการสร้างรหัส Otp
auth.post("/request-reset", async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res
        .status(404)
        .json({ status: "error", message: "Employee not found" });
    }

    // เช็คจำนวน OTP ที่ขอในช่วง 1 ชั่วโมง
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const otpRequestsInLastHour = await OtpToken.countDocuments({
      email,
      createdAt: { $gte: oneHourAgo },
    });

    if (otpRequestsInLastHour >= 5) {
      return res
        .status(429)
        .json({
          status: "error",
          message: "ขอ OTP ได้ไม่เกิน 5 ครั้งต่อชั่วโมง",
        });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const ref = Math.random().toString(36).substring(2, 8).toUpperCase(); 
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OtpToken.create({
      email,
      otp,
      ref,
      expiresAt,
      verified: false,
      attempts: 0,
      requestCount: otpRequestsInLastHour + 1,
      lastRequestAt: new Date(),
    });

    await sendEmail(
      email,
      "รหัส OTP สำหรับรีเซ็ตรหัสผ่านระบบ Daily Contract",
      `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>📌 รหัส OTP ของคุณ</h2>
        <p>เรียนคุณผู้ใช้,</p>
        <p>เราได้รับคำขอรีเซ็ตรหัสผ่านของคุณสำหรับระบบ <b>Daily Contract</b></p>
    
        <p>กรุณาใช้รหัส OTP ด้านล่างเพื่อดำเนินการต่อ:</p>
    
        <div style="background-color: #f2f2f2; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="font-size: 18px;"><b>🔐 OTP:</b> <span style="color: #007BFF;">${otp}</span></p>
          <p style="font-size: 18px;"><b>🆔 Ref Code:</b> <span style="color: #FF5733;">${ref}</span></p>
        </div>
    
        <p>⏳ รหัสนี้จะหมดอายุใน <b>10 นาที</b></p>
    
        <p>หากคุณไม่ได้ทำรายการนี้ กรุณา <i>ไม่ต้องดำเนินการใด ๆ</i></p>
    
        <p>ขอบคุณครับ/ค่ะ<br/>ทีมงาน Daily Contract</p>
      </div>
      `
    );    

    return res.status(200).json({
      status: "success",
      message: "OTP ส่งเรียบร้อย",
      ref,
      expiresAt,  
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res
      .status(500)
      .json({ status: "error", message: "ส่ง OTP ล้มเหลว" });
  }
});

// API ใช้สำหรับการตรวจสอบรหัส OTP
auth.post("/verify-otp", async (req: Request, res: Response) => {
  const { email, otp, ref } = req.body;

  if (!email || !otp || !ref) {
    return res
      .status(400)
      .json({ status: "error", message: "กรุณาระบุ email, otp และ ref" });
  }

  try {
    const otpToken = await OtpToken.findOne({ email, ref, verified: false });

    if (!otpToken) {
      return res
        .status(404)
        .json({ status: "error", message: "ไม่พบ OTP หรือถูกใช้ไปแล้ว" });
    }

    if (otpToken.attempts >= 5) {
      return res
        .status(400)
        .json({ status: "error", message: "คุณกรอก OTP เกิน 5 ครั้ง" });
    }

    if (otpToken.expiresAt < new Date()) {
      return res
        .status(400)
        .json({ status: "error", message: "OTP หมดอายุแล้ว" });
    }

    if (otp !== otpToken.otp) {
      await OtpToken.updateOne(
        { email, ref, verified: false },
        { $inc: { attempts: 1 } }
      );
      return res.status(400).json({
        status: 'error',
        message: 'Invalid OTP',
      });
    }

    await OtpToken.updateOne(
      { _id: otpToken._id },
      { $set: { verified: true } }
    );
    await OtpToken.deleteMany({
      email,
      verified: false,
      _id: { $ne: otpToken._id },
    });

    return res.status(200).json({ status: "success", message: "OTP ถูกต้อง" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res
      .status(500)
      .json({ status: "error", message: "เกิดข้อผิดพลาดในการตรวจสอบ OTP" });
  }
});

// API ใช้สำหรับการเปลี่ยนรหัสผ่าน
auth.post("/reset-password", async (req: Request, res: Response) => {
  const { email, newPassword, confirmPassword } = req.body;

  if ( !newPassword || !confirmPassword) {
    return res.status(400).json({
      status: "error",
      message: "Email, new password, and confirm password are required",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      status: "error",
      message: "New password and confirm password do not match",
    });
  }

  try {
    const otpRecord = await OtpToken.findOne({ email, verified: true });

    if (!otpRecord) {
      return res.status(400).json({
        status: "error",
        message: "Invalid OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await Employee.updateOne({ email }, { $set: { password: hashedPassword } });

    await OtpToken.deleteMany({ email });

    return res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to reset password",
    });
  }
});

// Api สำหรับหา Emp loyeeID
auth.get("/employees/:employee_id", async (req, res) => {
  try {
    const employee = await Employee.find({
      employee_id: req.params.employee_id,
    }).populate("employee_id");
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ data: employee });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// API เพื่อตรวจสอบประวัติการล็อกอินของพนักงานตาม employee_id
auth.get(
  "/login-attempts/employee_id/:employee_id",
  async (req: Request, res: Response) => {
    try {
      const loginAttempts = await LoginAttempt.find({
        employee_id: req.params.employee_id,
      }).populate("employee_id");

      if (!loginAttempts || loginAttempts.length === 0) {
        return res
          .status(404)
          .json({ message: "No login attempts found for this employee" });
      }

      const results = loginAttempts.map((attempt) => ({
        is_successful: attempt.is_successful,
        ip_address: attempt.ip_address,
        attempt_date: attempt.attempt_date,
        employee: attempt.employee_id
          ? {
              first_name: (attempt.employee_id as unknown as IEmployee)
                .first_name,
              last_name: (attempt.employee_id as unknown as IEmployee)
                .last_name,
              email: (attempt.employee_id as unknown as IEmployee).email,
              position: (attempt.employee_id as unknown as IEmployee).position,
            }
          : null,
      }));
      return res.status(200).json({ loginAttempts: results });
    } catch (error) {
      console.error("Error retrieving login attempts:", error);
      return res
        .status(500)
        .json({ message: "Server error retrieving login attempts" });
    }
  }
);

// Api ค้นหา employeeId ที่มีอยู่
auth.get("/generate-employee-id", async (req: Request, res: Response) => {
  try {
    // ค้นหา Employee ID ล่าสุด
    const lastEmployee = await Employee.findOne().sort({ employee_id: -1 });

    // ถ้าไม่มี Employee ในฐานข้อมูล กำหนดค่าเริ่มต้นเป็น 20240001
    const newEmployeeId = lastEmployee
      ? (parseInt(lastEmployee.employee_id) + 1).toString().padStart(8, "0")
      : "20240001";

    res.status(200).json({ employee_id: newEmployeeId });
  } catch (error) {
    console.error("Error generating employee ID:", error);
    res.status(500).json({
      code: "ERROR-02-0005",
      status: "Error",
      data: { msg: "Failed to generate employee ID", error },
    });
  }
});

export default auth;
