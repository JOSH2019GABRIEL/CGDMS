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
  </>
);
