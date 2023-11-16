import { Route, Routes } from "react-router-dom";
import ProdProductionRuns from "./prodProductionRuns";
import ProdSubmissions from "./ProdSubmissions";
import AccountingPurchases from "../../components/AccountingPurchases";
import AccountingSales from "../../components/AccountingSales";

export default function AccountingContent() {
	return (
		<div>
			<Routes>
				<Route exact path="/*" element={<AccountingPurchases />} />
				<Route path="/sales/*" element={<AccountingSales />} />
				<Route path="/production-runs/*" element={<ProdProductionRuns />} />
				<Route path="/submissions/*" element={<ProdSubmissions />} />
			</Routes>
		</div>
	);
}
