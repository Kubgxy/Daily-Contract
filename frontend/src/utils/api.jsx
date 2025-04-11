// const hostname = window.location.hostname;
// const baseURL = hostname === 'localhost'
//   ? 'http://localhost:3000'
//   : 'http://backend:3000';

// export default baseURL;

// src/utils/api.jsx
const baseURL = import.meta.env.VITE_ENDPOINT || 'http://localhost:3000';
export default baseURL;
