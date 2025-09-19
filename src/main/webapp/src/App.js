import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
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
import AddNewBatchMovement from "./pages/addBatchMovement/AddNewBatchMovement";
import FeedLog from "./pages/addFeedLog/FeedLog";
import AddNewFeedLog from "./pages/addFeedLog/AddNewFeedLog";
import MedicationLog from "./pages/addMedicationLogs/MedicationLog";
import AddMedicationLog from "./pages/addMedicationLogs/AddMedicationLog";
import EnvironmentLog from "./pages/addEnvironmentLogs/EnvironmentLog";
import AddNewEnvironmentLog from "./pages/addEnvironmentLogs/AddNewEnvironmentLog";
import FishPerformance from "./pages/addFishPerformance/FishPerformance";
import AddFishPerformance from "./pages/addFishPerformance/AddFishPerformance";
import Task from "./pages/addTask/Task";
import AddNewTask from "./pages/addTask/AddNewTask";
import Logout from "./pages/login/Logout";


function App() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
       <BrowserRouter basename="/api/v1">
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard/logout"
          element= {<Logout/>}
        />
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
        <Route path="/dashboard/organizations/:id" element={<AddNewOrg />} />
        <Route
          path="/dashboard/organizations/new"
          element={<AddNewOrg />}
        />

        <Route
          path="/dashboard/farm"
          element={<List Component={Farm} path="/dashboard/farm/new" />}
        />
        <Route path="/dashboard/farm/:id" element={<AddNewFarm />} />
        <Route
          path="/dashboard/farm/new"
          element={<AddNewFarm />}
        />

        <Route
          path="/dashboard/pond"
          element={<List Component={Pond} path="/dashboard/pond/new" />}
        />
         <Route path="/dashboard/pond/:id" element={<AddNewPond />} />
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
        <Route path="/dashboard/batch/:id" element={<AddNewBatch />} />

        <Route
          path="/dashboard/batch-movement"
          element={<List Component={BatchMovement} path="/dashboard/batch-movement/new" />}
        />
        <Route path="/dashboard/batch-movement/:id" element={<AddNewBatchMovement />} />
        <Route
          path="/dashboard/batch-movement/new"
          element={<AddNewBatchMovement />}
        />
         <Route
          path="/dashboard/feed-log"
          element={<List Component={FeedLog} path="/dashboard/feed-log/new" />}
        />
        <Route
          path="/dashboard/feed-log/new"
          element={<AddNewFeedLog />}
        />
        <Route path="/dashboard/feed-log/:id" element={<AddNewFeedLog />} />

        <Route
          path="/dashboard/medication-logs"
          element={<List Component={MedicationLog} path="/dashboard/medication-log/new" />}
        />
        <Route
          path="/dashboard/medication-log/new"
          element={<AddMedicationLog />}
        />
        <Route path="/dashboard/medication-log/:id" element={<AddMedicationLog />} />

        <Route
          path="/dashboard/environment-logs"
          element={<List Component={EnvironmentLog} path="/dashboard/environment-log/new" />}
        />
        <Route
          path="/dashboard/environment-log/new"
          element={<AddNewEnvironmentLog />}
        />
        <Route path="/dashboard/environment-log/:id" element={<AddNewEnvironmentLog />} />

        <Route
          path="/dashboard/fish-performances"
          element={<List Component={FishPerformance} path="/dashboard/fish-performance/new" />}
        />
        <Route
          path="/dashboard/fish-performance/new"
          element={<AddFishPerformance />}
        />
        <Route path="/dashboard/fish-performance/:id" element={<AddFishPerformance />} />

         <Route
          path="/dashboard/tasks"
          element={<List Component={Task} path="/dashboard/task/new" />}
        />
        <Route
          path="/dashboard/task/new"
          element={<AddNewTask />}
        />
        <Route path="/dashboard/task/:id" element={<AddNewTask />} />

         <Route
          path="/dashboard/staff-user"
          element={<List Component={Staff} path="/dashboard/staff-user/new" />}
        />
        <Route path="/dashboard/staff-user/:id" element={<AddNewStaff />} />
        <Route
          path="/dashboard/staff-user/new"
          element={<AddNewStaff />}
        />

  

          <Route
          path="/dashboard/farms"
          element={<List Component={Farm} />}
        />
        <Route path="/dashboard/staff-user/change-password" 
        element={<ChangePassword />} />
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
