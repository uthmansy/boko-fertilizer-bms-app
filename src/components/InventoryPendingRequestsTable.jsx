import React, { useState } from "react";
import { approveProductionRequest } from "../util/crud";
import { useAuth } from "../contexts/authContext";

const InventoryPendingRequestsTable = ({ pendingRequests, removeRequest }) => {
	return (
		<div className="relative overflow-x-auto">
			<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						<th scope="col" className="px-6 py-3">
							Requester
						</th>
						<th scope="col" className="px-6 py-3">
							Status
						</th>
						<th scope="col" className="px-6 py-3">
							Quantity Requested
						</th>
						<th scope="col" className="px-6 py-3">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{pendingRequests.map((request) => (
						<RequestTableRow
							key={request.id}
							request={request}
							removeRequest={removeRequest}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
};

const RequestTableRow = ({ request, removeRequest }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [dialogVisible, setDialogVisible] = useState(false);
	const [dialogMessage, setDialogMessage] = useState("");
	const [disableApproveButton, setDisableApproveButton] = useState(false);

	const { user } = useAuth();

	const handleApproveClick = async () => {
		try {
			setDisableApproveButton(true);
			setIsLoading(true);
			await approveProductionRequest(request.id, user);
			setDialogMessage("Request approved successfully");
			setDialogVisible(true);
			removeRequest(request.id); // Call the removeRequest function to remove the approved request
		} catch (error) {
			setDialogMessage("Error approving request: " + error.message);
			setDialogVisible(true);
		} finally {
			setIsLoading(false);
			setDisableApproveButton(false);
		}
	};

	const closeDialog = () => {
		setDialogVisible(false);
	};

	return (
		<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
			<th
				scope="row"
				className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
				{request.requester}
			</th>
			<td className="px-6 py-4">{request.status}</td>
			<td className="px-6 py-4">
				{request.rawMaterials.map((material, index) => (
					<p key={index}>
						{material.material}: {material.quantity}
					</p>
				))}
			</td>
			<td className="px-6 py-4">
				<button
					onClick={handleApproveClick}
					disabled={disableApproveButton}
					className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none">
					{isLoading ? "Approving..." : "Approve"}
				</button>
			</td>
			{dialogVisible && (
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 shadow-md rounded-lg z-10">
					<p>{dialogMessage}</p>
					<button
						onClick={closeDialog}
						className="bg-blue-500 text-white px-2 py-1 mt-2">
						Close
					</button>
				</div>
			)}
		</tr>
	);
};

export default InventoryPendingRequestsTable;
