import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { AuthProvider } from "./contexts/authContext";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import { ItemsProvider } from "./contexts/itemsContext";

function App() {
	return (
		<AuthProvider>
			<ItemsProvider>
				<BrowserRouter>
					<main className="font-main bg-gray-200">
						<Routes>
							<Route
								path="/*"
								element={<PrivateRoute element={<Dashboard />} />}
							/>
							<Route path="/login" element={<Login />} />
						</Routes>
					</main>
				</BrowserRouter>
			</ItemsProvider>
		</AuthProvider>
	);
}

export default App;
