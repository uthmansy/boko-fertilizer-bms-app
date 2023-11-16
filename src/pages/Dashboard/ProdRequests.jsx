import { Route, Routes } from "react-router-dom";
import ProductionRequestsNavBar from "../../components/ProductionRequestsNavBar";
import RawMaterialRequestForm from "../../components/RawMaterialsRequestForm";
import ViewRawMaterialsRequests from "../../components/ViewRawMaterialsRequests";

export default function ProdRequests() {
	return (
		<div>
			<ProductionRequestsNavBar />
			<Routes>
				<Route path="/" element={<RawMaterialRequestForm />} />
				<Route path="/all" element={<ViewRawMaterialsRequests />} />
			</Routes>
		</div>
	);
}
