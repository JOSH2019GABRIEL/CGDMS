import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import InventoryIcon from "@mui/icons-material/Inventory";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import { DarkModeContext } from "../../context/darkModeContext";
import "./sidebar.scss";
import { Dashboard } from "@mui/icons-material";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const { dispatch } = useContext(DarkModeContext);
  const farm = localStorage.getItem("farmName");
  const org = localStorage.getItem("organization");
  const roles = localStorage.getItem("roles");
  const isAdmin = roles.includes("ROLE_ADMIN");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // const handleChange = (panel) => () => {
  //   setExpanded((prevExpanded) => (prevExpanded === panel ? false : panel));
  // };

  return (
    <div className="sidebar">
      <div className="top">
        <NavLink
          to="/dashboard"
          className="logo-NavLink"
          style={{ textDecoration: "none" }}
        >
          <div className="logo">
            <span className="org-name">{org}</span>
            <hr />
            <span className="farm-name">{farm}</span>
          </div>
        </NavLink>
      </div>

      <hr />
      <div className="center">
        <ul>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "" : "active")}
            style={{ textDecoration: "none" }}
          >
            <li>
              <Dashboard className="icon" />
              <span>Dashboard</span>
            </li>
          </NavLink>

          {/* CATFISH MANAGEMENT */}
          <Accordion
            expanded={expanded === "fish"}
            onChange={handleChange("fish")}
            disableGutters
            square
            sx={{
              background: "transparent",
              boxShadow: "none",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon className="icon" />}>
              <span className="title">CATFISH MANAGEMENT</span>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              <NavLink
                to="/dashboard/pond"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <StoreIcon className="icon" />
                  <span>Pond</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/batches"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <WorkspacesIcon className="icon" />
                  <span>Batch</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/batch-movement"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <TimelineIcon className="icon" />
                  <span>Batch Movement</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/feed-log"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <RestaurantIcon className="icon" />
                  <span>Feed Logs</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/medication-logs"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <LocalHospitalIcon className="icon" />
                  <span>Medication Logs</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/environment-logs"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <ScienceIcon className="icon" />
                  <span>Environment Logs</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/fish-performances"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <MonitorHeartIcon className="icon" />
                  <span>Fish Performance</span>
                </li>
              </NavLink>

              <NavLink
                to="/dashboard/fish-harvests"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <ReceiptLongIcon className="icon" />
                  <span>Fish Harvest</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/fish-post-harvests"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <DeleteSweepIcon className="icon" />
                  <span>Fish Post Harvest</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/fish-sales"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <ReceiptLongIcon className="icon" />
                  <span>Fish Live Sales</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/smoking-plants"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <OutdoorGrillIcon className="icon" />
                  <span>Smoking Plant Transfer</span>
                </li>
              </NavLink>
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
              <NavLink
                to="/dashboard/flock"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <AgricultureIcon className="icon" />
                  <span>Flock</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/broiler-log"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <LineWeightIcon className="icon" />
                  <span>Daily Broiler Log</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/weight-sample"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <TimelineIcon className="icon" />
                  <span>Weight Sample</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/broiler-vaccination-log"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <OpacityIcon className="icon" />
                  <span>Vaccination Logs</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/broiler-medication-log"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <LocalHospitalIcon className="icon" />
                  <span>Medication Logs</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/thinning-event"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <SetMealIcon className="icon" />
                  <span>Thinning Event</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/harvest-event"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <ReceiptLongIcon className="icon" />
                  <span>Harvest Event</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/processing-batch"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <InventoryIcon className="icon" />
                  <span>Processing Batch</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/slaughter-logs"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <SetMealIcon className="icon" />
                  <span>Slaughter Log</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/cutup-yields"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <LineWeightIcon className="icon" />
                  <span>Cutup Yield</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/by-products"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <StoreIcon className="icon" />
                  <span>Byproducts</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/wastes"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <DeleteSweepIcon className="icon" />
                  <span>Wastes</span>
                </li>
              </NavLink>
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
              <NavLink
                to="/dashboard/crop-varieties"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <AgricultureIcon className="icon" />
                  <span>Crop Varieties</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/veg-crop-logs"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <TimelineIcon className="icon" />
                  <span>Daily Crop Log</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/planting-events"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <ScienceIcon className="icon" />
                  <span>Planting Events</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/harvest-batches"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <ReceiptLongIcon className="icon" />
                  <span>Harvest Batches</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/postloss-harvestes"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <DeleteSweepIcon className="icon" />
                  <span>Post Harvest Losses</span>
                </li>
              </NavLink>
              <NavLink
                to="/dashboard/sales"
                className={({ isActive }) => (isActive ? "active" : "")}
                style={{ textDecoration: "none" }}
              >
                <li>
                  <ShoppingCartIcon className="icon" />
                  <span>Sales NavLink</span>
                </li>
              </NavLink>
            </AccordionDetails>
          </Accordion>

          {isAdmin && (
            <Accordion
              expanded={expanded === "agents"}
              onChange={handleChange("agents")}
              disableGutters
              square
              sx={{
                background: "transparent",
                boxShadow: "none",
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className="icon" />}
              >
                <p className="title">AGENT MANAGEMENT</p>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: 0 }}>
                <NavLink
                  to="/dashboard/tasks"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  style={{ textDecoration: "none" }}
                >
                  <li>
                    <AddTaskIcon className="icon" />
                    <span>Task</span>
                  </li>
                </NavLink>
                <NavLink
                  to="/dashboard/cadre"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  style={{ textDecoration: "none" }}
                >
                  <li>
                    <WorkspacesIcon className="icon" />
                    <span>Cadre</span>
                  </li>
                </NavLink>
                <NavLink
                  to="/dashboard/plots"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  style={{ textDecoration: "none" }}
                >
                  <li>
                    <AgricultureIcon className="icon" />
                    <span>Plots</span>
                  </li>
                </NavLink>
                <NavLink
                  to="/dashboard/farms"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  style={{ textDecoration: "none" }}
                >
                  <li>
                    <AgricultureIcon className="icon" />
                    <span>Farms</span>
                  </li>
                </NavLink>
                <NavLink
                  to="/dashboard/organizations"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  style={{ textDecoration: "none" }}
                >
                  <li>
                    <InventoryIcon className="icon" />
                    <span>Organizations</span>
                  </li>
                </NavLink>
                <NavLink
                  to="/dashboard/staff-user"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  style={{ textDecoration: "none" }}
                >
                  <li>
                    <AccountCircleOutlinedIcon className="icon" />
                    <span>Staffs</span>
                  </li>
                </NavLink>
              </AccordionDetails>
            </Accordion>
          )}

          {isAdmin && (
            <Accordion
              expanded={expanded === "settings"}
              onChange={handleChange("settings")}
              disableGutters
              square
              sx={{
                background: "transparent",
                boxShadow: "none",
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className="icon" />}
              >
                <p className="title">SYSTEM MANAGEMENT</p>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: 0 }}>
                <NavLink
                  to="/dashboard/tasks"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  style={{ textDecoration: "none" }}
                >
                  <li>
                    <AddTaskIcon className="icon" />
                    <span>Task</span>
                  </li>
                </NavLink>
                <NavLink
                  to="/dashboard/cadre"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  style={{ textDecoration: "none" }}
                >
                  <li>
                    <WorkspacesIcon className="icon" />
                    <span>Cadre</span>
                  </li>
                </NavLink>
                <NavLink
                  to="/dashboard/plots"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  style={{ textDecoration: "none" }}
                >
                  <li>
                    <AgricultureIcon className="icon" />
                    <span>Plots</span>
                  </li>
                </NavLink>
                <NavLink
                  to="/dashboard/farms"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  style={{ textDecoration: "none" }}
                >
                  <li>
                    <AgricultureIcon className="icon" />
                    <span>Farms</span>
                  </li>
                </NavLink>
                <NavLink
                  to="/dashboard/organizations"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  style={{ textDecoration: "none" }}
                >
                  <li>
                    <InventoryIcon className="icon" />
                    <span>Organizations</span>
                  </li>
                </NavLink>
                <NavLink
                  to="/dashboard/staff-user"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  style={{ textDecoration: "none" }}
                >
                  <li>
                    <AccountCircleOutlinedIcon className="icon" />
                    <span>Staffs</span>
                  </li>
                </NavLink>
              </AccordionDetails>
            </Accordion>
          )}
        </ul>
      </div>

      {/* THEME SWITCH */}
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
        <div>
          <NavLink
            to="/dashboard/logout"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ExitToAppIcon />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
