import { Route, Routes } from "react-router-dom";
import ProdProductionRuns from "./prodProductionRuns";
import ProdRequests from "./ProdRequests";
import ProdSubmissions from "./ProdSubmissions";
import ProdSummary from "./ProdSummary";

export default function ProdContent() {
	return (
		<div>
			<Routes>
				<Route exact path="/*" element={<ProdSummary />} />
				<Route path="/requests/*" element={<ProdRequests />} />
				<Route path="/production-runs/*" element={<ProdProductionRuns />} />
				<Route path="/submissions/*" element={<ProdSubmissions />} />
			</Routes>
		</div>
	);
}
