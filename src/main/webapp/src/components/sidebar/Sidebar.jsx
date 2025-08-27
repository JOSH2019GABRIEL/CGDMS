import './sidebar.scss'


import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined';
import CircleNotificationsOutlinedIcon from '@mui/icons-material/CircleNotificationsOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import DisplaySettingsOutlinedIcon from '@mui/icons-material/DisplaySettingsOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import  { Link } from "react-router-dom";
import { DarkModeContext } from '../../context/darkModeContext';
import { useContext } from 'react'

const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);
  return (
    <div className='sidebar'>
      <Link to="/"  style={{textDecoration: "none"}}>
        <div className="top"><span className='logo'>Ecommerce Admin</span>
          </div>
          </Link>
          <hr/> 
        <div className="center">
          <ul>
           
            <p className="title">MAIN</p>
            <li>
            <DashboardOutlinedIcon className="icon"/>
              <span>DashBoard</span></li>
            <p className="title">LIST</p>
            <Link to="/users"  style={{textDecoration: "none"}}>
            <li>
              <PeopleOutlinedIcon className="icon"/>
              <span>Users </span></li> </Link>
            <Link to="/products" style={{textDecoration: "none"}}>
            <li>
            <LocalShippingOutlinedIcon className="icon"/>
              <span>products</span></li> </Link>
            <li>
            <CardGiftcardOutlinedIcon className="icon"/>
              <span>Orders</span></li>
            <li>
            <Inventory2OutlinedIcon className="icon"/>
              <span>Delivery</span></li>
            <p className="title">USEFUL</p>
            <li>
            <AutoGraphOutlinedIcon className="icon"/>
              <span>Stats</span></li>
            <li>
            <CircleNotificationsOutlinedIcon className="icon"/>
              <span>Notifications</span></li>
            <p className="title">SERVICE</p>
            <li>
            <LocalHospitalOutlinedIcon className="icon"/>
              <span>System Health</span></li>
            <li>
            <PsychologyOutlinedIcon className="icon"/>
              <span>Logs</span></li>
            <li>
            <DisplaySettingsOutlinedIcon className="icon"/>
              <span>Settings</span></li>
            <p className="title">USER</p>
            <li>
            <ManageAccountsOutlinedIcon className="icon"/>
              <span>Profile</span></li>
            <li>
            <ExitToAppOutlinedIcon className="icon"/>
              <span>Logout</span></li>

          </ul>
          </div>
        <div className="bottom">
          <div className="colorOption" onClick={()=> dispatch({type: "LIGHT"})} ></div>
          <div className="colorOption" onClick={()=> dispatch({type: "DARK"})}></div>
          
          </div>
        
        </div>
  )
}

export default Sidebar