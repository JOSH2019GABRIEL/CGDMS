// src/routes/CoreRoutes.js
import { Route } from "react-router-dom";
import Login from "../pages/login/Login";
import ForgetPassword from "../pages/login/ForgetPassword";
import Logout from "../pages/login/Logout";
import Home from "../pages/Home/Home";
import List from "../pages/list/List";
import New from "../pages/new/New";
import Single from "../pages/single/Single";
import { userInputs } from "formSource";
import Organization from "../pages/addOrganization/Organization";
import AddNewOrg from "../pages/addOrganization/AddNewOrg";
import Farm from "../pages/addFarm/Farm";
import AddNewFarm from "../pages/addFarm/AddNewFarm";
import Staff from "../pages/addStaff/Staff";
import AddNewStaff from "../pages/addStaff/AddNewStaff";
import ChangePassword from "../pages/addStaff/ChangePassword";
import Cadre from "pages/cadre/Cadre";
import AddNewCadre from "pages/cadre/AddNewCadre";
import Task from "pages/addTask/Task";
import AddNewTask from "pages/addTask/AddNewTask";
import Product from "pages/fishManagement/product/Product";
import AddProduct from "pages/fishManagement/product/AddProduct";
import AddOrder from "pages/fishManagement/order/AddOrder";
import Order from "pages/fishManagement/order/Order";
import FulfilmentOrder from "pages/fishManagement/fulfilment/FulfilmentOrder";
import Scheme from "pages/fishManagement/commissionscheme/Scheme";
import AddScheme from "pages/fishManagement/commissionscheme/AddScheme";

export const CoreRoutes = (
  <>
    <Route path="/" element={<Login />} />
    <Route path="/forgot-password" element={<ForgetPassword />} />
    <Route path="/dashboard/logout" element={<Logout />} />
    <Route path="/dashboard" element={<Home />} />

    <Route
      path="/dashboard/users"
      element={<List title="Users" path="/dashboard/users/new" />}
    />
    <Route
      path="/dashboard/users/new"
      element={<New inputs={userInputs} title="Add New User" />}
    />
    <Route
      path="/dashboard/users/:userId"
      element={<Single title="User Details" />}
    />

    <Route
      path="/dashboard/organizations"
      element={
        <List Component={Organization} path="/dashboard/organizations/new" />
      }
    />
    <Route path="/dashboard/organizations/:id" element={<AddNewOrg />} />
    <Route path="/dashboard/organizations/new" element={<AddNewOrg />} />

    <Route
      path="/dashboard/farms"
      element={<List Component={Farm} path="/dashboard/farm/new" />}
    />
    <Route path="/dashboard/farm/:id" element={<AddNewFarm />} />
    <Route path="/dashboard/farm/new" element={<AddNewFarm />} />

    <Route
      path="/dashboard/staff-user"
      element={<List Component={Staff} path="/dashboard/staff-user/new" />}
    />
    <Route path="/dashboard/staff-user/:id" element={<AddNewStaff />} />
    <Route path="/dashboard/staff-user/new" element={<AddNewStaff />} />
    <Route
      path="/dashboard/staff-user/change-password"
      element={<ChangePassword />}
    />
    <Route
      path="/dashboard/cadre"
      element={<List Component={Cadre} path="/dashboard/harvest-event/new" />}
    />
    <Route path="/dashboard/cadre/:id" element={<AddNewCadre />} />
    <Route path="/dashboard/cadre/new" element={<AddNewCadre />} />

    <Route path="/dashboard/tasks" element={<List Component={Task} path="/dashboard/task/new" />} />
    <Route path="/dashboard/task/new" element={<AddNewTask />} />
    <Route path="/dashboard/task/:id" element={<AddNewTask />} />

    <Route path="/dashboard/products" element={<List Component={Product} path="/dashboard/product/new" />} />
    <Route path="/dashboard/product/new" element={<AddProduct />} />
    <Route path="/dashboard/product/:id" element={<AddProduct />} />

    <Route path="/dashboard/orders" element={<List Component={Order} path="/dashboard/order/new" />} />
    <Route path="/dashboard/order/new" element={<AddOrder />} />
    <Route path="/dashboard/order/:id" element={<AddOrder />} />

        <Route path="/dashboard/fulfilments" element={<List Component={FulfilmentOrder} />} />

    <Route path="/dashboard/schemes" element={<List Component={Scheme} path="/dashboard/scheme/new" />} />
    <Route path="/dashboard/scheme/new" element={<AddScheme />} />
    <Route path="/dashboard/scheme/:id" element={<AddScheme />} />
  
  </>
);
