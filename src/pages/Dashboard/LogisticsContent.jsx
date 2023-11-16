import { Route, Routes } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import LogisticsCreateDispatch from "./LogisticsCreateDispatch";
import LogisticsTransit from "./LogisticsTransit";
import LogisticsReceived from "./LogisticsReceived";

export default function LogisticsContent() {
	const { user } = useAuth();
	return (
		<div>
			<Routes>
				<Route exact path="/" element={<LogisticsCreateDispatch />} />
				<Route path="/transit/*" element={<LogisticsTransit />} />
				<Route path="/received" element={<LogisticsReceived />} />
			</Routes>
		</div>
	);
}
