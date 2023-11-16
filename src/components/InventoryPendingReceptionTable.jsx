import React, { useState } from "react";
import { approveProductReception } from "../util/crud";
import { useAuth } from "../contexts/authContext";
import Spinner from "./Spinner";

const InventoryPendingReceptionTable = ({
	pendingReception,
	removeReception,
}) => {
	return (
		<div className="relative overflow-x-auto">
			<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						<th scope="col" className="px-6 py-3">
							Date
						</th>
						<th scope="col" className="px-6 py-3">
							Submitter
						</th>
						<th scope="col" className="px-6 py-3">
							Status
						</th>
						<th scope="col" className="px-6 py-3">
							Quantity Submitted
						</th>
						<th scope="col" className="px-6 py-3">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{pendingReception.map((reception) => (
						<ReceptionTableRow
							key={reception.id}
							reception={reception}
							removeReception={removeReception}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
};

const ReceptionTableRow = ({ reception, removeReception }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [dialogVisible, setDialogVisible] = useState(false);
	const [dialogMessage, setDialogMessage] = useState("");
	const [disableApproveButton, setDisableApproveButton] = useState(false);

	const { user } = useAuth();

	const handleApproveClick = async () => {
		try {
			setDisableApproveButton(true);
			setIsLoading(true);
			await approveProductReception(
				reception.id,
				reception.productType,
				user.name
			);
			setDialogMessage("reception approved successfully");
			setDialogVisible(true);
			removeReception(reception.id); // Call the removeReception function to remove the approved reception
		} catch (error) {
			setDialogMessage("Error approving reception: " + error.message);
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
			<td className="px-6 py-4">{reception.date}</td>
			<td className="px-6 py-4">{reception.submitterName}</td>
			<td className="px-6 py-4">{reception.status}</td>
			<td className="px-6 py-4">{reception.quantity}</td>
			<td className="px-6 py-4">
				<button
					onClick={handleApproveClick}
					disabled={disableApproveButton}
					className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none">
					{isLoading ? <Spinner /> : "Approve"}
				</button>
			</td>
			{dialogVisible && (
				<div className="fixed top-0 left-0 right-0 bottom-0 h-screen w-full bg-black bg-opacity-50 z-20">
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 shadow-md rounded-lg z-10">
						<p>{dialogMessage}</p>
						<button
							onClick={closeDialog}
							className="bg-blue-500 text-white px-2 py-1 mt-2">
							Close
						</button>
					</div>
				</div>
			)}
		</tr>
	);
};

export default InventoryPendingReceptionTable;
