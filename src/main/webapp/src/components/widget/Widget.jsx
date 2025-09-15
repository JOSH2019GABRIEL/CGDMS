import "./widget.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { Link } from "react-router-dom";
import { url as baseUrl } from "../../api";


const Widget = ({ type }) => {
  const [amount, setAmount] = useState(0);
  const diff = 20; // placeholder percentage growth

  let data;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ get token from localStorage
        if (!token) {
          console.error("No token found, please login first.");
          return;
        }

        let res;
        switch (type) {
          case "user":
            res = await axios.get(
          `${baseUrl}staff/get-count`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
            break;
          case "pond":
            res = await axios.get(
          `${baseUrl}ponds/get-count`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
            break;
          case "fingerlins":
             res = await axios.get(
          `${baseUrl}batch/get-count`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
            break;
          case "available":
             res = await axios.get(
          `${baseUrl}ponds/get-available`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
            break;
          default:
            break;
        }

        if (res) setAmount(res.data);
      } catch (err) {
        console.error("Error fetching count:", err);
      }
    };

    fetchData();
  }, [type]);

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        link: <Link to="/dashboard/staff-user" style={{ textDecoration: "none" }}> See all users </Link>,
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{ color: "crimson", backgroundColor: "rgba(255, 0, 0, 0.2)" }}
          />
        ),
      };
      break;
    case "pond":
      data = {
        title: "PONDS",
        link: "View all ponds",
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "fingerlins":
      data = {
        title: "FINGERLINS",
        link: "View all fingerlins",
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "available":
      data = {
        title: "AVAILABLE FINGERLINS",
        link: "See details",
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">{amount}</span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {diff} %
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
