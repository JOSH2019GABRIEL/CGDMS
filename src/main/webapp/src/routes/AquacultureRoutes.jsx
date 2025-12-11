// src/routes/AquacultureRoutes.js
import { Route } from "react-router-dom";
import Pond from "pages/addPond/Pond";
import AddNewPond from "pages/addPond/AddNewPond";
import Batch from "pages/addBatch/Batch";
import AddNewBatch from "pages/addBatch/AddNewBatch";
import BatchMovement from "pages/addBatchMovement/BatchMovement";
import AddNewBatchMovement from "pages/addBatchMovement/AddNewBatchMovement";
import FeedLog from "pages/addFeedLog/FeedLog";
import AddNewFeedLog from "pages/addFeedLog/AddNewFeedLog";
import MedicationLog from "pages/addMedicationLogs/MedicationLog";
import AddMedicationLog from "pages/addMedicationLogs/AddMedicationLog";
import EnvironmentLog from "pages/addEnvironmentLogs/EnvironmentLog";
import AddNewEnvironmentLog from "pages/addEnvironmentLogs/AddNewEnvironmentLog";
import FishPerformance from "pages/addFishPerformance/FishPerformance";
import AddFishPerformance from "pages/addFishPerformance/AddFishPerformance";
import List from "pages/list/List";
import FishHarvest from "pages/addFishHarvest/FishHarvest";
import AddFishHarvest from "pages/addFishHarvest/AddFishHarvest";
import FishPostHarvest from "pages/fishManagement/fishPostHarvest/FishPostHarvest";
import AddFishPostHarvest from "pages/fishManagement/fishPostHarvest/AddFishPostHarvest";
import FishLiveSale from "pages/fishManagement/fishlivesale/FishLiveSale";
import AddFishLiveSale from "pages/fishManagement/fishlivesale/AddFishLiveSale";
import SmokingTransfer from "pages/fishManagement/smokingTransfer/SmokingTransfer";
import AddSmokingTransfer from "pages/fishManagement/smokingTransfer/AddSmokingTransfer";
import NominalLoss from "pages/fishManagement/nominalLoss/NominalLoss";
import AddNominalLoss from "pages/fishManagement/nominalLoss/AddNominalLoss";


export const AquacultureRoutes = (
  <>
    <Route path="/dashboard/pond" element={<List Component={Pond} path="/dashboard/pond/new" />} />
    <Route path="/dashboard/pond/new" element={<AddNewPond />} />
    <Route path="/dashboard/pond/:id" element={<AddNewPond />} />

    <Route path="/dashboard/batches" element={<List Component={Batch} path="/dashboard/batch/new" />} />
    <Route path="/dashboard/batches/new" element={<AddNewBatch />} />
    <Route path="/dashboard/batch/:id" element={<AddNewBatch />} />

    <Route path="/dashboard/batch-movement" element={<List Component={BatchMovement} path="/dashboard/batch-movement/new" />} />
    <Route path="/dashboard/batch-movement/new" element={<AddNewBatchMovement />} />
    <Route path="/dashboard/batch-movement/:id" element={<AddNewBatchMovement />} />

    <Route path="/dashboard/feed-log" element={<List Component={FeedLog} path="/dashboard/feed-log/new" />} />
    <Route path="/dashboard/feed-log/new" element={<AddNewFeedLog />} />
    <Route path="/dashboard/feed-log/:id" element={<AddNewFeedLog />} />

    <Route path="/dashboard/medication-logs" element={<List Component={MedicationLog} path="/dashboard/medication-log/new" />} />
    <Route path="/dashboard/medication-log/new" element={<AddMedicationLog />} />
    <Route path="/dashboard/medication-log/:id" element={<AddMedicationLog />} />

    <Route path="/dashboard/environment-logs" element={<List Component={EnvironmentLog} path="/dashboard/environment-log/new" />} />
    <Route path="/dashboard/environment-log/new" element={<AddNewEnvironmentLog />} />
    <Route path="/dashboard/environment-log/:id" element={<AddNewEnvironmentLog />} />

    <Route path="/dashboard/fish-performances" element={<List Component={FishPerformance} path="/dashboard/fish-performance/new" />} />
    <Route path="/dashboard/fish-performance/new" element={<AddFishPerformance />} />
    <Route path="/dashboard/fish-performance/:id" element={<AddFishPerformance />} />
    
    {/* new endpoint */}
    <Route path="/dashboard/fish-harvests" element={<List Component={FishHarvest} path="/dashboard/fish-harvest/new" />} />
    <Route path="/dashboard/fish-harvest/new" element={<AddFishHarvest />} />
    <Route path="/dashboard/fish-harvest/:id" element={<AddFishHarvest />} />

    <Route path="/dashboard/fish-post-harvests" element={<List Component={FishPostHarvest} path="/dashboard/fish-post-harvest/new" />} />
    <Route path="/dashboard/fish-post-harvest/new" element={<AddFishPostHarvest />} />
    <Route path="/dashboard/fish-post-harvest/:id" element={<AddFishPostHarvest />} />
  
    <Route path="/dashboard/fish-sales" element={<List Component={FishLiveSale} path="/dashboard/fish-sale/new" />} />
    <Route path="/dashboard/fish-sale/new" element={<AddFishLiveSale />} />
    <Route path="/dashboard/fish-sale/:id" element={<AddFishLiveSale />} />

    <Route path="/dashboard/smoking-plants" element={<List Component={SmokingTransfer} path="/dashboard/smoking-plant/new" />} />
    <Route path="/dashboard/smoking-plant/new" element={<AddSmokingTransfer />} />
    <Route path="/dashboard/smoking-plant/:id" element={<AddSmokingTransfer />} />

    <Route path="/dashboard/nominal-loss" element={<List Component={NominalLoss} path="/dashboard/nominal-loss/new" />} />
    <Route path="/dashboard/nominal-loss/new" element={<AddNominalLoss />} />
    <Route path="/dashboard/nominal-loss/:id" element={<AddNominalLoss />} />

  
  </>
);
