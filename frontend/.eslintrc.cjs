module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true
    },
    extends: ["eslint:recommended", "plugin:react/recommended"],
    plugins: ["react"],
    rules: {
      "react/react-in-jsx-scope": "off", // ✅ ปิด JSX check
      "no-undef": "off",                 // ✅ ปิด error console, sessionStorage ฯลฯ
      "no-unused-vars": "warn"
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  };
  