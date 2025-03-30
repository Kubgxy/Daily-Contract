import cron from 'node-cron';
import Employee from '../models/Employee';
import Notification from '../models/Notification';
import mongoose from 'mongoose';
import { io } from '../app'; // ✅ เพิ่ม import Socket.IO server

// 🔁 รันทุกวันตอนเที่ยงคืน
cron.schedule('0 0 * * *', async () => {
  console.log('📅 เริ่มตรวจสอบสัญญาพนักงาน...');

  try {
    const today = new Date();
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

    // ดึงพนักงานที่ยัง Active
    const employees = await Employee.find({ status: 'Active' });

    for (const employee of employees) {
      if (!employee.contract_end_date) continue;

      const timeDiff = new Date(employee.contract_end_date).getTime() - today.getTime();

      // 💡 ถ้าเหลือไม่เกิน 7 วัน และยังไม่มีสถานะต่อสัญญา
      if (timeDiff <= SEVEN_DAYS) {
        if (!employee.renewal_status || employee.renewal_status === 'None') {
          employee.renewal_status = 'Pending';
          await employee.save();

          console.log(`🔔 แจ้งเตือน: พนักงาน ${employee.employee_id} ใกล้หมดสัญญา → รอการอนุมัติ`);

          // ✅ เพิ่ม Notification ลงฐานข้อมูล
          await Notification.create({
            employee_id: null, // ส่งถึง Admin ทุกคน
            category: 'contract',
            message: 'มีพนักงานรอการต่อสัญญา',
            details: `พนักงาน ${employee.first_name} (${employee.employee_id}) ใกล้หมดสัญญา`,
          });

          // ✅ ส่งแจ้งเตือนผ่าน Socket
          io.emit('contract_renewal_pending', {
            message: 'มีพนักงานรอการต่อสัญญา',
            employee: {
              name: employee.first_name,
              employee_id: employee.employee_id,
              contract_end_date: employee.contract_end_date,
            },
          });
        }
      }

      // ❌ ถ้าเลยวันหมดสัญญา และยังไม่กดยืนยัน
      if (timeDiff < 0 && employee.renewal_status !== 'Approved') {
        employee.status = 'Inactive';
        await employee.save();
        console.log(`⛔ ปิดใช้งาน: พนักงาน ${employee.employee_id} หมดสัญญาแล้ว`);
      }
    }
  } catch (err) {
    console.error('❌ ตรวจสอบสัญญาล้มเหลว:', err);
  }
});
