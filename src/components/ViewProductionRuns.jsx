import React, { useState, useEffect } from "react";
import { getAllProductionRuns } from "../util/crud";

function ViewProductionRuns() {
	const [productionRuns, setProductionRuns] = useState([]);

	useEffect(() => {
		async function fetchProductionRuns() {
			try {
				const runs = await getAllProductionRuns();
				setProductionRuns(runs);
				console.log(runs);
			} catch (error) {
				console.error("Error fetching production runs:", error);
			}
		}

		fetchProductionRuns();
	}, []);

	return (
		<div>
			<h1 className="text-xl font-bold mt-5">All Production Runs</h1>
			<ProductionRunsTable productionRuns={productionRuns} />
		</div>
	);
}

function ProductionRunsTable({ productionRuns }) {
	// State for date range filter
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	// State for pagination
	const [currentPage, setCurrentPage] = useState(1);
	const rowsPerPage = 5; // Number of rows per page

	// Filter production runs based on date range
	const filteredRuns = productionRuns.filter(
		(run) =>
			(!startDate || run.date >= startDate) && (!endDate || run.date <= endDate)
	);

	// Calculate the total number of pages
	const totalPages = Math.ceil(filteredRuns.length / rowsPerPage);

	// Get the current page of data
	const currentRuns = filteredRuns.slice(
		(currentPage - 1) * rowsPerPage,
		currentPage * rowsPerPage
	);

	return (
		<div>
			{/* Filter Table */}
			<div className="flex flex-col lg:flex-row justify-between bg-gray-100 p-4 rounded-md mb-4">
				<div className="mb-4 lg:mb-0">
					<label className="block mb-2 font-bold text-gray-700">
						Start Date:
					</label>
					<input
						type="date"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
						className="w-full p-2 border rounded-md"
					/>
				</div>
				<div className="mb-4 lg:mb-0">
					<label className="block mb-2 font-bold text-gray-700">
						End Date:
					</label>
					<input
						type="date"
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
						className="w-full p-2 border rounded-md"
					/>
				</div>
			</div>

			{/* Production Runs Table */}
			<table className="min-w-full bg-white shadow-md rounded my-6">
				<thead>
					<tr className="bg-indigo-500 text-white">
						<th className="py-2 px-4">Date</th>
						<th className="py-2 px-4">Finished Product</th>
						<th className="py-2 px-4">Quantity Produced</th>
						<th className="py-2 px-4">Raw Materials Used</th>
						<th className="py-2 px-4">Runner Name</th>
					</tr>
				</thead>
				<tbody>
					{currentRuns.map((run) => (
						<tr key={run.id} className="border-b border-gray-200">
							<td className="py-2 px-4">{run.date}</td>
							<td className="py-2 px-4">{run.finishedProduct}</td>
							<td className="py-2 px-4">{run.quantityProduced}</td>
							<td className="py-2 px-4">
								<ul>
									{run.rawMaterialsUsed.map((materialUsed, index) => (
										<li key={index} className="text-gray-600">
											{materialUsed.material}: {materialUsed.quantity}
										</li>
									))}
								</ul>
							</td>
							<td className="py-2 px-4">{run.runnerName}</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Pagination */}
			<div className="flex justify-between items-center">
				<button
					onClick={() => setCurrentPage(currentPage - 1)}
					disabled={currentPage === 1}
					className="px-4 py-2 text-white bg-indigo-500 rounded-md">
					Previous
				</button>
				<span>
					{" "}
					Page {currentPage} of {totalPages}{" "}
				</span>
				<button
					onClick={() => setCurrentPage(currentPage + 1)}
					disabled={currentPage === totalPages}
					className="px-4 py-2 text-white bg-indigo-500 rounded-md">
					Next
				</button>
			</div>
		</div>
	);
}

export default ViewProductionRuns;
