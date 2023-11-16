import { Route, Routes } from "react-router-dom";
import ProductSubmissionForm from "../../components/ProductSubmissionForm";
import ProductSubmissionNavBar from "../../components/ProductSubmissionNavBar";
import ProductSubmissionList from "../../components/ProductSubmissionList";

export default function ProdSubmissions() {
	return (
		<div>
			<ProductSubmissionNavBar />
			<Routes>
				<Route path="/" element={<ProductSubmissionForm />} />
				<Route path="/all" element={<ProductSubmissionList />} />
			</Routes>
		</div>
	);
}
