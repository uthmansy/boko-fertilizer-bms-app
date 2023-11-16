import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import { format } from "date-fns";
import { getAllRequestsFromFirestore } from "../util/crud";
import Spinner from "./Spinner";
import { formatTimestamp } from "../util/functions";

const ViewRawMaterialRequests = () => {
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [requests, setRequests] = useState([]);
	const [filteredRequests, setFilteredRequests] = useState([]); // Initialize with all requests
	const [startDateFilter, setStartDateFilter] = useState("");
	const [endDateFilter, setEndDateFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [requestsPerPage] = useState(10);
	const [isFiltering, setIsFiltering] = useState(false);
	const [selectedRequest, setSelectedRequest] = useState(null);

	// Function to fetch requests from Firestore
	const fetchRequests = async () => {
		try {
			const fetchedRequests = await getAllRequestsFromFirestore();
			setRequests(fetchedRequests);
			setError(null);
			// Initialize filteredRequests with all requests
			setFilteredRequests(fetchedRequests);
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRequests();
	}, []); // This will run once when the component mounts

	// Function to apply filters
	const applyFilters = () => {
		let filtered = requests;

		if (startDateFilter) {
			filtered = filtered.filter(
				(request) => new Date(request.requestDate) >= new Date(startDateFilter)
			);
		}

		if (endDateFilter) {
			filtered = filtered.filter(
				(request) => new Date(request.requestDate) <= new Date(endDateFilter)
			);
		}

		if (statusFilter !== "all") {
			filtered = filtered.filter((request) => request.status === statusFilter);
		}

		setFilteredRequests(filtered);
		setCurrentPage(1);
		setIsFiltering(true);
	};

	// Function to remove filters
	const removeFilters = () => {
		setStartDateFilter("");
		setEndDateFilter("");
		setStatusFilter("all");
		setIsFiltering(false);
		// Reset filteredRequests to include all requests
		setFilteredRequests(requests);
		setCurrentPage(1);
	};

	// Handle date filter changes
	useEffect(() => {
		if (isFiltering) {
			applyFilters();
		}
	}, [startDateFilter, endDateFilter, statusFilter, requests, isFiltering]);

	// Function to view the summary of a request
	const viewSummary = (request) => {
		setSelectedRequest(request);
	};

	// Function to go back to the table view
	const goBack = () => {
		setSelectedRequest(null);
	};

	// Function to print the summary
	const printSummary = () => {
		window.print();
	};

	// Pagination
	const indexOfLastRequest = currentPage * requestsPerPage;
	const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
	const currentRequests = filteredRequests.slice(
		indexOfFirstRequest,
		indexOfLastRequest
	);

	return (
		<div className="max-w-screen-xl mx-auto p-4 bg-white rounded-lg shadow-md">
			<h2 className="text-2xl font-semibold mb-4">Raw Material Requests</h2>
			{!selectedRequest && ( // Hide filter area when viewing the summary
				<div className="mb-6 flex space-x-4">
					<div className="w-1/4">
						<label className="block text-sm font-medium text-gray-700">
							Start Date
						</label>
						<input
							type="date"
							className="mt-1 p-2 w-full border rounded-md"
							value={startDateFilter}
							onChange={(e) => setStartDateFilter(e.target.value)}
						/>
					</div>
					<div className="w-1/4">
						<label className="block text-sm font-medium text-gray-700">
							End Date
						</label>
						<input
							type="date"
							className="mt-1 p-2 w-full border rounded-md"
							value={endDateFilter}
							onChange={(e) => setEndDateFilter(e.target.value)}
						/>
					</div>
					<div className="w-1/4">
						<label className="block text-sm font-medium text-gray-700">
							Status
						</label>
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className="mt-1 p-2 w-full border rounded-md">
							<option value="all">All</option>
							<option value="pending">Pending</option>
							<option value="approved">Approved</option>
							<option value="rejected">Rejected</option>
						</select>
					</div>
					<div className="w-1/4 flex items-end">
						<button
							onClick={applyFilters}
							className="w-full py-2 bg-blue-500 text-white rounded-md hover-bg-blue-600 focus:outline-none">
							Apply Filters
						</button>
					</div>
				</div>
			)}
			{isFiltering && (
				<div className="mb-4">
					<button
						onClick={removeFilters}
						className="bg-red-500 text-white px-4 py-2 rounded-md">
						Remove Filters
					</button>
				</div>
			)}
			{loading && (
				<div className="h-20 w-full flex items-center justify-center">
					<Spinner />
				</div>
			)}
			{error && (
				<div className="text-center text-red-600">
					<p>Error: {error}</p>
					<button
						onClick={fetchRequests}
						className="py-2 bg-blue-500 text-white rounded-md hover-bg-blue-600 focus:outline-none">
						Refresh
					</button>
				</div>
			)}
			{selectedRequest ? (
				<div>
					{/* Display summary of the selected request */}
					<p className="text-2xl font-semibold mb-4">Request Summary</p>
					<div className="mb-4">
						<button
							onClick={goBack}
							className="bg-blue-500 text-white px-4 py-2 rounded-md">
							Go Back
						</button>
					</div>
					{/* Print button added to the summary section */}
					<div className="mb-4">
						<button
							onClick={printSummary}
							className="bg-green-500 text-white px-4 py-2 rounded-md">
							Print Summary
						</button>
					</div>
					{/* Display the summary of the selected request here */}
					<div className="bg-gray-100 p-4 rounded-md">
						<p>Requester: {selectedRequest.requester}</p>
						<p>Request Date: {formatTimestamp(selectedRequest.requestDate)}</p>
						<p>Status: {selectedRequest.status}</p>
						<p>Raw Materials Requested:</p>
						<ul>
							{selectedRequest.rawMaterials.map((material, index) => (
								<li key={index}>
									{material.material}: {material.quantity}
								</li>
							))}
						</ul>
					</div>
				</div>
			) : (
				<div>
					{currentRequests.length > 0 ? (
						<div>
							<table className="min-w-full divide-y divide-gray-200">
								<thead>
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Requester
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Request Date
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Status
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Quantity Requested
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{currentRequests.map((request, index) => (
										<tr
											key={index}
											className={index % 2 === 0 ? "bg-gray-50" : ""}>
											<td className="px-6 py-2 text-sm whitespace-nowrap">
												{request.requester}
											</td>
											<td className="px-6 py-2 text-sm whitespace-nowrap">
												{formatTimestamp(request.requestDate)}
											</td>
											<td className="px-6 py-2 text-sm whitespace-nowrap">
												{request.status === "pending" ? (
													<span className="bg-yellow-400 text-white px-3 py-2 text-xs rounded-full">
														{request.status}
													</span>
												) : request.status === "approved" ? (
													<span className="bg-green-400 text-white rounded-full text-xs inline-block py-2 px-3">
														{request.status}
													</span>
												) : (
													<span className="bg-red-400 text-white rounded-full text-xs inline-block py-2 px-3">
														{request.status}
													</span>
												)}
											</td>
											<td className="px-6 py-2 text-sm whitespace-nowrap">
												{request.rawMaterials.map((material, index) => (
													<p key={index}>
														{material.material}: {material.quantity}
													</p>
												))}
											</td>
											<td className="px-6 py-2 text-sm whitespace-nowrap">
												<button
													onClick={() => viewSummary(request)}
													className="py-2 px-2 bg-blue-500 text-white rounded-md hover-bg-blue-600 focus:outline-none">
													View Summary
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
							<div className="mt-4">
								<ul className="flex space-x-2">
									{Array.from(
										{
											length: Math.ceil(
												filteredRequests.length / requestsPerPage
											),
										},
										(_, i) => (
											<li key={i}>
												<button
													onClick={() => setCurrentPage(i + 1)}
													className={`${
														i + 1 === currentPage
															? "bg-blue-500 text-white px-3 py-1 rounded-full"
															: "bg-gray-300 text-gray-600 px-3 py-1 rounded-full"
													}`}>
													{i + 1}
												</button>
											</li>
										)
									)}
								</ul>
							</div>
						</div>
					) : (
						<p className="text-center text-gray-500">
							No requests match the selected filters.
						</p>
					)}
				</div>
			)}
		</div>
	);
};

export default ViewRawMaterialRequests;
