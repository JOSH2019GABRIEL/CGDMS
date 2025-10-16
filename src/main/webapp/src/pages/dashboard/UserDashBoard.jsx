import React, { useEffect, useState } from "react";
import axios from "axios";
import { url as baseUrl } from "../../api";
import { toast } from "react-toastify";
import {
  Agriculture,
  Groups,
  Map,
  AttachMoney,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import "./userDashboard.scss";

const UserDashboard = () => {
  const [stats, setStats] = useState({
    totalFarms: 0,
    totalUsers: 0,
    totalPlots: 0,
    totalEarnings: 0,
  });

  const [farmTrends, setFarmTrends] = useState([]); // Bar chart
  const [earningsTrend, setEarningsTrend] = useState([]); // Line chart
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, trendRes] = await Promise.all([
          axios.get(`${baseUrl}dashboard/summary`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseUrl}dashboard/trends`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats({
          totalFarms: summaryRes.data?.totalFarms ?? 0,
          totalUsers: summaryRes.data?.totalUsers ?? 0,
          totalPlots: summaryRes.data?.totalPlots ?? 0,
          totalEarnings: summaryRes.data?.totalEarnings ?? 0,
        });

        setFarmTrends(trendRes.data?.farmTrends || []);
        setEarningsTrend(trendRes.data?.earningsTrend || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      }
    };

    fetchDashboardData();
  }, [token]);

  const cards = [
    {
      title: "Total Farms",
      value: stats.totalFarms.toLocaleString(),
      icon: <Agriculture className="icon farm" />,
      color: "farm",
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: <Groups className="icon user" />,
      color: "user",
    },
    {
      title: "Total Plots",
      value: stats.totalPlots.toLocaleString(),
      icon: <Map className="icon plot" />,
      color: "plot",
    },
    {
      title: "Total Earnings",
      value: `₦${(stats.totalEarnings ?? 0).toLocaleString()}`,
      icon: <AttachMoney className="icon earn" />,
      color: "earn",
    },
  ];

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="dashboard">
          <h2 className="dashboard-title">Dashboard Overview</h2>

          {/* Summary Cards */}
          <div className="cards-container">
            {cards.map((card, index) => (
              <div className={`card ${card.color}`} key={index}>
                <div className="card-content">
                  <div>
                    <h3>{card.title}</h3>
                    <h1>{card.value}</h1>
                  </div>
                  <div className="icon-container">{card.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="charts-container">
            <div className="chart-card">
              <h3>Farms Created per Month</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={farmTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#6a5acd" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Earnings Trend (₦)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={earningsTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#ffa500"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
