import { Route, Routes } from "react-router-dom";
import ProductionRunsNavBar from "../../components/ProductionRunsNavBar";
import CreateNewProductionRun from "../../components/CreateNewProductionRun";
import ViewProductionRuns from "../../components/ViewProductionRuns";

function ProductionRuns() {
  return (
    <div>
      <ProductionRunsNavBar />
      <Routes>
        <Route path='/' element={<CreateNewProductionRun />} />
        <Route path='/all-runs' element={<ViewProductionRuns />} />
      </Routes>
    </div>
  );
}

export { ProductionRuns as default };
