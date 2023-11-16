import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { getProductionRequests } from "../util/crud";
import { formatTimestamp } from "../util/functions";

const InventoryProductionRequests = () => {
	const [allRequests, setAllRequests] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchAllRequests = async () => {
			try {
				const requests = await getProductionRequests("all"); // You can specify the status you need
				setAllRequests(requests);
			} catch (error) {
				setError(error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAllRequests();
	}, []);

	return (
		<div>
			<h2 className="text-2xl font-semibold mb-4">All Production Requests</h2>
			{isLoading && <p>Loading...</p>}
			{error && <p>Error: {error.message}</p>}
			{!isLoading && !error && (
				<div className="relative overflow-x-auto">
					<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border">
						<thead className="text-xs text-white uppercase bg-blue-500 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th scope="col" className="px-4 py-3 border-r text-center">
									SN
								</th>
								<th scope="col" className="px-6 py-3">
									Requester
								</th>
								<th scope="col" className="px-6 py-3">
									Status
								</th>
								<th scope="col" className="px-6 py-3">
									Date
								</th>
								<th scope="col" className="px-6 py-3">
									Quantity Requested
								</th>
							</tr>
						</thead>
						<tbody>
							{allRequests.map((request, index) => (
								<tr
									key={request.id}
									className={
										request.status === "approved"
											? "border-b dark:bg-gray-800 dark:border-gray-700"
											: "border-b dark:bg-gray-800 dark:border-gray-700"
									}>
									<th
										scope="row"
										className="px-4 text-center py-4 font-medium bg-gray-100 text-gray-900 whitespace-nowrap dark:text-white border-r">
										{index + 1}
									</th>
									<th
										scope="row"
										className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
										{request.requester}
									</th>
									<td className="px-6 py-4">
										{request.status === "approved" ? (
											<span className="bg-green-100 p-2 rounded-full leading-3">
												{request.status}
											</span>
										) : (
											<span className="bg-red-100 p-2 rounded-full leading-3">
												{request.status}
											</span>
										)}
									</td>
									<td className="px-6 py-4">
										{formatTimestamp(request.requestDate)}
									</td>
									<td className="px-6 py-4">
										{request.rawMaterials.map((material, index) => (
											<p key={index}>
												<span className="font-bold">{material.material}:</span>{" "}
												<span className="text-red-500">
													{material.quantity}
												</span>
											</p>
										))}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default InventoryProductionRequests;
