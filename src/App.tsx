import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import DrawingList from "@/pages/drawings/DrawingList";
import UploadDrawing from "@/pages/drawings/UploadDrawing";
import NestingWorkbench from "@/pages/nesting/NestingWorkbench";
import NestingPlanDetail from "@/pages/nesting/NestingPlanDetail";
import SheetInventory from "@/pages/sheets/SheetInventory";
import RemnantManagement from "@/pages/sheets/RemnantManagement";
import Requisition from "@/pages/sheets/Requisition";
import CuttingMonitor from "@/pages/cutting/CuttingMonitor";
import CuttingParams from "@/pages/cutting/CuttingParams";
import CuttingRecords from "@/pages/cutting/CuttingRecords";
import SortingGuide from "@/pages/sorting/SortingGuide";
import SortingProgress from "@/pages/sorting/SortingProgress";
import DeburringRecords from "@/pages/deburring/DeburringRecords";
import Inspection from "@/pages/deburring/Inspection";
import WorkHours from "@/pages/billing/WorkHours";
import Settlement from "@/pages/billing/Settlement";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/drawings" element={<DrawingList />} />
          <Route path="/drawings/upload" element={<UploadDrawing />} />
          <Route path="/nesting" element={<NestingWorkbench />} />
          <Route path="/nesting/:id" element={<NestingPlanDetail />} />
          <Route path="/sheets" element={<SheetInventory />} />
          <Route path="/sheets/remnants" element={<RemnantManagement />} />
          <Route path="/sheets/requisition" element={<Requisition />} />
          <Route path="/cutting" element={<CuttingMonitor />} />
          <Route path="/cutting/params" element={<CuttingParams />} />
          <Route path="/cutting/records" element={<CuttingRecords />} />
          <Route path="/sorting" element={<SortingGuide />} />
          <Route path="/sorting/progress" element={<SortingProgress />} />
          <Route path="/deburring" element={<DeburringRecords />} />
          <Route path="/deburring/inspection" element={<Inspection />} />
          <Route path="/billing" element={<WorkHours />} />
          <Route path="/billing/settlement" element={<Settlement />} />
        </Route>
      </Routes>
    </Router>
  );
}
