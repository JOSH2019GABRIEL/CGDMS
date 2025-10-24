// src/routes/BroilerRoutes.jsx
import { Route } from "react-router-dom";
import List from "../pages/list/List";

import Flock from "../pages/broiler/addFlock/Flock";
import AddNewFlock from "../pages/broiler/addFlock/AddNewFlock";
import DailyBroilerLog from "../pages/broiler/broilerLog/DailyBroilerLog";
import AddDailyBroilerLog from "../pages/broiler/broilerLog/AddDailyBroilerLog";
import WeightSamples from "../pages/broiler/sampleWeight/WeightSamples";
import AddWeightSample from "../pages/broiler/sampleWeight/AddWeightSample";
import VaccinationLog from "../pages/broiler/vaccineLog/VaccinationLog";
import AddVaccinationLog from "../pages/broiler/vaccineLog/AddVaccinationLog";
import MedicationLogs from "../pages/broiler/medicationLog/MedicationLogs";
import AddMedicationLogs from "../pages/broiler/medicationLog/AddMedicationLog";
import ThinningEvents from "../pages/broiler/thiningEvent/ThinningEvents";
import AddThinningEvent from "../pages/broiler/thiningEvent/AddThinningEvent";
import HarvestEvents from "../pages/broiler/harvestEvent/HarvestEvents";
import AddHarvestEvent from "../pages/broiler/harvestEvent/AddHarvestEvent";
import ProcessingBatch from "../pages/broiler/processingBatch/ProcessingBatch";
import AddProcessingBatch from "../pages/broiler/processingBatch/AddProcessingBatch";
import SlaughterLog from "../pages/broiler/slaughterLog/SlaughterLog";
import AddSlaughterLog from "../pages/broiler/slaughterLog/AddSlaughterLog";
import CutupYield from "../pages/broiler/cutupYield/CutupYield";
import AddCutupYield from "../pages/broiler/cutupYield/AddCutupYield";
import Byproducts from "../pages/broiler/byProduct/Byproducts";
import AddByproducts from "../pages/broiler/byProduct/AddByproducts";
import Wastes from "../pages/broiler/waste/Wastes";
import AddWaste from "../pages/broiler/waste/AddWaste";

export const BroilerRoutes = (
  <>
    <Route path="/dashboard/flock" element={<List Component={Flock} path="/dashboard/flock/new" />} />
    <Route path="/dashboard/flock/new" element={<AddNewFlock />} />
    <Route path="/dashboard/flock/:id" element={<AddNewFlock />} />

    <Route path="/dashboard/broiler-log" element={<List Component={DailyBroilerLog} path="/dashboard/broiler-log/new" />} />
    <Route path="/dashboard/broiler-log/new" element={<AddDailyBroilerLog />} />
    <Route path="/dashboard/broiler-log/:id" element={<AddDailyBroilerLog />} />

    <Route path="/dashboard/weight-sample" element={<List Component={WeightSamples} path="/dashboard/weight-sample/new" />} />
    <Route path="/dashboard/weight-sample/new" element={<AddWeightSample />} />
    <Route path="/dashboard/weight-sample/:id" element={<AddWeightSample />} />

    <Route path="/dashboard/broiler-vaccination-log" element={<List Component={VaccinationLog} path="/dashboard/broiler-vaccination-log/new" />} />
    <Route path="/dashboard/broiler-vaccination-log/new" element={<AddVaccinationLog />} />
    <Route path="/dashboard/broiler-vaccination-log/:id" element={<AddVaccinationLog />} />

    <Route path="/dashboard/broiler-medication-log" element={<List Component={MedicationLogs} path="/dashboard/broiler-medication-log/new" />} />
    <Route path="/dashboard/broiler-medication-log/new" element={<AddMedicationLogs />} />
    <Route path="/dashboard/broiler-medication-log/:id" element={<AddMedicationLogs />} />

    <Route path="/dashboard/thinning-event" element={<List Component={ThinningEvents} path="/dashboard/thinning-event/new" />} />
    <Route path="/dashboard/thinning-event/new" element={<AddThinningEvent />} />
    <Route path="/dashboard/thinning-event/:id" element={<AddThinningEvent />} />

    <Route path="/dashboard/harvest-event" element={<List Component={HarvestEvents} path="/dashboard/harvest-event/new" />} />
    <Route path="/dashboard/harvest-event/new" element={<AddHarvestEvent />} />
    <Route path="/dashboard/harvest-event/:id" element={<AddHarvestEvent />} />

    <Route path="/dashboard/processing-batch" element={<List Component={ProcessingBatch} path="/dashboard/processing-batch/new" />} />
    <Route path="/dashboard/processing-batch/new" element={<AddProcessingBatch />} />
    <Route path="/dashboard/processing-batch/:id" element={<AddProcessingBatch />} />

    <Route path="/dashboard/slaughter-logs" element={<List Component={SlaughterLog} path="/dashboard/slaughter-log/new" />} />
    <Route path="/dashboard/slaughter-log/new" element={<AddSlaughterLog />} />
    <Route path="/dashboard/slaughter-log/:id" element={<AddSlaughterLog />} />

    <Route path="/dashboard/cutup-yields" element={<List Component={CutupYield} path="/dashboard/cutup-yield/new" />} />
    <Route path="/dashboard/cutup-yield/new" element={<AddCutupYield />} />
    <Route path="/dashboard/cutup-yield/:id" element={<AddCutupYield />} />

    <Route path="/dashboard/by-products" element={<List Component={Byproducts} path="/dashboard/by-product/new" />} />
    <Route path="/dashboard/by-product/new" element={<AddByproducts />} />
    <Route path="/dashboard/by-product/:id" element={<AddByproducts />} />

    <Route path="/dashboard/wastes" element={<List Component={Wastes} path="/dashboard/waste/new" />} />
    <Route path="/dashboard/waste/new" element={<AddWaste />} />
    <Route path="/dashboard/waste/:id" element={<AddWaste />} />
  </>
);
