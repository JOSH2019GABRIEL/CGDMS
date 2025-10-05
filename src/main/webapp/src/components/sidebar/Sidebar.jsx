import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddTaskIcon from "@mui/icons-material/AddTask";
import StoreIcon from "@mui/icons-material/Store";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import TimelineIcon from "@mui/icons-material/Timeline";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import MediationIcon from "@mui/icons-material/Mediation";
import SensorsIcon from "@mui/icons-material/Sensors";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import InventoryIcon from "@mui/icons-material/Inventory";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { DarkModeContext } from "../../context/darkModeContext";
import "./sidebar.scss";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const { dispatch } = useContext(DarkModeContext);
  const farm = localStorage.getItem("farmName");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/dashboard" style={{ textDecoration: "none" }}>
          <span className="logo">{farm}</span>
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

          {/* CATFISH MANAGEMENT */}
          <Accordion
            expanded={expanded === "catfish"}
            onChange={handleChange("catfish")}
            disableGutters
            square
            sx={{
              background: "transparent",
              boxShadow: "none",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon className="icon" />}
            sx={{
      display: "flex",
      justifyContent: "flex-start",   // keep text + arrow aligned to the left
      alignItems: "center",           // vertical centering
      gap: 1,                         // small spacing between text and arrow
      "& .MuiAccordionSummary-content": {
        margin: 0,                    // remove default margin
      },
    }}
            >
              <span className="title">CAT-FISH MANAGEMENT</span>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
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
              <Link
                to="/dashboard/batch-movement"
                style={{ textDecoration: "none" }}
              >
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
              <Link
                to="/dashboard/medication-logs"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <MediationIcon className="icon" />
                  <span>Medication Logs</span>
                </li>
              </Link>
              <Link
                to="/dashboard/environment-logs"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <SensorsIcon className="icon" />
                  <span>Environment Logs</span>
                </li>
              </Link>
              <Link
                to="/dashboard/fish-performances"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <PersonOutlineIcon className="icon" />
                  <span>Fish Performance</span>
                </li>
              </Link>
            </AccordionDetails>
          </Accordion>

          {/* BROILER MANAGEMENT */}
          <Accordion
            expanded={expanded === "broiler"}
            onChange={handleChange("broiler")}
            disableGutters
            square
            sx={{
              background: "transparent",
              boxShadow: "none",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon className="submenu" />}>
              <p className="title">BROILER MANAGEMENT</p>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              <Link to="/dashboard/flock" style={{ textDecoration: "none" }}>
                <li>
                  <StoreIcon className="icon" />
                  <span>Flock</span>
                </li>
              </Link>
              <Link to="/dashboard/broiler-log" style={{ textDecoration: "none" }}>
                <li>
                  <WorkspacesIcon className="icon" />
                  <span>Daily Broiler Log</span>
                </li>
              </Link>
              <Link
                to="/dashboard/weight-sample"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <TimelineIcon className="icon" />
                  <span>Weight Sample</span>
                </li>
              </Link>
              <Link to="/dashboard/broiler-vaccination-log" style={{ textDecoration: "none" }}>
                <li>
                  <PsychologyOutlinedIcon className="icon" />
                  <span>Vaccination Logs</span>
                </li>
              </Link>
              <Link
                to="/dashboard/broiler-medication-log"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <MediationIcon className="icon" />
                  <span>Medication Logs</span>
                </li>
              </Link>
              <Link
                to="/dashboard/thinning-event"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <SensorsIcon className="icon" />
                  <span>Thinning Event</span>
                </li>
              </Link>
              <Link
                to="/dashboard/harvest-event"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <PersonOutlineIcon className="icon" />
                  <span>Harvest Event</span>
                </li>
              </Link>
            </AccordionDetails>
          </Accordion>

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
            <li
              onClick={() => setOpenSettings(!openSettings)}
              className="menu-item"
            >
              <SettingsApplicationsIcon className="icon" />
              <span>Settings</span>
              {openSettings ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
            </li>

            {openSettings && (
              <ul className="submenu">
                <Link
                  to="/dashboard/organizations"
                  style={{ textDecoration: "none" }}
                >
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
                <Link to="/dashboard/cadre" style={{ textDecoration: "none" }}>
                  <li>
                    <AgricultureIcon className="icon" />
                    <span>Cadre</span>
                  </li>
                </Link>
              </ul>
            )}
          </ul>
          <Link to="/dashboard/staff-user" style={{ textDecoration: "none" }}>
            <p className="title">USER</p>
            <li>
              <AccountCircleOutlinedIcon className="icon" />
              <span>Admin Panel</span>
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
