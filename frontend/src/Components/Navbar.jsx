import { useEffect, useState } from "react";
import { Disclosure, Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import baseURL from '../utils/api';

const navigation = [
  { name: "เช็คอิน/เช็คเอาท์", href: "/checkin" },
  { name: "การแจ้งเตือน", href: "/notifications" },
  { name: "ข้อมูลการทำงาน", href: "/workinfo" },
  { name: "ยื่นคำขอ", href: "/requests" },
  { name: "เกี่ยวกับเรา", href: "/about" },
];

export default function Navbar() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeData = async () => {
        try {
          const response = await axios.get(
            `${baseURL}/api/auth/employees/me`,
            { withCredentials: true }
          );
          setEmployee(response.data);
          console.log("API Response:", response.data);
        } catch (error) {
          console.error("Error fetching employee data:", error);
        }
      setLoading(false);
    };

    fetchEmployeeData();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <Disclosure as="nav" className="bg-blue-600 fixed w-full top-0 z-50 shadow-md">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <a href="/Profile"><img alt="Logo" src="./LogoDaily.png" className="h-[20px] w-auto" /></a>
                  <a href="/Profile" className="text-white font-bold ml-2">DAILY CONTRACT</a>
                </div>
                <div className="hidden sm:flex sm:space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-white hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="flex items-center">
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <img
                          src={
                            employee && employee.avatar
                              ? `${baseURL}${employee.avatar}`
                              : "/api/placeholder/128/128"
                          }
                          alt="Avatar"
                          className="h-8 w-8 rounded-full"
                        />
                      </MenuButton>
                    </div>
                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                      <MenuItem>
                        <a
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          โปรไฟล์
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          href="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          การตั้งค่า
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          href="/"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          ล็อคเอาท์
                        </a>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                  <p className="text-white ml-2 font-bold">
                    {loading ? "Loading..." : employee?.first_name}
                  </p>
                </div>
                <div className="flex sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-white hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Content below Navbar */}
      <div className="pt-[70px]"> {/* Add padding to avoid content being covered by the navbar */}
        {/* Content goes here */}
        <h1 className="text-center text-2xl font-semibold ">
        </h1>
      </div>
    </div>
  );
}
