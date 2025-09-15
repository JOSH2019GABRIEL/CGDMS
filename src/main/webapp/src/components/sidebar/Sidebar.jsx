import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MediationIcon from '@mui/icons-material/Mediation';
import SensorsIcon from '@mui/icons-material/Sensors';
import TimelineIcon from '@mui/icons-material/Timeline';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import AddTaskIcon from '@mui/icons-material/AddTask';
import React, { useState } from "react";
import InventoryIcon from '@mui/icons-material/Inventory';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";

const Sidebar = () => {
  const [openSettings, setOpenSettings] = useState(false);
  const { dispatch } = useContext(DarkModeContext);
  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/dashboard" style={{ textDecoration: "none" }}>
          <span className="logo">CAT-FISH GROW OUT</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
           <Link to="/dashboard" style={{ textDecoration: "none" }}>
          <li>
            <DashboardIcon className="icon" />
            <span>Dashboard</span>
          </li>
          </Link>
          <p className="title">LISTS</p>

        <Link to="/dashboard/tasks" style={{ textDecoration: "none" }}>
            <li>
              <AddTaskIcon className="icon" />
              <span>Task</span>
            </li>
          </Link>
          <Link to="/dashboard/pond" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span>Pond</span>
            </li>
          </Link>
          <Link to="/dashboard/batches" style={{ textDecoration: "none" }}>
            <li>
              <WorkspacesIcon className="icon" />
              <span>Batch</span>
            </li>
          </Link>
          <Link to="/dashboard/batch-movement" style={{ textDecoration: "none" }}>
            <li>
              <TimelineIcon className="icon" />
              <span>Batch Movement</span>
            </li>
          </Link>
          <Link to="/dashboard/feed-log" style={{ textDecoration: "none" }}>
            <li>
              <PsychologyOutlinedIcon className="icon" />
              <span>Feed Logs</span>
            </li>
          </Link>
          <Link to="/dashboard/medication-logs" style={{ textDecoration: "none" }}>
            <li>
              <MediationIcon className="icon" />
              <span>Medication Logs</span>
            </li>
          </Link>
          <Link to="/dashboard/environment-logs" style={{ textDecoration: "none" }}>
            <li>
              <SensorsIcon className="icon" />
              <span>Environment Logs</span>
            </li>
          </Link>
          <Link to="/dashboard/fish-performances" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Fish Performance</span>
            </li>
          </Link>
          
          <p className="title">USEFUL</p>
          <li>
            <InsertChartIcon className="icon" />
            <span>Stats</span>
          </li>
          <li>
            <NotificationsNoneIcon className="icon" />
            <span>Notifications</span>
          </li>
          <p className="title">SERVICE</p>
          <li>
            <SettingsSystemDaydreamOutlinedIcon className="icon" />
            <span>System Health</span>
          </li>
          <li>
            <PsychologyOutlinedIcon className="icon" />
            <span>Logs</span>
          </li>

        <ul>
        <li onClick={() => setOpenSettings(!openSettings)} className="menu-item">
          <SettingsApplicationsIcon className="icon" />
          <span>Settings</span>
          {openSettings ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
        </li>

        {openSettings && (
          <ul className="submenu">
            <Link to="/dashboard/organizations" style={{ textDecoration: "none" }}>
            <li>
            <InventoryIcon className="icon" />
            <span>Organization</span>
          </li>
          </Link>
          <Link to="/dashboard/farms" style={{ textDecoration: "none" }}>
            <li>
            <AgricultureIcon className="icon" />
            <span>Farm</span>
          </li>
          </Link>
          </ul>
        )}
      </ul>
          <Link to="/dashboard/staff-user" style={{ textDecoration: "none" }}>
          <p className="title">USER</p>
          <li>
            <AccountCircleOutlinedIcon className="icon" />
            <span>Profile</span>
          </li>
          </Link>
          <Link to="/dashboard/logout" style={{ textDecoration: "none" }}>

          <li>
            <ExitToAppIcon className="icon" />
            <span>Logout</span>
          </li>
          </Link>
        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;
