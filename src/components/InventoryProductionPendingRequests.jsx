import React, { useEffect, useState } from "react";
import InventoryPendingRequestsTable from "./InventoryPendingRequestsTable";
import { getProductionRequests } from "../util/crud";
import InfoAlert from "./alerts/InfoAlert";
import Spinner from "./Spinner";

const InventoryProductionPendingRequests = () => {
	const [pendingRequests, setPendingRequests] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const removeRequest = (requestId) => {
		// Filter out the approved request and update the state
		const updatedRequests = pendingRequests.filter(
			(request) => request.id !== requestId
		);
		setPendingRequests(updatedRequests);
	};

	useEffect(() => {
		const fetchPendingRequests = async () => {
			try {
				const pendingRequests = await getProductionRequests("pending");
				setPendingRequests(pendingRequests);
				setIsLoading(false);
			} catch (error) {
				setError(error);
				setIsLoading(false);
			}
		};

		fetchPendingRequests();
	}, []);

	return (
		<div>
			<h2 className="text-2xl font-semibold mb-4">Pending Requests</h2>
			{isLoading && (
				<div className="flex h-20 w-full items-center justify-center">
					<Spinner />
				</div>
			)}
			{error && <p>Error: {error.message}</p>}
			{!isLoading && !error && pendingRequests.length === 0 && (
				<InfoAlert>No pending requests available.</InfoAlert>
			)}
			{!isLoading && !error && pendingRequests.length > 0 && (
				<InventoryPendingRequestsTable
					pendingRequests={pendingRequests}
					removeRequest={removeRequest}
				/> // Use the renamed component
			)}
		</div>
	);
};

export default InventoryProductionPendingRequests;
