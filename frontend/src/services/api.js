import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("queueease_officer_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getQueue = () => api.get("/queue").then((r) => r.data);
export const getManagedQueue = () => api.get("/queue/management").then((r) => r.data);
export const getStats = () => api.get("/queue/stats").then((r) => r.data);
export const createQueue = (payload) => api.post("/queue", payload).then((r) => r.data);
export const callNext = () => api.patch("/queue/call-next").then((r) => r.data);
export const completeQueue = (id) => api.patch(`/queue/${id}/done`).then((r) => r.data);
export const loginOfficer = (payload) => api.post("/auth/login", payload).then((r) => r.data);
export const getOfficer = () => api.get("/auth/me").then((r) => r.data);
