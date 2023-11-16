import React, { useEffect, useState } from "react";
import InventoryPendingReceptionTable from "./InventoryPendingReceptionTable";
import { getProductSubmissions } from "../util/crud";

const InventoryProductionPendingReception = () => {
	const [pendingReception, setPendingReception] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const removeReception = (submissionId) => {
		// Filter out the approved submission and update the state
		const updatedSubmissions = pendingReception.filter(
			(submission) => submission.id !== submissionId
		);
		setPendingReception(updatedSubmissions);
	};

	useEffect(() => {
		const fetchPendingReception = async () => {
			try {
				const pendingReception = await getProductSubmissions("pending");
				setPendingReception(pendingReception);
				setIsLoading(false);
			} catch (error) {
				setError(error);
				setIsLoading(false);
			}
		};

		fetchPendingReception();
	}, []);

	return (
		<div>
			<h2 className="text-2xl font-semibold mb-4">
				Inventory Production Receipt (Pending)
			</h2>
			{isLoading && <p>Loading...</p>}
			{error && <p>Error: {error.message}</p>}
			{!isLoading && !error && pendingReception.length === 0 && (
				<p>No pending submissions available.</p>
			)}
			{!isLoading && !error && pendingReception.length > 0 && (
				<InventoryPendingReceptionTable
					pendingReception={pendingReception}
					removeReception={removeReception}
				/> // Use the renamed component
			)}
		</div>
	);
};

export default InventoryProductionPendingReception;
