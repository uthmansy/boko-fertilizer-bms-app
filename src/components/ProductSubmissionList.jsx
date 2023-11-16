import React from "react";
import { getProductSubmissions } from "../util/crud";
import { useState } from "react";
import { useEffect } from "react";
import Spinner from "./Spinner";
import Modal from "./Modal";

function ProductSubmissionList() {
	const [submissions, setSubmissions] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const [modalData, setModalData] = useState({
		isOpen: false,
		message: "",
		isError: false,
	});

	useEffect(() => {
		async function fetchProductionSubmissions() {
			setIsLoading(true);
			try {
				const submissions = await getProductSubmissions("all");
				setSubmissions(submissions);
			} catch (error) {
				console.error("Error fetching production submissions:", error);
				setModalData({
					isOpen: true,
					message: `Failed to Load Submission.`,
					isError: true,
				});
			}
			setIsLoading(false);
		}

		fetchProductionSubmissions();
	}, []);

	return (
		<div>
			<h1 className="text-xl font-bold mt-5">All Production Runs</h1>
			{isLoading ? (
				<div className="w-full h-20 flex items-center justify-center">
					<Spinner />
				</div>
			) : (
				<SubmissionsTable submissions={submissions} />
			)}
			{modalData.isOpen && (
				<Modal modalData={modalData} setModalData={setModalData} />
			)}
		</div>
	);
}

const SubmissionsTable = ({ submissions }) => {
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	// State for pagination
	const [currentPage, setCurrentPage] = useState(1);
	const rowsPerPage = 5; // Number of rows per page

	const filteredSubmissions = submissions.filter(
		(submission) =>
			(!startDate || submission.date >= startDate) &&
			(!endDate || submission.date <= endDate)
	);

	// Calculate the total number of pages
	const totalPages = Math.ceil(filteredSubmissions.length / rowsPerPage);

	// Get the current page of data
	const currentSubmissions = filteredSubmissions.slice(
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

			{/* submission Runs Table */}
			<table className="min-w-full bg-white shadow-md rounded my-6">
				<thead>
					<tr className="bg-indigo-500 text-white">
						<th className="py-2 px-4">Date</th>
						<th className="py-2 px-4">Product</th>
						<th className="py-2 px-4">Quantity</th>
						<th className="py-2 px-4">Submitter Name</th>
						<th className="py-2 px-4">Status</th>
					</tr>
				</thead>
				<tbody>
					{currentSubmissions.map((submission) => (
						<tr key={submission.id} className="border-b border-gray-200">
							<td className="py-2 px-4">{submission.date}</td>
							<td className="py-2 px-4">{submission.productType}</td>
							<td className="py-2 px-4">{submission.quantity} bags</td>
							<td className="py-2 px-4">{submission.submitterName}</td>
							<td className="py-2 px-4">
								{submission.status === "pending" ? (
									<span className="bg-yellow-400 rounded-full text-xs p-2">
										pending
									</span>
								) : (
									<span className="bg-green-400 rounded-full text-xs p-2">
										approved
									</span>
								)}
							</td>
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
};

export default ProductSubmissionList;
