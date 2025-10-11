import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddTaskIcon from "@mui/icons-material/AddTask";
import StoreIcon from "@mui/icons-material/Store";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import TimelineIcon from "@mui/icons-material/Timeline";
import ScienceIcon from "@mui/icons-material/Science";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import OpacityIcon from "@mui/icons-material/Opacity";
import LineWeightIcon from "@mui/icons-material/LineWeight";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import SetMealIcon from "@mui/icons-material/SetMeal";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import InventoryIcon from "@mui/icons-material/Inventory";
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
            <AccordionSummary expandIcon={<ExpandMoreIcon className="icon" />}>
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
                  <RestaurantIcon className="icon" />
                  <span>Feed Logs</span>
                </li>
              </Link>
              <Link
                to="/dashboard/medication-logs"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <LocalHospitalIcon className="icon" />
                  <span>Medication Logs</span>
                </li>
              </Link>
              <Link
                to="/dashboard/environment-logs"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <ScienceIcon className="icon" />
                  <span>Environment Logs</span>
                </li>
              </Link>
              <Link
                to="/dashboard/fish-performances"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <MonitorHeartIcon className="icon" />
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
            <AccordionSummary expandIcon={<ExpandMoreIcon className="icon" />}>
              <p className="title">BROILER MANAGEMENT</p>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              <Link to="/dashboard/flock" style={{ textDecoration: "none" }}>
                <li>
                  <AgricultureIcon className="icon" />
                  <span>Flock</span>
                </li>
              </Link>
              <Link
                to="/dashboard/broiler-log"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <LineWeightIcon className="icon" />
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
              <Link
                to="/dashboard/broiler-vaccination-log"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <OpacityIcon className="icon" />
                  <span>Vaccination Logs</span>
                </li>
              </Link>
              <Link
                to="/dashboard/broiler-medication-log"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <LocalHospitalIcon className="icon" />
                  <span>Medication Logs</span>
                </li>
              </Link>
              <Link
                to="/dashboard/thinning-event"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <SetMealIcon className="icon" />
                  <span>Thinning Event</span>
                </li>
              </Link>
              <Link
                to="/dashboard/harvest-event"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <ReceiptLongIcon className="icon" />
                  <span>Harvest Event</span>
                </li>
              </Link>
              <Link
                to="/dashboard/processing-batch"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <InventoryIcon className="icon" />
                  <span>Processing Batch</span>
                </li>
              </Link>
              <Link
                to="/dashboard/slaughter-logs"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <SetMealIcon className="icon" />
                  <span>Slaughter Log</span>
                </li>
              </Link>
              <Link
                to="/dashboard/cutup-yields"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <LineWeightIcon className="icon" />
                  <span>Cutup Yield</span>
                </li>
              </Link>
              <Link
                to="/dashboard/by-products"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <StoreIcon className="icon" />
                  <span>Byproducts</span>
                </li>
              </Link>
              <Link to="/dashboard/wastes" style={{ textDecoration: "none" }}>
                <li>
                  <DeleteSweepIcon className="icon" />
                  <span>Wastes</span>
                </li>
              </Link>
            </AccordionDetails>
          </Accordion>

          {/* VEGETABLE MANAGEMENT */}
          <Accordion
            expanded={expanded === "vegetables"}
            onChange={handleChange("vegetables")}
            disableGutters
            square
            sx={{
              background: "transparent",
              boxShadow: "none",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon className="icon" />}>
              <p className="title">VEGETABLE MANAGEMENT</p>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              <Link
                to="/dashboard/crop-varieties"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <AgricultureIcon className="icon" />
                  <span>Crop Varieties</span>
                </li>
              </Link>
              <Link
                to="/dashboard/veg-crop-logs"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <TimelineIcon className="icon" />
                  <span>Daily Crop Log</span>
                </li>
              </Link>
              <Link
                to="/dashboard/planting-events"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <ScienceIcon className="icon" />
                  <span>Planting Events</span>
                </li>
              </Link>
              <Link
                to="/dashboard/harvest-batches"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <ReceiptLongIcon className="icon" />
                  <span>Harvest Batches</span>
                </li>
              </Link>
              <Link
                to="/dashboard/postloss-harvestes"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <DeleteSweepIcon className="icon" />
                  <span>Post Harvest Losses</span>
                </li>
              </Link>
              <Link to="/dashboard/sales" style={{ textDecoration: "none" }}>
                <li>
                  <ShoppingCartIcon className="icon" />
                  <span>Sales Link</span>
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
            <MonitorHeartIcon className="icon" />
            <span>Logs</span>
          </li>

          {/* SETTINGS */}
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
                <Link to="/dashboard/plots" style={{ textDecoration: "none" }}>
                  <li>
                    <AgricultureIcon className="icon" />
                    <span>Plot</span>
                  </li>
                </Link>
                <Link to="/dashboard/cadre" style={{ textDecoration: "none" }}>
                  <li>
                    <WorkspacesIcon className="icon" />
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
