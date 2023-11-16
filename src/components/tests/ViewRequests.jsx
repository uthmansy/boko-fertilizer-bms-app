import React, { useState } from "react";
import { format } from "date-fns";
import ReactPaginate from "react-paginate";

const ViewRequests = () => {
	// Create more dummy data
	const dummyData = [];
	for (let i = 1; i <= 30; i++) {
		dummyData.push({
			requesterId: `user${i}`,
			status: i % 3 === 0 ? "approved" : i % 2 === 0 ? "rejected" : "pending",
			requestDate: new Date(2023, 0, i).toUTCString(),
			rawMaterials: [
				{ material: "MOP", quantity: i * 2 },
				{ material: "DAP", quantity: i * 3 },
			],
		});
	}

	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [filteredData, setFilteredData] = useState(dummyData);
	const [pageNumber, setPageNumber] = useState(0);
	const itemsPerPage = 10;

	const filterData = () => {
		const filtered = dummyData.filter((data) => {
			const requestDate = new Date(data.requestDate);
			const filterStartDate = startDate ? new Date(startDate) : null;
			const filterEndDate = endDate ? new Date(endDate) : null;

			if (
				(!filterStartDate || requestDate >= filterStartDate) &&
				(!filterEndDate || requestDate <= filterEndDate)
			) {
				return true;
			}
			return false;
		});

		setFilteredData(filtered);
		setPageNumber(0); // Reset page number when applying filters
	};

	const clearFilters = () => {
		setStartDate("");
		setEndDate("");
		setFilteredData(dummyData);
		setPageNumber(0); // Reset page number when clearing filters
	};

	const pageCount = Math.ceil(filteredData.length / itemsPerPage);
	const displayedData = filteredData.slice(
		pageNumber * itemsPerPage,
		(pageNumber + 1) * itemsPerPage
	);

	const handlePageClick = (data) => {
		setPageNumber(data.selected);
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return format(date, "dd/MM/yyyy");
	};

	return (
		<div className="max-w-screen-lg mx-auto p-4 bg-white rounded shadow-md">
			<h2 className="text-2xl font-semibold mb-4">View Requests</h2>

			<div className="mb-4">
				<label className="block text-sm font-semibold mb-2">
					Date Range Filter:
				</label>
				<div className="flex mb-2">
					<input
						type="date"
						className="w-1/2 p-2 border rounded-r-none focus:ring-blue-500 focus:border-blue-500"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
						placeholder="Start Date"
					/>
					<input
						type="date"
						className="w-1/2 p-2 border rounded-l-none focus:ring-blue-500 focus:border-blue-500"
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
						placeholder="End Date"
					/>
				</div>
				<button
					className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
					onClick={filterData}>
					Apply Filter
				</button>
				<button
					className="bg-red-500 text-white px-4 py-2 rounded hover-bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
					onClick={clearFilters}>
					Clear Filters
				</button>
			</div>

			<div className="overflow-x-auto">
				<table className="table-auto w-full">
					<thead className="bg-blue-500 text-white">
						<tr>
							<th className="px-4 py-2">Requester ID</th>
							<th className="px-4 py-2">Date Requested</th>
							<th className="px-4 py-2">Materials Requested</th>
							<th className="px-4 py-2">Status</th>
						</tr>
					</thead>
					<tbody>
						{displayedData.map((data, index) => (
							<tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
								<td className="px-4 py-2">{data.requesterId}</td>
								<td className="px-4 py-2">{formatDate(data.requestDate)}</td>
								<td className="px-4 py-2">
									<ul className="list-disc list-inside">
										{data.rawMaterials.map((material, mIndex) => (
											<li key={mIndex}>
												{material.quantity} bags of {material.material}
											</li>
										))}
									</ul>
								</td>
								<td className="px-4 py-2">{data.status}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="flex justify-center mt-4">
				<ReactPaginate
					previousLabel="Previous"
					nextLabel="Next"
					breakLabel="..."
					pageCount={pageCount}
					marginPagesDisplayed={2}
					pageRangeDisplayed={3}
					onPageChange={handlePageClick}
					containerClassName="pagination"
					pageClassName="page-item"
					pageLinkClassName="page-link"
					activeClassName="active"
					previousLinkClassName="page-link"
					nextLinkClassName="page-link"
				/>
			</div>
		</div>
	);
};

export default ViewRequests;
