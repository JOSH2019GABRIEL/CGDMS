// src/routes/VegetableRoutes.jsx
import { Route } from "react-router-dom";
import List from "../pages/list/List";

import Plots from "../pages/vegetables/plot/Plots";
import AddPlot from "../pages/vegetables/plot/AddPlot";
import CropVarieties from "../pages/vegetables/cropvarities/CropVarieties";
import AddCropVariety from "../pages/vegetables/cropvarities/AddCropVariety";
import CropLogs from "../pages/vegetables/croplog/CropLogs";
import AddCropLog from "../pages/vegetables/croplog/AddCropLog";
import PlantingEvents from "../pages/vegetables/plantingevent/PlantingEvents";
import AddPlantingEvent from "../pages/vegetables/plantingevent/AddPlantingEvent";
import HarvestBatches from "../pages/vegetables/harvestbatche/HarvestBatches";
import AddHarvestBatch from "../pages/vegetables/harvestbatche/AddHarvestBatch";
import PostLossHarvest from "../pages/vegetables/postlossharvest/PostLossHarvests";
import AddPostLossHarvest from "../pages/vegetables/postlossharvest/AddPossLossHarvest";
import SalesLink from "../pages/vegetables/saleslink/SalesLink";
import AddSalesLink from "../pages/vegetables/saleslink/AddSalesLink";

export const VegetablesRoutes = (
  <>
    <Route path="/dashboard/plots" element={<List Component={Plots} path="/dashboard/plot/new" />} />
    <Route path="/dashboard/plot/new" element={<AddPlot />} />
    <Route path="/dashboard/plot/:id" element={<AddPlot />} />

    <Route path="/dashboard/crop-varieties" element={<List Component={CropVarieties} path="/dashboard/crop-variety/new" />} />
    <Route path="/dashboard/crop-variety/new" element={<AddCropVariety />} />
    <Route path="/dashboard/crop-variety/:id" element={<AddCropVariety />} />

    <Route path="/dashboard/veg-crop-logs" element={<List Component={CropLogs} path="/dashboard/veg-crop-log/new" />} />
    <Route path="/dashboard/veg-crop-log/new" element={<AddCropLog />} />
    <Route path="/dashboard/veg-crop-log/:id" element={<AddCropLog />} />

    <Route path="/dashboard/planting-events" element={<List Component={PlantingEvents} path="/dashboard/planting-event/new" />} />
    <Route path="/dashboard/planting-event/new" element={<AddPlantingEvent />} />
    <Route path="/dashboard/planting-event/:id" element={<AddPlantingEvent />} />

    <Route path="/dashboard/harvest-batches" element={<List Component={HarvestBatches} path="/dashboard/harvest-batch/new" />} />
    <Route path="/dashboard/harvest-batch/new" element={<AddHarvestBatch />} />
    <Route path="/dashboard/harvest-batch/:id" element={<AddHarvestBatch />} />

    <Route path="/dashboard/postloss-harvestes" element={<List Component={PostLossHarvest} path="/dashboard/postloss-harvest/new" />} />
    <Route path="/dashboard/postloss-harvest/new" element={<AddPostLossHarvest />} />
    <Route path="/dashboard/postloss-harvest/:id" element={<AddPostLossHarvest />} />

    <Route path="/dashboard/sales" element={<List Component={SalesLink} path="/dashboard/sales/new" />} />
    <Route path="/dashboard/sales/new" element={<AddSalesLink />} />
    <Route path="/dashboard/sales/:id" element={<AddSalesLink />} />
  </>
);
