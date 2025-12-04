import axios from "axios";
import { url as baseUrl } from "../../../api";

const getToken = () => localStorage.getItem("token");

export const fetchAgents = () => {
  return axios.get(`${baseUrl}staff/agents`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { page: 0, size: 1000 }
  });
};

export const fetchPerAgentReport = async (filters, token) => {
  // Build query string
  let queryParams = `page=${filters.page}&size=${filters.size}`;
  
  if (filters.start) queryParams += `&start=${filters.start}`;
  if (filters.end) queryParams += `&end=${filters.end}`;
  if (filters.agentId) queryParams += `&agentId=${filters.agentId}`;
  if (filters.status) queryParams += `&status=${filters.status}`;

  return axios.get(`${baseUrl}reports/per-agent/dashboard?${queryParams}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const exportPerAgentReport = async (filters, token) => {
  let queryParams = `page=${filters.page}&size=${filters.size}`;
  
  if (filters.start) queryParams += `&start=${filters.start}`;
  if (filters.end) queryParams += `&end=${filters.end}`;
  if (filters.agentId) queryParams += `&agentId=${filters.agentId}`;
  if (filters.status) queryParams += `&status=${filters.status}`;

  return axios.get(`${baseUrl}per-agent/export?${queryParams}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob",
  });
};

export const fetchGlobalReport = async (filters, token) => {
  let queryParams = `page=${filters.page}&size=${filters.size}`;
  
  if (filters.start) queryParams += `&start=${filters.start}`;
  if (filters.end) queryParams += `&end=${filters.end}`;

  return axios.get(`${baseUrl}global?${queryParams}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const exportGlobalReport = async (filters, token) => {
  let queryParams = `page=${filters.page}&size=${filters.size}`;
  
  if (filters.start) queryParams += `&start=${filters.start}`;
  if (filters.end) queryParams += `&end=${filters.end}`;

  return axios.get(`${baseUrl}global/export?${queryParams}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob",
  });
};