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
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import OutdoorGrillIcon from "@mui/icons-material/OutdoorGrill";
import SellIcon from "@mui/icons-material/Sell";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
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
  const isAgent = roles.includes("ROLE_AGENT");
  const isUser = roles.includes("ROLE_USER");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const dashboardPath = isAgent ? "/agent-dashboard" : "/dashboard";

  // const handleChange = (panel) => () => {
  //   setExpanded((prevExpanded) => (prevExpanded === panel ? false : panel));
  // };

  return (
    <div className="sidebar">
      <div className="top">
        <NavLink
          to={dashboardPath}
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
    {/* DASHBOARD — visible to USER or ADMIN but NOT AGENT */}
    {(isUser || isAdmin) && (
      <NavLink
        to={dashboardPath}
        className={({ isActive }) => (isActive ? "" : "active")}
        style={{ textDecoration: "none" }}
      >
        <li>
          <Dashboard className="icon" />
          <span>Dashboard</span>
        </li>
      </NavLink>
    )}

    {/* CATFISH, BROILER, VEGETABLES — Only ADMIN or USER */}
    {(isAdmin || isUser) && (
      <>
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
            <NavLink to="/dashboard/pond" style={{ textDecoration: "none" }}>
              <li>
                <StoreIcon className="icon" />
                <span>Pond</span>
              </li>
            </NavLink>

            <NavLink to="/dashboard/batches" style={{ textDecoration: "none" }}>
              <li>
                <WorkspacesIcon className="icon" />
                <span>Batch</span>
              </li>
            </NavLink>

            <NavLink
              to="/dashboard/batch-movement"
              style={{ textDecoration: "none" }}
            >
              <li>
                <TimelineIcon className="icon" />
                <span>Batch Movement</span>
              </li>
            </NavLink>

            <NavLink to="/dashboard/feed-log" style={{ textDecoration: "none" }}>
              <li>
                <RestaurantIcon className="icon" />
                <span>Feed Logs</span>
              </li>
            </NavLink>

            <NavLink
              to="/dashboard/medication-logs"
              style={{ textDecoration: "none" }}
            >
              <li>
                <LocalHospitalIcon className="icon" />
                <span>Medication Logs</span>
              </li>
            </NavLink>

            <NavLink
              to="/dashboard/environment-logs"
              style={{ textDecoration: "none" }}
            >
              <li>
                <ScienceIcon className="icon" />
                <span>Environment Logs</span>
              </li>
            </NavLink>

            <NavLink
              to="/dashboard/fish-performances"
              style={{ textDecoration: "none" }}
            >
              <li>
                <MonitorHeartIcon className="icon" />
                <span>Performance</span>
              </li>
            </NavLink>

            <NavLink
              to="/dashboard/fish-harvests"
              style={{ textDecoration: "none" }}
            >
              <li>
                <ReceiptLongIcon className="icon" />
                <span>Harvest</span>
              </li>
            </NavLink>

            <NavLink
              to="/dashboard/fish-post-harvests"
              style={{ textDecoration: "none" }}
            >
              <li>
                <DeleteSweepIcon className="icon" />
                <span>Post Harvest</span>
              </li>
            </NavLink>

            <NavLink
              to="/dashboard/fish-sales"
              style={{ textDecoration: "none" }}
            >
              <li>
                <ReceiptLongIcon className="icon" />
                <span>Live Sales</span>
              </li>
            </NavLink>

            <NavLink
              to="/dashboard/smoking-plants"
              style={{ textDecoration: "none" }}
            >
              <li>
                <OutdoorGrillIcon className="icon" />
                <span>Smoking Plant</span>
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
            <NavLink to="/dashboard/flock" style={{ textDecoration: "none" }}>
              <li>
                <AgricultureIcon className="icon" />
                <span>Flock</span>
              </li>
            </NavLink>

            <NavLink
              to="/dashboard/broiler-log"
              style={{ textDecoration: "none" }}
            >
              <li>
                <LineWeightIcon className="icon" />
                <span>Daily Log</span>
              </li>
            </NavLink>

            <NavLink
              to="/dashboard/weight-sample"
              style={{ textDecoration: "none" }}
            >
              <li>
                <TimelineIcon className="icon" />
                <span>Weight Sample</span>
              </li>
            </NavLink>

            <NavLink
              to="/dashboard/broiler-vaccination-log"
              style={{ textDecoration: "none" }}
            >
              <li>
                <OpacityIcon className="icon" />
                <span>Vaccination</span>
              </li>
            </NavLink>

            <NavLink
              to="/dashboard/broiler-medication-log"
              style={{ textDecoration: "none" }}
            >
              <li>
                <LocalHospitalIcon className="icon" />
                <span>Medication</span>
              </li>
            </NavLink>

            <NavLink
              to="/dashboard/thinning-event"
              style={{ textDecoration: "none" }}
            >
              <li>
                <SetMealIcon className="icon" />
                <span>Thinning</span>
              </li>
            </NavLink>

            <NavLink
              to="/dashboard/harvest-event"
              style={{ textDecoration: "none" }}
            >
              <li>
                <ReceiptLongIcon className="icon" />
                <span>Harvest</span>
              </li>
            </NavLink>

            <NavLink
              to="/dashboard/processing-batch"
              style={{ textDecoration: "none" }}
            >
              <li>
                <InventoryIcon className="icon" />
                <span>Processing</span>
              </li>
            </NavLink>

            <NavLink
              to="/dashboard/slaughter-logs"
              style={{ textDecoration: "none" }}
            >
              <li>
                <SetMealIcon className="icon" />
                <span>Slaughter</span>
              </li>
            </NavLink>

            <NavLink
              to="/dashboard/cutup-yields"
              style={{ textDecoration: "none" }}
            >
              <li>
                <LineWeightIcon className="icon" />
                <span>Cutup</span>
              </li>
            </NavLink>

            <NavLink to="/dashboard/by-products" style={{ textDecoration: "none" }}>
              <li>
                <StoreIcon className="icon" />
                <span>Byproducts</span>
              </li>
            </NavLink>

            <NavLink to="/dashboard/wastes" style={{ textDecoration: "none" }}>
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
              style={{ textDecoration: "none" }}
            >
              <li>
                <AgricultureIcon className="icon" />
                <span>Crop Varieties</span>
              </li>
            </NavLink>

            <NavLink
              to="/dashboard/veg-crop-logs"
              style={{ textDecoration: "none" }}
            >
              <li>
                <TimelineIcon className="icon" />
                <span>Daily Logs</span>
              </li>
            </NavLink>

            <NavLink
              to="/dashboard/planting-events"
              style={{ textDecoration: "none" }}
            >
              <li>
                <ScienceIcon className="icon" />
                <span>Planting</span>
              </li>
            </NavLink>

            <NavLink
              to="/dashboard/harvest-batches"
              style={{ textDecoration: "none" }}
            >
              <li>
                <ReceiptLongIcon className="icon" />
                <span>Harvest Batches</span>
              </li>
            </NavLink>

            <NavLink
              to="/dashboard/postloss-harvestes"
              style={{ textDecoration: "none" }}
            >
              <li>
                <DeleteSweepIcon className="icon" />
                <span>Post Harvest Loss</span>
              </li>
            </NavLink>

            <NavLink to="/dashboard/sales" style={{ textDecoration: "none" }}>
              <li>
                <ShoppingCartIcon className="icon" />
                <span>Sales</span>
              </li>
            </NavLink>
          </AccordionDetails>
        </Accordion>
      </>
    )}
  {/* </ul> */}
{/* </div> */}


          {/* ADMIN — full order menu */}
          {isAdmin && (
            <Accordion
              expanded={expanded === "ordersAdmin"}
              onChange={handleChange("ordersAdmin")}
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
                <p className="title">ORDER MANAGEMENT</p>
              </AccordionSummary>

              <AccordionDetails sx={{ padding: 0 }}>
                <NavLink to="/dashboard/fulfilments" style={{ textDecoration: "none" }}>
                  <li>
                    <SellIcon className="icon" />
                    <span>Fulfillment Center</span>
                  </li>
                </NavLink>
                <NavLink to="/dashboard/orders" style={{ textDecoration: "none" }}>
                  <li>
                    <AddShoppingCartIcon className="icon" />
                    <span>Orders</span>
                  </li>
                </NavLink>
              </AccordionDetails>
            </Accordion>
          )}

          {/* AGENT — only Order link */}
          {isAgent && !isAdmin && (
            <Accordion
              expanded={expanded === "agentOrders"}
              onChange={handleChange("agentOrders")}
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
                <p className="title">ORDER</p>
              </AccordionSummary>

              <AccordionDetails sx={{ padding: 0 }}>
                <NavLink to="/dashboard/orders" style={{ textDecoration: "none" }}>
                  <li>
                    <AddShoppingCartIcon className="icon" />
                    <span>Order</span>
                  </li>
                </NavLink>
              </AccordionDetails>
            </Accordion>
          )}

          {/* SYSTEM MANAGEMENT — ONLY ADMIN */}
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
                <NavLink to="/dashboard/tasks" style={{ textDecoration: "none" }}>
                  <li>
                    <AddTaskIcon className="icon" />
                    <span>Task</span>
                  </li>
                </NavLink>
                <NavLink to="/dashboard/products" style={{ textDecoration: "none" }}>
                  <li>
                    <ProductionQuantityLimitsIcon className="icon" />
                    <span>Product</span>
                  </li>
                </NavLink>
                <NavLink to="/dashboard/cadre" style={{ textDecoration: "none" }}>
                  <li>
                    <WorkspacesIcon className="icon" />
                    <span>Cadre</span>
                  </li>
                </NavLink>

                <NavLink to="/dashboard/schemes" style={{ textDecoration: "none" }}>
                  <li>
                    <MonetizationOnIcon className="icon" />
                    <span>Commission Scheme</span>
                  </li>
                </NavLink>

                <NavLink to="/dashboard/plots" style={{ textDecoration: "none" }}>
                  <li>
                    <AgricultureIcon className="icon" />
                    <span>Plots</span>
                  </li>
                </NavLink>
                <NavLink to="/dashboard/farms" style={{ textDecoration: "none" }}>
                  <li>
                    <AgricultureIcon className="icon" />
                    <span>Farms</span>
                  </li>
                </NavLink>
                <NavLink to="/dashboard/organizations" style={{ textDecoration: "none" }}>
                  <li>
                    <InventoryIcon className="icon" />
                    <span>Organizations</span>
                  </li>
                </NavLink>
                <NavLink to="/dashboard/staff-user" style={{ textDecoration: "none" }}>
                  <li>
                    <AccountCircleOutlinedIcon className="icon" />
                    <span>Staff Users</span>
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
