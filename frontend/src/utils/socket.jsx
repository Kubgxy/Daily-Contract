import { io } from "socket.io-client";

const getSocketURL = () => {
  const hostname = window.location.hostname;
  return `http://${hostname}:3000`; // ⬅️ ใช้ hostname จาก browser
};

const socket = io(getSocketURL(), {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("✅ Socket Connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Socket Disconnected");
});

socket.on("connect_error", (err) => {
  console.error("🔥 Socket Connect Error:", err);
});


export default socket;
