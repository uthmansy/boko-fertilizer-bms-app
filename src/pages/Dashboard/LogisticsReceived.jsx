import { useEffect, useState } from "react";
import { getTrucksWithFilter } from "../../util/crud";
import InventoryReceivedList from "./InventoryReceivedList";
import ContentLoader from "../../components/ContentLoader";

export default function LogisticsReceived() {
	const [trucks, setTrucks] = useState(null);
	const [isLoadingTrucks, setIsLoadingTrucks] = useState(true);

	//fetch Received trucks in use effect
	useEffect(() => {
		const getTrucks = async () => {
			const trucks = await getTrucksWithFilter("status", "received");
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
			<InventoryReceivedList trucks={trucks} />
		</div>
	);
}
