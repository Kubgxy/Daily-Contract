import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    extends: ["js/recommended"]
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        console: true,             // ✅ ป้องกัน console.log error
        window: true,              // ✅ ป้องกัน window error
        document: true,            // ✅ สำหรับ ReactDOM
        FormData: true,            // ✅ สำหรับ multipart/form
        sessionStorage: true,      // ✅ สำหรับการจำ session
        setTimeout: true,          // ✅ ป้องกัน timer error
        clearTimeout: true,
        setInterval: true,
        clearInterval: true,
        requestAnimationFrame: true
      }
    },
    rules: {
      "react/react-in-jsx-scope": "off" // ✅ ปิด React scope check
    },
    ...pluginReact.configs.flat.recommended
  }
]);
