import { Route, Routes } from "react-router-dom";
import CreateNewProductionRun from "../../components/CreateNewProductionRun";
import ViewProductionRuns from "../../components/ViewProductionRuns";
import TopNavBar from "../../components/TopNavBar";

function ProductionRuns() {
  return (
    <div>
      <TopNavBar
        links={[
          {
            path: "/production-runs",
            title: "Create New",
          },
          {
            path: "/production-runs/all-runs",
            title: "All Production",
          },
        ]}
      />
      <Routes>
        <Route path='/*' element={<CreateNewProductionRun />} />
        <Route path='/all-runs/*' element={<ViewProductionRuns />} />
      </Routes>
    </div>
  );
}

export { ProductionRuns as default };
