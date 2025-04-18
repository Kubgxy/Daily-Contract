import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "./../Components/Navbar";
import {
  Pencil, Save, User, Mail, Phone, Home, Lock, Eye, EyeOff, Settings,
} from "lucide-react";
import baseURL from '../utils/api';

function Setting() {
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/auth/employees/me`,
          { withCredentials: true }
        );
        const data = response.data;
        setEmployee({
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          phoneNumber: data.phone_number,
          address: data.address,
        });
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchEmployeeData();
  }, []);

  const updateEmployeeSetting = async (field) => {
    try {
      await axios.patch(
        `${baseURL}/api/data/settings`,
        { phone_number: employee.phoneNumber, address: employee.address },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      Swal.fire({
        icon: "success",
        title: `${field} updated successfully!`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      Swal.fire({
        icon: "error",
        title: `Failed to update ${field}.`,
        text: error.response?.data?.message || "An error occurred.",
      });
    }
  };

  const changePassword = async () => {
    try {
      await axios.patch(
        `${baseURL}/api/data/change-password`,
        {
          password,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      Swal.fire({
        icon: "success",
        title: "Password updated successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to update password.",
        text: error.response?.data?.message || "An error occurred.",
      });
    }
  };

  const handlePhoneEdit = () => setIsEditingPhone(true);
  const handlePhoneSave = () => {
    setIsEditingPhone(false);
    updateEmployeeSetting("Phone Number");
  };

  const handleAddressEdit = () => setIsEditingAddress(true);
  const handleAddressSave = () => {
    if (!employee.address.trim()) {
      Swal.fire({
        icon: "warning",
        title: "ไม่สามารถบันทึกได้",
        text: "กรุณากรอกที่อยู่ก่อนบันทึก",
      });
      return;
    }
  
    setIsEditingAddress(false);
    updateEmployeeSetting("Address");
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold mb-8 text-center text-blue-700 flex items-center justify-center space-x-2">
          <Settings className="w-8 h-8 text-blue-500" />
          <span>Settings</span>
        </h1>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-medium mb-4">Personal Settings</h2>
          <div className="flex items-center mb-4">
            <User className="mr-2 text-blue-500" />
            <div>
              <label className="block font-medium">Full Name:</label>
              <p className="text-lg">
                {employee.firstName} {employee.lastName}
              </p>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <Mail className="mr-2 text-blue-500" />
            <div>
              <label className="block font-medium">Email:</label>
              <p className="text-lg">{employee.email}</p>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <Phone className="mr-2 text-blue-500" />
            <div className="flex items-center w-full">
              <label className="block font-medium">Phone Number:</label>
              {isEditingPhone ? (
                <div className="flex items-center ml-auto">
                  <input
                    type="text"
                    className="p-2 border rounded mr-4"
                    value={employee.phoneNumber}
                    onChange={(e) =>
                      setEmployee({ ...employee, phoneNumber: e.target.value })
                    }
                  />
                  <button
                    className="bg-green-500 text-white p-2 rounded"
                    onClick={handlePhoneSave}
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center ml-auto">
                  <p className="text-lg">{employee.phoneNumber}</p>
                  <button
                    className="ml-4 text-blue-600"
                    onClick={handlePhoneEdit}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center mb-4">
            <Home className="mr-2 text-blue-500" />
            <div className="flex items-center w-full">
              <label className="block font-medium">Address:</label>
              {isEditingAddress ? (
                <div className="flex items-center ml-auto">
                  <input
                    type="text"
                    name="address"
                    className="p-2 border rounded mr-4"
                    value={employee.address}
                    onChange={(e) =>
                      setEmployee({ ...employee, address: e.target.value })
                    }
                  />
                  <button
                    className="bg-green-500 text-white p-2 rounded"
                    onClick={handleAddressSave}
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center ml-auto">
                  <p className="text-lg">{employee.address}</p>
                  <button
                    className="ml-4 text-blue-600"
                    onClick={handleAddressEdit}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-medium mb-4">Password Settings</h2>
          <div className="mb-4 relative">
            <Lock className="absolute top-1/2 transform -translate-y-1/2 left-2 text-blue-500" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="p-2 pl-10 border rounded w-full"
              placeholder="Enter current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="absolute top-1/2 transform -translate-y-1/2 right-2"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-green-500" />
              ) : (
                <Eye className="w-5 h-5 text-blue-500" />
              )}
            </button>
          </div>
          <div className="mb-4 relative">
            <Lock className="absolute top-1/2 transform -translate-y-1/2 left-2 text-blue-500" />
            <input
              type={showPassword ? "text" : "password"}
              className="p-2 pl-10 border rounded w-full"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-4 relative">
            <Lock className="absolute top-1/2 transform -translate-y-1/2 left-2 text-blue-500" />
            <input
              type={showPassword ? "text" : "password"}
              className="p-2 pl-10 border rounded w-full"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <button
              className="bg-blue-500 text-white p-2 rounded w-full"
              type="button"
              onClick={changePassword}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;
