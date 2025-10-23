import Home from "./pages/Home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { userInputs } from "./formSource";
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
import Flock from "pages/broiler/addFlock/Flock";
import AddNewFlock from "pages/broiler/addFlock/AddNewFlock";
import DailyBroilerLog from "pages/broiler/broilerLog/DailyBroilerLog";
import AddDailyBroilerLog from "pages/broiler/broilerLog/AddDailyBroilerLog";
import WeightSamples from "pages/broiler/sampleWeight/WeightSamples";
import AddWeightSample from "pages/broiler/sampleWeight/AddWeightSample";
import VaccinationLog from "pages/broiler/vaccineLog/VaccinationLog";
import AddVaccinationLog from "pages/broiler/vaccineLog/AddVaccinationLog";
import MedicationLogs from "pages/broiler/medicationLog/MedicationLogs";
import ThinningEvents from "pages/broiler/thiningEvent/ThinningEvents";
import AddThinningEvent from "pages/broiler/thiningEvent/AddThinningEvent";
import HarvestEvents from "pages/broiler/harvestEvent/HarvestEvents";
import AddHarvestEvent from "pages/broiler/harvestEvent/AddHarvestEvent";
import Cadre from "pages/cadre/Cadre";
import AddNewCadre from "pages/cadre/AddNewCadre";
import AddMedicationLogs from "pages/broiler/medicationLog/AddMedicationLog";
import AddProcessingBatch from "pages/broiler/processingBatch/AddProcessingBatch";
import ProcessingBatch from "pages/broiler/processingBatch/ProcessingBatch";
import SlaughterLog from "pages/broiler/slaughterLog/SlaughterLog";
import AddSlaughterLog from "pages/broiler/slaughterLog/AddSlaughterLog";
import CutupYield from "pages/broiler/cutupYield/CutupYield";
import AddCutupYield from "pages/broiler/cutupYield/AddCutupYield";
import Byproducts from "pages/broiler/byProduct/Byproducts";
import AddByproducts from "pages/broiler/byProduct/AddByproducts";
import Wastes from "pages/broiler/waste/Wastes";
import AddWaste from "pages/broiler/waste/AddWaste";
import Plots from "pages/vegetables/plot/Plots";
import AddPlot from "pages/vegetables/plot/AddPlot";
import CropVarieties from "pages/vegetables/cropvarities/CropVarieties";
import AddCropVariety from "pages/vegetables/cropvarities/AddCropVariety";
import AddCropLog from "pages/vegetables/croplog/AddCropLog";
import CropLogs from "pages/vegetables/croplog/CropLogs";
import PlantingEvents from "pages/vegetables/plantingevent/PlantingEvents";
import AddPlantingEvent from "pages/vegetables/plantingevent/AddPlantingEvent";
import HarvestBatches from "pages/vegetables/harvestbatche/HarvestBatches";
import AddHarvestBatch from "pages/vegetables/harvestbatche/AddHarvestBatch";
import PostLossHarvest from "pages/vegetables/postlossharvest/PostLossHarvests";
import AddPostLossHarvest from "pages/vegetables/postlossharvest/AddPossLossHarvest";
import AddSalesLink from "pages/vegetables/saleslink/AddSalesLink";
import SalesLink from "pages/vegetables/saleslink/SalesLink";
import ForgetPassword from "pages/login/ForgetPassword";
import UserDashboard from "pages/dashboard/UserDashBoard";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter basename="/api/v1">
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/dashboard/logout" element={<Logout />} />
          <Route path="/dashboard" element= {<Home />}/>
          {/* Dashboard root */}
          {/* <Route path="/dashboard" element={isAdmin ? <Home /> : <UserDashboard/>} /> */}

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
              <List
                Component={Organization}
                path="/dashboard/organizations/new"
              />
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
            path="/dashboard/pond"
            element={<List Component={Pond} path="/dashboard/pond/new" />}
          />
          <Route path="/dashboard/pond/:id" element={<AddNewPond />} />
          <Route path="/dashboard/pond/new" element={<AddNewPond />} />

          <Route
            path="/dashboard/batches"
            element={<List Component={Batch} path="/dashboard/batch/new" />}
          />
          <Route path="/dashboard/batches/new" element={<AddNewBatch />} />
          <Route path="/dashboard/batch/:id" element={<AddNewBatch />} />

          <Route
            path="/dashboard/batch-movement"
            element={
              <List
                Component={BatchMovement}
                path="/dashboard/batch-movement/new"
              />
            }
          />
          <Route
            path="/dashboard/batch-movement/:id"
            element={<AddNewBatchMovement />}
          />
          <Route
            path="/dashboard/batch-movement/new"
            element={<AddNewBatchMovement />}
          />
          <Route
            path="/dashboard/feed-log"
            element={
              <List Component={FeedLog} path="/dashboard/feed-log/new" />
            }
          />
          <Route path="/dashboard/feed-log/new" element={<AddNewFeedLog />} />
          <Route path="/dashboard/feed-log/:id" element={<AddNewFeedLog />} />

          <Route
            path="/dashboard/medication-logs"
            element={
              <List
                Component={MedicationLog}
                path="/dashboard/medication-log/new"
              />
            }
          />
          <Route
            path="/dashboard/medication-log/new"
            element={<AddMedicationLog />}
          />
          <Route
            path="/dashboard/medication-log/:id"
            element={<AddMedicationLog />}
          />

          <Route
            path="/dashboard/environment-logs"
            element={
              <List
                Component={EnvironmentLog}
                path="/dashboard/environment-log/new"
              />
            }
          />
          <Route
            path="/dashboard/environment-log/new"
            element={<AddNewEnvironmentLog />}
          />
          <Route
            path="/dashboard/environment-log/:id"
            element={<AddNewEnvironmentLog />}
          />

          <Route
            path="/dashboard/fish-performances"
            element={
              <List
                Component={FishPerformance}
                path="/dashboard/fish-performance/new"
              />
            }
          />
          <Route
            path="/dashboard/fish-performance/new"
            element={<AddFishPerformance />}
          />
          <Route
            path="/dashboard/fish-performance/:id"
            element={<AddFishPerformance />}
          />

          <Route
            path="/dashboard/tasks"
            element={<List Component={Task} path="/dashboard/task/new" />}
          />
          <Route path="/dashboard/task/new" element={<AddNewTask />} />
          <Route path="/dashboard/task/:id" element={<AddNewTask />} />

          <Route
            path="/dashboard/staff-user"
            element={
              <List Component={Staff} path="/dashboard/staff-user/new" />
            }
          />
          <Route path="/dashboard/staff-user/:id" element={<AddNewStaff />} />
          <Route path="/dashboard/staff-user/new" element={<AddNewStaff />} />

          <Route
            path="/dashboard/staff-user/change-password"
            element={<ChangePassword />}
          />

          <Route
          path="/dashboard/flock"
          element={<List Component={Flock} path="/dashboard/flock/new" />}
        />
        <Route path="/dashboard/flock/:id" element={<AddNewFlock />} />
        <Route
          path="/dashboard/flock/new"
          element={<AddNewFlock />}
        />

        <Route
          path="/dashboard/broiler-log"
          element={<List Component={DailyBroilerLog} path="/dashboard/broiler-log/new" />}
        />
        <Route path="/dashboard/broiler-log/:id" element={<AddDailyBroilerLog />} />
        <Route
          path="/dashboard/broiler-log/new"
          element={<AddDailyBroilerLog />}
        />
{/* begin from here */}
        <Route
          path="/dashboard/weight-sample"
          element={<List Component={WeightSamples} path="/dashboard/weight-sample/new" />}
        />
        <Route path="/dashboard/weight-sample/:id" element={<AddWeightSample />} />
        <Route
          path="/dashboard/weight-sample/new"
          element={<AddWeightSample />}
        />

