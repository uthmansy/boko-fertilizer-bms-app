import { Route, Routes } from "react-router-dom";
import LogisticsSingleTruck from "./LogisticsSingleTruck";
import LogisticsTransitList from "./LogisticsTransitList";
import { useEffect, useState } from "react";
import { getTrucksWithFilter } from "../../util/crud";
import ContentLoader from "../../components/ContentLoader";

export default function LogisticsTransit() {
	const [trucks, setTrucks] = useState(null);
	const [isLoadingTrucks, setIsLoadingTrucks] = useState(true);

	//fetch transit trucks in use effect
	useEffect(() => {
		const getTrucks = async () => {
			const trucks = await getTrucksWithFilter("status", "transit");
			setTrucks(trucks);
			setIsLoadingTrucks(false);
		};
		getTrucks();
	}, []);

	return isLoadingTrucks ? (
		<div className="h-screen">
			<ContentLoader />
		</div>
	) : (
		<div>
			<Routes>
				<Route
					exact
					path="/*"
					element={<LogisticsTransitList trucks={trucks} />}
				/>
				<Route path="/truck/:id" element={<LogisticsSingleTruck />} />
			</Routes>
		</div>
	);
}
