import PropTypes from 'prop-types';

const RequestDetailsModal = ({ isOpen, onClose, request }) => {
  if (!isOpen || !request) return null;

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    return new Date(dateTimeStr).toLocaleString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">รายละเอียดคำขอ</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {request.type === "leaveRequest" && (
            <>
              <p className="flex justify-between border-b pb-2">
                <span className="font-medium">ประเภทการลา:</span>
                <span>{request.details.leave_type}</span>
              </p>
              <p className="flex justify-between border-b pb-2">
                <span className="font-medium">วันที่เริ่มลา:</span>
                <span>{request.details.start_date}</span>
              </p>
              <p className="flex justify-between border-b pb-2">
                <span className="font-medium">วันที่สิ้นสุด:</span>
                <span>{request.details.end_date}</span>
              </p>
              <p className="flex justify-between border-b pb-2">
                <span className="font-medium">เหตุผล:</span>
                <span>{request.details.reason}</span>
              </p>
            </>
          )}

          {request.type === "overtimeRequest" && (
            <>
              <p className="flex justify-between border-b pb-2">
                <span className="font-medium">วันที่ขอ OT:</span>
                <span>{request.details.overtime_date}</span>
              </p>
              <p className="flex justify-between border-b pb-2">
                <span className="font-medium">เวลาเริ่ม:</span>
                <span>{request.details.start_time}</span>
              </p>
              <p className="flex justify-between border-b pb-2">
                <span className="font-medium">เวลาสิ้นสุด:</span>
                <span>{request.details.end_time}</span>
              </p>
              <p className="flex justify-between border-b pb-2">
                <span className="font-medium">เหตุผล:</span>
                <span>{request.details.reason}</span>
              </p>
            </>
          )}

          {request.type === "workInfoRequest" && (
            <>
              <p className="flex justify-between border-b pb-2">
                <span className="font-medium">เวลาเข้าเดิม:</span>
                <span>{formatDateTime(request.details.original_check_in)}</span>
              </p>
              <p className="flex justify-between border-b pb-2">
                <span className="font-medium">เวลาออกเดิม:</span>
                <span>{formatDateTime(request.details.original_check_out)}</span>
              </p>
              <p className="flex justify-between border-b pb-2">
                <span className="font-medium">เวลาเข้าที่แก้ไข:</span>
                <span>{formatDateTime(request.details.corrected_check_in)}</span>
              </p>
              <p className="flex justify-between border-b pb-2">
                <span className="font-medium">เวลาออกที่แก้ไข:</span>
                <span>{formatDateTime(request.details.corrected_check_out)}</span>
              </p>
              <p className="flex justify-between border-b pb-2">
                <span className="font-medium">เหตุผล:</span>
                <span>{request.details.reason}</span>
              </p>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

// เพิ่ม PropTypes
RequestDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  request: PropTypes.shape({
    type: PropTypes.string.isRequired,
    details: PropTypes.shape({
      leave_type: PropTypes.string,
      start_date: PropTypes.string,
      end_date: PropTypes.string,
      reason: PropTypes.string,
      overtime_date: PropTypes.string,
      start_time: PropTypes.string,
      end_time: PropTypes.string,
      original_check_in: PropTypes.string,
      original_check_out: PropTypes.string,
      corrected_check_in: PropTypes.string,
      corrected_check_out: PropTypes.string,
    }).isRequired,
  }),
};

export default RequestDetailsModal;