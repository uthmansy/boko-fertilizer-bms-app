import { Route, Routes } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

export default function AdminContent() {
	const { user } = useAuth();

	return (
		<div>
			<Routes>
				<Route exact path="/" element={<div>Home Page</div>} />
				<Route path="/about" element={<div>About Page</div>} />
				<Route path="/contact" element={<div>Contact Page</div>} />
			</Routes>
		</div>
	);
}
