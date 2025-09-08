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
import Farm from "./pages/addFarm/Farm";
import AddNewFarm from "./pages/addFarm/AddNewFarm";
import AddNewPond from "./pages/addPond/AddNewPond";
import Pond from "./pages/addPond/Pond";
import AddNewBatch from "./pages/addBatch/AddNewBatch";
import Batch from "./pages/addBatch/Batch";
import BatchMovement from "./pages/addBatchMovement/BatchMovement";
import Staff from "./pages/addStaff/Staff";
import AddNewStaff from "./pages/addStaff/AddNewStaff";
import ChangePassword from "./pages/addStaff/ChangePassword";


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
          element={<List Component={Organization} path="/dashboard/organizations/new" />}
        />
        <Route
          path="/dashboard/organizations/new"
          element={<AddNewOrg />}
        />

        <Route
          path="/dashboard/farm"
          element={<List Component={Farm} path="/dashboard/farm/new" />}
        />
        <Route
          path="/dashboard/farm/new"
          element={<AddNewFarm />}
        />

        <Route
          path="/dashboard/pond"
          element={<List Component={Pond} path="/dashboard/pond/new" />}
        />
        <Route
          path="/dashboard/pond/new"
          element={<AddNewPond />}
        />

         <Route
          path="/dashboard/batches"
          element={<List Component={Batch} path="/dashboard/batch/new" />}
        />
        <Route
          path="/dashboard/batches/new"
          element={<AddNewBatch />}
        />

        <Route
          path="/dashboard/batch-movement"
          element={<List Component={BatchMovement} path="/dashboard/batch-movement/new" />}
        />
        <Route
          path="/dashboard/batch-movement/new"
          element={<AddNewBatch />}
        />

         <Route
          path="/dashboard/staff-user"
          element={<List Component={Staff} path="/dashboard/staff-user/new" />}
        />
        <Route
          path="/dashboard/staff-user/new"
          element={<AddNewStaff />}
        />

        <Route
          path="/dashboard/organizations/:orgId"
          element={<Single title="Organization Details" />}
        />

          <Route
          path="/dashboard/farms"
          element={<List Component={Farm} />}
        />
        <Route path="/dashboard/staff-user/change-password" 
        element={<ChangePassword />} />
        {/* <Route
          path="/dashboard/farm/new"
          element={<AddNewFarm />}
        /> */}


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
