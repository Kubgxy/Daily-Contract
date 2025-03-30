import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5174, // หรือ 5174 สำหรับ dashboard
  },
  define: {
    'process.env': process.env, // ให้ใช้ ENV ตอน dev ได้ด้วย
  }
});
