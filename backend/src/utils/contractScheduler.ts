import cron from 'node-cron';
import Employee from '../models/Employee';
import Notification from '../models/Notification';

// 👉 ลอง require แบบ lazy load เฉพาะตอนใช้งาน
let io: any;
try {
  io = require('../app').io;
} catch (e) {
  console.warn('⚠️ No io loaded (testing mode)');
}

// ✅ export function ไว้ให้ test เรียก
export const checkContractStatus = async () => {
  console.log('📅 เริ่มตรวจสอบสัญญาพนักงาน...');

  try {
    const today = new Date();
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

    const employees = await Employee.find({ status: 'Active' });

    for (const employee of employees) {
      if (!employee.contract_end_date) continue;

      const timeDiff = new Date(employee.contract_end_date).getTime() - today.getTime();

      if (timeDiff <= SEVEN_DAYS && (!employee.renewal_status || employee.renewal_status === 'None')) {
        employee.renewal_status = 'Pending';
        await employee.save();

        await Notification.create({
          employee_id: "20240001",
          category: 'contract',
          message: 'มีพนักงานรอการต่อสัญญา',
          details: `พนักงาน ${employee.first_name} (${employee.employee_id}) ใกล้หมดสัญญา`,
        });

        // ✅ Emit แบบมีเงื่อนไข (ถ้าไม่ได้โหลด io ก็ไม่พัง)
        if (io) {
          io.emit('contract_renewal_pending', {
            message: 'มีพนักงานรอการต่อสัญญา',
            employee: {
              name: employee.first_name,
              employee_id: employee.employee_id,
              contract_end_date: employee.contract_end_date,
            },
          });
        }

        console.log(`🔔 แจ้งเตือน: ${employee.employee_id} → Pending`);
      }

      if (timeDiff < 0 && employee.renewal_status !== 'Approved') {
        employee.status = 'Inactive';
        await employee.save();
        console.log(`⛔ หมดสัญญา: ${employee.employee_id}`);
      }
    }
  } catch (err) {
    console.error('❌ contractScheduler error:', err);
  }
};

cron.schedule('0 0 * * *', checkContractStatus);
