import cron from 'node-cron';
import Employee from '../models/Employee';
import Notification from '../models/Notification';
import type { Server } from 'socket.io';

import { onlineUsers } from '../app'; // ✅ ดึง onlineUsers มาใช้

let io: Server | undefined;

(async () => {
  try {
    const appModule = await import('../app');
    io = appModule.io;
  } catch {
    console.warn('⚠️ No io loaded (testing mode)');
  }
})();

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
          employee_id: 'SYSTEM',
          category: 'contract',
          message: 'มีพนักงานรอการต่อสัญญา',
          details: `พนักงาน ${employee.first_name} (${employee.employee_id}) ใกล้หมดสัญญา`,
        });

        await Notification.create({
          employee_id: employee.employee_id,
          category: 'contract',
          message: 'สัญญาการทำงานของคุณใกล้หมดอายุ',
          details: `พนักงาน ${employee.first_name} (${employee.employee_id}) ใกล้หมดสัญญาในการทำงาน ถ้าหากคุณต้องการต่อสัญญา กรุณาติดต่อ HR`,
        });

        // ✅ เพิ่มส่วนนี้: แจ้งเตือนเฉพาะ socket ของพนักงาน
        const socketId = onlineUsers.get(employee.employee_id);
        if (io && socketId) {
          io.to(socketId).emit('contract_renewal_pending', {
            message: 'สัญญาการทำงานของคุณใกล้หมดอายุ',
            employee: {
              name: employee.first_name,
              employee_id: employee.employee_id,
              contract_end_date: employee.contract_end_date,
            },
          });
          console.log(`📤 ส่ง Socket แจ้งเตือนให้พนักงาน ${employee.employee_id}`);
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
