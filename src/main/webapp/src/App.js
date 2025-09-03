import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { organizationInputs, productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import Organization from "./pages/addOrganization/Organization";
import AddNewOrg from "./pages/addOrganization/AddNewOrg";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
       <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Login />} />

        {/* Dashboard root */}
        <Route path="/dashboard" element={<Home />} />

         <Route path="/dashboard/organization" element={<Organization />} />

        {/* Users */}
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

        {/* Organizations */}
        <Route
          path="/dashboard/organizations"
          element={<List Component={Organization} path="/dashboard/organizations/new" />}
        />
        <Route
          path="/dashboard/organizations/new"
          element={<AddNewOrg />}
        />
        <Route
          path="/dashboard/organizations/:orgId"
          element={<Single title="Organization Details" />}
        />

          {/* Tasks */}
        <Route
          path="/dashboard/task"
          element={<List title="Task" path="/dashboard/task/new" />}
        />
        {/* <Route
          path="/dashboard/task/new"
          element={<New inputs={organizationInputs} title="Add New Task" />}
        /> */}
        <Route
          path="/dashboard/task/:orgId"
          element={<Single title="Task Details" />}
        />

        {/* Products */}
        <Route
          path="/dashboard/products"
          element={<List title="Products" path="/dashboard/products/new" />}
        />
        <Route
          path="/dashboard/products/new"
          element={<New inputs={productInputs} title="Add New Product" />}
        />
        <Route
          path="/dashboard/products/:productId"
          element={<Single title="Product Details" />}
        />
      </Routes>
    </BrowserRouter>

    </div>
  );
}

export default App;
