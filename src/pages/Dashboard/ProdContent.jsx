import { Route, Routes } from "react-router-dom";
import ProdRequests from "./ProdRequests";
import ProdSubmissions from "./ProdSubmissions";
import ProdSummary from "./ProdSummary";
import ProductionRuns from "./ProductionRuns";

export default function ProdContent() {
  return (
    <div>
      <Routes>
        <Route exact path='/*' element={<ProdSummary />} />
        <Route path='/requests/*' element={<ProdRequests />} />
        <Route path='/production-runs/*' element={<ProductionRuns />} />
        <Route path='/submissions/*' element={<ProdSubmissions />} />
      </Routes>
    </div>
  );
}
