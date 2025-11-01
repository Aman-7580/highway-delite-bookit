import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://highway-delite-bookit.onrender.com",
});

export default api;
