const hostname = window.location.hostname;
const baseURL = hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'http://backend:3000';

export default baseURL;
