import InfoAlert from "../../components/alerts/InfoAlert";
import DefaultTable from "../../components/tables/DefaultTable";
import { formatTimestamp } from "../../util/functions";

export default function LogisticsTransitList({ trucks }) {
	//render a table of trucks or an info saying no trucks based on trucks prop
	const trucksHeader = [
		"Truck Number",
		"Origin",
		"Destination",
		"Waybill Number",
		"Date Loaded",
	];

	const tableTrucks = trucks.map((truck) => {
		// Extract only the desired key-value pairs
		const { truckNumber, origin, destination, waybillNumber, dateLoaded } =
			truck;

		// Create a new object with the extracted key-value pairs
		return {
			truckNumber,
			origin,
			destination,
			waybillNumber,
			dateLoaded: formatTimestamp(dateLoaded),
		};
	});

	return tableTrucks.length != 0 ? (
		<DefaultTable tableHeader={trucksHeader} tableData={tableTrucks} />
	) : (
		<InfoAlert>There are currently no Trucks on Transit, Thank You!</InfoAlert>
	);
}
