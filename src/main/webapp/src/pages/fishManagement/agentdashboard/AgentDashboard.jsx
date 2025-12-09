// src/pages/Agent/AgentDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import axios from "axios";
import { url as baseUrl } from "../../../api";

import KpiCard from "./KpiCard";
import EarningsSummary from "./EarningsSummary";
import PerformanceChart from "./PerformanceChart";
import SalesBreakdownChart from "./SalesBreakdownChart";
import RecentOrdersTable from "./RecentOrdersTable";
import ActivityFeed from "./ActivityFeed";
import GoalsProgress from "./GoalsProgress";
import NotificationsPanel from "./NotificationsPanel";
import DateFilter from "./DateFilter";
import DarkModeToggle from "./DarkModeToggle";

import "./agentdashboard.scss";

const AgentDashboard = () => {
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({ start: null, end: null });

  const [data, setData] = useState({
    kpis: {
      totalOrders: 0,
      completedOrders: 0,
      inProgressOrders: 0,
      cancelledOrders: 0,
    },
    earnings: { revenue: 0, commissions: 0, totalEarningInCurrentMonth: 0 },
    trend: [],
    breakdown: [],
    recentOrders: [],
    activities: [],
    goals: { monthlyTarget: 500000, achieved: 0 },
    notifications: [],
  });

  const loadDashboard = useCallback(async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${baseUrl}order-place/order-stats`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
      });
      setData((prev) => ({
        ...prev,

        kpis: {
          totalOrders: res.data?.totalOrders ?? 0,
          completedOrders: res.data?.completedOrders ?? 0,
          inProgressOrders: res.data?.inProgressOrders ?? 0,
          cancelledOrders: res.data?.cancelledOrders ?? 0,
        },

        earnings: {
          revenue: res.data?.totalBuy ?? 0,
          commissions: res.data?.totalCommission ?? 0,
          totalEarningInCurrentMonth: 0,
        },

        trend: prev.trend,
        breakdown: prev.breakdown,
        recentOrders: prev.recentOrders,
        activities: prev.activities,
        goals: prev.goals,
        notifications: prev.notifications,
      }));
    } catch (err) {
      console.error("❌ Failed to load dashboard:", err);
      console.error("❌ Error Response:", err.response);
    } finally {
      setLoading(false);
    }
  }, [filters, token]);

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(loadDashboard, 20000);
    return () => clearInterval(interval);
  }, [loadDashboard]);

  return (
    <div className="dashboardLayout">
      <Sidebar />

      <div className="dashboardContainer">
        <Navbar />

        <div className="dashboardHeader">
          <h2>Agent Dashboard</h2>

          <div className="headerControls">
            <DateFilter filters={filters} setFilters={setFilters} />
            <DarkModeToggle />
          </div>
        </div>

        <div className="dashboardGrid">
          <div className="col kpiCol">
            <KpiCard
              title="Total Orders"
              value={data.kpis.totalOrders}
              loading={loading}
            />
            <KpiCard
              title="Completed"
              value={data.kpis.completedOrders}
              color="green"
              loading={loading}
            />
            <KpiCard
              title="In Progress"
              value={data.kpis.inProgressOrders}
              color="orange"
              loading={loading}
            />
            <KpiCard
              title="Cancelled"
              value={data.kpis.cancelledOrders}
              color="red"
              loading={loading}
            />
          </div>

          <div className="col mainCol">
            <EarningsSummary earnings={data.earnings} />
            <PerformanceChart data={data.trend} />
            <SalesBreakdownChart data={data.breakdown} />
            <RecentOrdersTable
              rows={data.recentOrders}
              reload={loadDashboard}
            />
          </div>

          <div className="col sideCol">
            <GoalsProgress goals={data.goals} />
            <ActivityFeed items={data.activities} />
            <NotificationsPanel items={data.notifications} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;

// import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import { url as baseUrl } from "../../../api";

// import Sidebar from "../../../components/Sidebar/Sidebar";
// import Navbar from "../../../components/Navbar/Navbar";

// import "./agentdashboard.scss";

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   PieChart,
//   Pie,
//   Cell,
//   Bar,
//   BarChart,
//   Legend,
// } from "recharts";

// const COLORS = ["#4caf50", "#f44336", "#ff9800"];

// const AgentDashboard = () => {
//   const token = localStorage.getItem("token");

//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   /** ---------------------------------------------
//    *  LOAD DASHBOARD DATA
//    *  --------------------------------------------- */
//   const loadDashboardData = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const headers = { Authorization: `Bearer ${token}` };

//       const response = await axios.get(
//         `${baseUrl}order-place/order-stats`,
//         { headers }
//       );

//       setStats(response.data);
//       console.log("Agent Stats:", response.data);
//     } catch (err) {
//       console.error("Dashboard load error:", err);
//       setError("Unable to load dashboard data. Please retry.");
//     } finally {
//       setLoading(false);
//     }
//   }, [token]);

//   /** Auto-refresh every 5 seconds */
//   useEffect(() => {
//     loadDashboardData();
//     const interval = setInterval(loadDashboardData, 5000);
//     return () => clearInterval(interval);
//   }, [loadDashboardData]);

//   /** ---------------------------------------------
//    *  RENDERING UTILITIES
//    *  --------------------------------------------- */

//   const StatCard = ({ title, value, color }) => (
//     <div className="card" style={{ borderBottom: `4px solid ${color}` }}>
//       <h3>{title}</h3>
//       <span>{loading ? "..." : value}</span>
//     </div>
//   );

//   const EmptyChart = ({ title }) => (
//     <div className="chartBox empty">
//       <h3>{title}</h3>
//       <p>No data available</p>
//     </div>
//   );

//   /** ---------------------------------------------
//    *  MAIN RENDER
//    *  --------------------------------------------- */

//   return (
//     <div className="dashboardLayout">
//       <Sidebar />

//       <div className="dashboardContainer">
//         <Navbar />

//         <div className="dashboard">

//           {/* ERROR ALERT */}
//           {error && (
//             <div className="errorBanner">
//               {error}
//               <button onClick={loadDashboardData}>Retry</button>
//             </div>
//           )}

//           {/* KPI CARDS */}
//           <div className="statsCards">
//             <StatCard title="Total Orders" value={stats?.totalOrders} color="#1976d2" />
//             <StatCard title="Completed" value={stats?.completedOrders} color="#4caf50" />
//             <StatCard title="In Progress" value={stats?.inProgressOrders} color="#ff9800" />
//             <StatCard title="Cancelled" value={stats?.cancelledOrders} color="#f44336" />
//             <StatCard title="Total Order Value" value={stats?.totalBuy} color="#9c27b0" />
//             <StatCard title="Total Commission Earned" value={stats?.totalCommission} color="#00bcd4" />
//           </div>

//           {/* CHARTS */}
//           <div className="chartsContainer">

//             {/* PIE CHART */}
//             <div className="chartBox">
//               <h3>Order Status Summary</h3>

//               {!stats ? (
//                 <EmptyChart title="Order Status Summary" />
//               ) : (
//                 <PieChart width={400} height={280}>
//                   <Pie
//                     data={[
//                       { name: "Completed", value: stats.completedOrders },
//                       { name: "Cancelled", value: stats.cancelledOrders },
//                       { name: "In Progress", value: stats.inProgressOrders },
//                     ]}
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={85}
//                     label
//                   >
//                     {COLORS.map((color, i) => (
//                       <Cell key={i} fill={color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               )}
//             </div>

//             {/* WEEKLY SALES (placeholder demo data) */}
//             <div className="chartBox">
//               <h3>Weekly Sales</h3>

//               <LineChart width={450} height={250} data={[]}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="day" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="totalSales" stroke="#1976d2" />
//               </LineChart>
//             </div>

//             {/* MONTHLY REVENUE (placeholder) */}
//             <div className="chartBox">
//               <h3>Monthly Revenue</h3>
//               <BarChart width={450} height={250} data={[]}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="revenue" fill="#4caf50" />
//               </BarChart>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AgentDashboard;
