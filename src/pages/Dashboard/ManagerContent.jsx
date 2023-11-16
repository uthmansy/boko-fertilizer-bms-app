import { Route, Routes } from "react-router-dom";
import { ManagerProduction } from "../../components/ManagerProduction";

export default function ManagerContent() {
	return (
		<div>
			<Routes>
				<Route exact path="/*" element={<ManagerProduction />} />
				<Route path="/inventory/*" element={<div>Inventory department</div>} />
				<Route path="/logistics/*" element={<div>logistics department</div>} />
			</Routes>
		</div>
	);
}