<Route
          path="/dashboard/broiler-vaccination-log"
          element={<List Component={VaccinationLog} path="/dashboard/broiler-vaccination-log/new" />}
        />
        <Route path="/dashboard/broiler-vaccination-log/:id" element={<AddVaccinationLog />} />
        <Route
          path="/dashboard/broiler-vaccination-log/new"
          element={<AddVaccinationLog />}
        />
        <Route
          path="/dashboard/broiler-medication-log"
          element={<List Component={MedicationLogs} path="/dashboard/broiler-medication-log/new" />}
        />
        <Route path="/dashboard/broiler-medication-log/:id" element={<AddMedicationLogs />} />
        <Route
          path="/dashboard/broiler-medication-log/new"
          element={<AddMedicationLogs />}
        />
        <Route
          path="/dashboard/thinning-event"
          element={<List Component={ThinningEvents} path="/dashboard/thinning-event/new" />}
        />
        <Route path="/dashboard/thinning-event/:id" element={<AddThinningEvent />} />
        <Route
          path="/dashboard/thinning-event/new"
          element={<AddThinningEvent />}
        />

         <Route
          path="/dashboard/harvest-event"
          element={<List Component={HarvestEvents} path="/dashboard/harvest-event/new" />}
        />
        <Route path="/dashboard/harvest-event/:id" element={<AddHarvestEvent />} />
        <Route
          path="/dashboard/harvest-event/new"
          element={<AddHarvestEvent />}
        />
        <Route
          path="/dashboard/cadre"
          element={<List Component={Cadre} path="/dashboard/harvest-event/new" />}
        />
        <Route path="/dashboard/cadre/:id" element={<AddNewCadre />} />
        <Route
          path="/dashboard/cadre/new"
          element={<AddNewCadre />}
        />

        <Route
          path="/dashboard/processing-batch"
          element={<List Component={ProcessingBatch} path="/dashboard/harvest-event/new" />}
        />
        <Route path="/dashboard/processing-batch/:id" element={<AddProcessingBatch />} />
        <Route
          path="/dashboard/processing-batch/new"
          element={<AddProcessingBatch />}
        />

        <Route
          path="/dashboard/slaughter-logs"
          element={<List Component={SlaughterLog} path="/dashboard/harvest-event/new" />}
        />
        <Route path="/dashboard/slaughter-log/:id" element={<AddSlaughterLog />} />
        <Route
          path="/dashboard/slaughter-log/new"
          element={<AddSlaughterLog />}
        />

        <Route
          path="/dashboard/cutup-yields"
          element={<List Component={CutupYield} path="/dashboard/cutup-yield/new" />}
        />
        <Route path="/dashboard/cutup-yield/:id" element={<AddCutupYield />} />
        <Route
          path="/dashboard/cutup-yield/new"
          element={<AddCutupYield />}
        />

        <Route
          path="/dashboard/by-products"
          element={<List Component={Byproducts} path="/dashboard/by-product/new" />}
        />
        <Route path="/dashboard/by-product/:id" element={<AddByproducts />} />
        <Route
          path="/dashboard/by-product/new"
          element={<AddByproducts />}
        />

        <Route
          path="/dashboard/wastes"
          element={<List Component={Wastes} path="/dashboard/waste/new" />}
        />
        <Route path="/dashboard/waste/:id" element={<AddWaste />} />
        <Route
          path="/dashboard/waste/new"
          element={<AddWaste />}
        />

        <Route
          path="/dashboard/plots"
          element={<List Component={Plots} path="/dashboard/plot/new" />}
        />
        <Route path="/dashboard/plot/:id" element={<AddPlot />} />
        <Route
          path="/dashboard/plot/new"
          element={<AddPlot />}
        />

        <Route
          path="/dashboard/crop-varieties"
          element={<List Component={CropVarieties} path="/dashboard/crop-variety/new" />}
        />
        <Route path="/dashboard/crop-variety/:id" element={<AddCropVariety />} />
        <Route
          path="/dashboard/crop-variety/new"
          element={<AddCropVariety />}
        />

        <Route
          path="/dashboard/veg-crop-logs"
          element={<List Component={CropLogs} path="/dashboard/veg-crop-log/new" />}
        />
        <Route path="/dashboard/veg-crop-log/:id" element={<AddCropLog />} />
        <Route
          path="/dashboard/veg-crop-log/new"
          element={<AddCropLog />}
        />

        <Route
          path="/dashboard/planting-events"
          element={<List Component={PlantingEvents} path="/dashboard/planting-event/new" />}
        />
        <Route path="/dashboard/planting-event/:id" element={<AddPlantingEvent />} />
        <Route
          path="/dashboard/planting-event/new"
          element={<AddPlantingEvent />}
        />

        <Route
          path="/dashboard/harvest-batches"
          element={<List Component={HarvestBatches} path="/dashboard/harvest-batch/new" />}
        />
        <Route path="/dashboard/harvest-batch/:id" element={<AddHarvestBatch />} />
        <Route
          path="/dashboard/harvest-batch/new"
          element={<AddHarvestBatch />}
        />

        <Route
          path="/dashboard/postloss-harvestes"
          element={<List Component={PostLossHarvest} path="/dashboard/postloss-harvest/new" />}
        />
        <Route path="/dashboard/postloss-harvest/:id" element={<AddPostLossHarvest />} />
        <Route
          path="/dashboard/postloss-harvest/new"
          element={<AddPostLossHarvest />}
        />

        <Route
          path="/dashboard/sales"
          element={<List Component={SalesLink} path="/dashboard/sales/new" />}
        />
        <Route path="/dashboard/sales/:id" element={<AddSalesLink />} />
        <Route
          path="/dashboard/sales/new"
          element={<AddSalesLink />}
        />
        



        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
