import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { MapContainer, Popup, TileLayer, Marker } from "react-leaflet";
import { LogIn, LogOut, MapPin } from "lucide-react";
import L from "leaflet";
import markerIconRed from "../../public/marker-icon-red.webp";
import Navbar from "./../Components/Navbar";
import MapController from "../Components/MapController";
import baseURL from "../utils/api";

function CheckinPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userPosition, setUserPosition] = useState({ lat: null, lon: null });
  const [checkinStatus, setCheckinStatus] = useState("");
  const [workConfig, setWorkConfig] = useState(null);

  const workIcon = new L.Icon({
    iconUrl: markerIconRed,
    iconSize: [40, 45],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [55, 45],
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // โหลดตำแหน่งที่ทำงาน
    const fetchWorkConfig = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/worklocation/location`, {
          withCredentials: true,
        });
        setWorkConfig(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch work config", err);
        Swal.fire({
          icon: "error",
          title: "โหลดข้อมูลตำแหน่งไม่สำเร็จ",
          text: "กรุณาลองใหม่หรือติดต่อผู้ดูแลระบบ",
        });
      }
    };

    fetchWorkConfig();

    return () => clearInterval(timer);
  }, []);

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(error)
        );
      }
    });
  };

  const isInWorkArea = (userLat, userLon, workLat, workLon, radius = 150) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371e3;
    const φ1 = toRad(userLat);
    const φ2 = toRad(workLat);
    const Δφ = toRad(workLat - userLat);
    const Δλ = toRad(workLon - userLon);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance <= radius;
  };

  const handleCheckin = async () => {
    try {
      const position = await getCurrentPosition();
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;

      console.log("📍 พิกัดผู้ใช้:", userLat, userLon); // ✅ ตรวจจาก DevTools

      setUserPosition({ lat: userLat, lon: userLon });

      if (
        workConfig &&
        isInWorkArea(
          userLat,
          userLon,
          workConfig.latitude,
          workConfig.longitude,
          workConfig.radius
        )
      ) {
        const response = await axios.post(
          `${baseURL}/api/data/checkIn`,
          {},
          { withCredentials: true }
        );

        if (response && response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Check-in Successful!",
            text: response.data.data.msg,
            customClass: { title: "swal-title-custom" },
          });
          setCheckinStatus("Checked in successfully!");
          return;
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Out of range",
          text: "You are not within the work area.",
        });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.data) {
        const apiMessage = error.response.data.data.msg;
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: apiMessage,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Unable to check in at this time.",
        });
      }
    }
  };

  const handleCheckout = async () => {
    try {
      const position = await getCurrentPosition();
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;

      setUserPosition({ lat: userLat, lon: userLon });

      if (
        workConfig &&
        isInWorkArea(
          userLat,
          userLon,
          workConfig.latitude,
          workConfig.longitude,
          workConfig.radius
        )
      ) {
        const response = await axios.post(
          `${baseURL}/api/data/checkOut`,
          {},
          { withCredentials: true }
        );

        if (response && response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Check-out Successful!",
            text: response.data.data.msg,
            customClass: { title: "swal-title-custom" },
          });
          setCheckinStatus("Checked out successfully!");
          return;
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Out of range",
          text: "You are not within the work area.",
        });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.data) {
        const apiMessage = error.response.data.data.msg;
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: apiMessage,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Unable to check out at this time.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen ">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-64px)]">
        <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 text-white">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center justify-center gap-3">
              <MapPin className="w-8 h-8" />
              ระบบบันทึกเวลาทำงาน
            </h1>
          </div>

          <div className="p-6 space-y-6">
            {/* Time Display Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl shadow-sm border border-indigo-100">
              <div className="text-center space-y-1">
                <div className="text-gray-600 font-medium">
                  {currentTime.toLocaleDateString("th-TH", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="text-4xl font-bold text-indigo-600">
                  {currentTime.toLocaleTimeString("th-TH", {
                    timeZone: "Asia/Bangkok",
                  })}
                </div>
                {checkinStatus && (
                  <div className="mt-3 py-2 px-4 bg-green-50 text-green-600 rounded-lg inline-block">
                    {checkinStatus}
                  </div>
                )}
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center mb-4 gap-2">
                <MapPin className="w-5 h-5 text-indigo-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  ตำแหน่งปัจจุบัน
                </h3>
              </div>
              <div className="rounded-lg overflow-hidden shadow-md">
                <MapContainer
                  center={
                    userPosition.lat && userPosition.lon
                      ? [userPosition.lat, userPosition.lon]
                      : workConfig
                      ? [workConfig.latitude, workConfig.longitude]
                      : [13.826, 100.576] // fallback เผื่อยังโหลดไม่ทัน
                  }
                  zoom={15}
                  className="h-[300px] w-full"
                >
                  <MapController center={userPosition} />
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  {userPosition.lat && userPosition.lon && (
                    <Marker position={[userPosition.lat, userPosition.lon]}>
                      <Popup>ตำแหน่งของคุณ</Popup>
                    </Marker>
                  )}
                  {workConfig && (
                    <Marker
                      position={[workConfig.latitude, workConfig.longitude]}
                      icon={workIcon}
                    >
                      <Popup>สถานที่ทำงาน</Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                onClick={handleCheckin}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-xl font-medium shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
              >
                <LogIn className="w-5 h-5" />
                <span>บันทึกเวลาเข้างาน</span>
              </button>
              <button
                onClick={handleCheckout}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-xl font-medium shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
              >
                <LogOut className="w-5 h-5" />
                <span>บันทึกเวลาออกงาน</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckinPage;
