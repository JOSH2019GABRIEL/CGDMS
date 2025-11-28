import React, { useEffect, useState } from "react";
import axios from "axios";
import { url as baseUrl } from "../../../api";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";

import "./agentdashboard.scss";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Bar,
  BarChart,
  Legend,
} from "recharts";

const AgentDashboard = () => {
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    inProgressOrders: 0,
  });

  const COLORS = ["#4caf50", "#f44336", "#ff9800"];

  const loadDashboardData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes] = await Promise.all([
        axios.get(`${baseUrl}order-place/order-stats`, { headers }),
      ]);

      setStats(statsRes.data);
      console.log("Agent Stats:", statsRes.data);
    } catch (error) {
      console.error("Dashboard load error:", error);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(() => loadDashboardData(), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboardLayout">
      <Sidebar />

      <div className="dashboardContainer">
        <Navbar />

        <div className="dashboard">
          <div className="statsCards">
            <div className="card blueCard">
              <h3>Total Orders</h3>
              <span>{stats.totalOrders}</span>
            </div>

            <div className="card greenCard">
              <h3>Completed</h3>
              <span>{stats.completedOrders}</span>
            </div>

            <div className="card orangeCard">
              <h3>In Progress</h3>
              <span>{stats.inProgressOrders}</span>
            </div>

            <div className="card redCard">
              <h3>Cancelled</h3>
              <span>{stats.cancelledOrders}</span>
            </div>
          </div>
          
          <div className="chartsContainer">
            {/* Pie Chart */}
            <div className="chartBox">
              <h3>Order Status Summary</h3>
              <PieChart width={400} height={280}>
                <Pie
                  data={[
                    { name: "Completed", value: stats.completedOrders },
                    { name: "Cancelled", value: stats.cancelledOrders },
                    { name: "In Progress", value: stats.inProgressOrders },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  label
                >
                  {COLORS.map((color, i) => (
                    <Cell key={i} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>

            {/* Placeholder Chart Boxes */}
            <div className="chartBox">
              <h3>Weekly Sales</h3>
              <LineChart width={450} height={250} data={[]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="totalSales" stroke="#1976d2" />
              </LineChart>
            </div>

            <div className="chartBox">
              <h3>Monthly Revenue</h3>
              <BarChart width={450} height={250} data={[]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#4caf50" />
              </BarChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
