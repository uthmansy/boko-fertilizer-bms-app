import { Link, Route, Routes, useParams } from "react-router-dom";
import TopNavBar from "./TopNavBar";
import { useState } from "react";
import { useItems } from "../contexts/itemsContext";
import { useEffect } from "react";
import {
	disableArrowKeys,
	disableScroll,
	formatMoney,
	generateTransactionOrderNumber,
	moneyStringToNumber,
} from "../util/functions";
import Modal from "./Modal";
import {
	createTransaction,
	getLastTransactionSequence,
	getTransactionById,
	getTransactions,
} from "../util/crud";
import { useAuth } from "../contexts/authContext";
import Spinner from "./Spinner";
import RefreshButton from "./RefreshButton";
import BackButton from "./BackButton";
import InfoAlert from "./alerts/InfoAlert";
import AddPaymentForm from "./AddPaymentForm";

const AccountingSales = () => {
	return (
		<div>
			<TopNavBar
				links={[
					{
						path: "/sales",
						title: "Create New",
					},
					{
						path: "/sales/all",
						title: "All Sales",
					},
				]}
			/>
			<Routes>
				<Route exact path="/*" element={<CreateNew />} />
				<Route exact path="/all/*" element={<AllSales />} />
			</Routes>
		</div>
	);
};

const CreateNew = () => {
	const [formData, setFormData] = useState({
		buyerName: "",
		buyerPhone: "",
		itemsSold: [{ itemId: "", quantity: 0, taken: 0 }],
		totalCost: "",
		date: "",
	});
	const [formIsValid, setFormIsValid] = useState(false);
	const [modalData, setModalData] = useState({
		isOpen: false,
		message: "",
		isError: false,
	});
	const [isLoading, setIsLoading] = useState(false);

	const checkFormValidity = () => {
		const isBuyerName = formData.buyerName.trim() !== "";
		const isBuyerPhone = formData.buyerPhone.trim() !== "";
		const isTotalCostValid = formData.totalCost.trim() !== "";
		const isDateValid = formData.date !== "";
		const isItemsSoldValid = formData.itemsSold.every(
			(item) => item.itemId && item.quantity > 0 && isDateValid
		);

		setFormIsValid(
			isBuyerName && isBuyerPhone && isItemsSoldValid && isTotalCostValid
		);
	};

	useEffect(() => {
		checkFormValidity();
	}, [formData]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
		checkFormValidity();
	};

	const handleDateChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
		checkFormValidity();
	};

	const handleItemChange = (index, field, value) => {
		const itemsSold = [...formData.itemsSold];
		itemsSold[index][field] = value;
		setFormData({
			...formData,
			itemsSold,
		});
		checkFormValidity();
	};

	const handleTotalCostChange = (e) => {
		const { value } = e.target;
		const formattedValue = formatMoney(value);

		setFormData({
			...formData,
			totalCost: formattedValue,
		});
		checkFormValidity();
	};

	const addItem = () => {
		setFormData({
			...formData,
			itemsSold: [...formData.itemsSold, { itemId: "", quantity: 0, taken: 0 }],
		});
		checkFormValidity(); // Trigger form validation check
	};

	const removeItem = (index) => {
		const itemsSold = [...formData.itemsSold];
		itemsSold.splice(index, 1);
		setFormData({
			...formData,
			itemsSold,
		});
		checkFormValidity(); // Trigger form validation check
	};

	const { user } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const lastSequenceNumber = await getLastTransactionSequence("sale");
			const { buyerName, buyerPhone, itemsSold, totalCost, date } = formData;
			const payload = {
				beneficiaryName: "Boko Fertilizer",
				beneficiaryPhone: "08169669906",
				buyerName,
				buyerPhone,
				itemsSold,
				totalCost: moneyStringToNumber(totalCost),
				date,
				createdBy: user.name,
				type: "sale",
				numericCost: moneyStringToNumber(formData.totalCost),
				payments: [],
				status: "unfulfilled",
				totalPaid: 0,
				sequenceNumber: lastSequenceNumber + 1,
				orderNumber: generateTransactionOrderNumber(
					lastSequenceNumber + 1,
					"sale"
				),
			};
			await createTransaction(payload);
			setModalData({
				isOpen: true,
				message: `Sale Created Successfully`,
				isError: false,
			});
		} catch (error) {
			setModalData({
				isOpen: true,
				message: error.message,
				isError: true,
			});
		}
		setIsLoading(false);
		setFormData({
			buyerName: "",
			buyerPhone: "",
			itemsSold: [{ itemId: "", quantity: 0 }],
			totalCost: "",
			date: "",
		});
	};

	const { items } = useItems();

	const renderSelect = (item, index) => (
		<div key={index} className="mb-4 p-4 border rounded-lg">
			<select
				name="itemId"
				value={item.itemId}
				onChange={(e) => handleItemChange(index, "itemId", e.target.value)}
				className="w-full p-2 border rounded">
				<option value="">Select an item</option>
				{items.map((item, index) => (
					<option key={index} value={item.name}>
						{item.name}
					</option>
				))}
			</select>
			<label className="mt-2 block">Quantity (bags):</label>
			<input
				type="number"
				name="quantity"
				value={item.quantity}
				onKeyDown={disableArrowKeys}
				onWheel={disableScroll}
				onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
				className="w-full p-2 border rounded"
			/>
			<button
				type="button"
				onClick={() => removeItem(index)}
				className="mt-2 p-2 bg-red-500 text-white rounded hover:bg-red-600">
				Remove
			</button>
		</div>
	);

	return (
		<div className="p-4 mx-auto bg-white shadow-lg rounded-lg w-full">
			<h2 className="text-2xl mb-4 font-bold">Create a Sale</h2>
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label className="block mb-2">Date:</label>
					<input
						type="date"
						name="date"
						value={formData.date}
						onChange={handleDateChange}
						className="w-full p-2 border rounded"
					/>
				</div>
				<div className="mb-4">
					<label className="block mb-2">Buyer Name:</label>
					<input
						type="text"
						name="buyerName"
						value={formData.buyerName}
						onChange={handleInputChange}
						className="w-full p-2 border rounded"
					/>
				</div>
				<div className="mb-4">
					<label className="block mb-2">Buyer Phone:</label>
					<input
						type="number"
						name="buyerPhone"
						onKeyDown={disableArrowKeys}
						onWheel={disableScroll}
						value={formData.buyerPhone}
						onChange={handleInputChange}
						className="w-full p-2 border rounded"
					/>
				</div>
				<div className="mb-4">
					<label className="block mb-2">Items Sold:</label>
					{formData.itemsSold.map((item, index) => renderSelect(item, index))}
					<button
						type="button"
						onClick={addItem}
						className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
						Add Item
					</button>
				</div>
				<div className="mb-4">
					<label className="block mb-2">Total Cost (₦):</label>
					<input
						type="text"
						name="totalCost"
						value={formData.totalCost}
						onChange={handleTotalCostChange}
						className="w-full p-2 border rounded"
					/>
				</div>
				<button
					type="submit"
					disabled={!formIsValid || isLoading}
					className=" px-4 p-2 bg-green-500 disabled:bg-gray-300 text-white rounded hover-bg-green-600">
					{isLoading ? "Loading..." : "Create Sale"}
				</button>
			</form>
			{modalData.isOpen && (
				<Modal modalData={modalData} setModalData={setModalData} />
			)}
		</div>
	);
};

const AllSales = () => {
	const [sales, setSales] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [refresh, setRefresh] = useState(0);

	useEffect(() => {
		try {
			const fetchAllSales = async () => {
				setIsLoading(true);
				const result = await getTransactions("sale");
				setSales(result);
				setIsLoading(false);
			};
			fetchAllSales();
		} catch (error) {}
	}, [refresh]);

	return isLoading ? (
		<div className="h-20 w-full flex items-center justify-center">
			<Spinner />
		</div>
	) : sales.length === 0 ? (
		<InfoAlert>There are Currently no Sales</InfoAlert>
	) : (
		<Routes>
			<Route
				exact
				path="/"
				element={
					<div className="container mx-auto bg-white p-4 shadow-md rounded-md">
						<RefreshButton refresh={refresh} setRefresh={setRefresh} />
						<h1 className="text-2xl font-bold mb-3 mt-3">
							Sales Transaction List
						</h1>
						<table className="w-full border-collapse border rounded-lg text-sm">
							<thead>
								<tr>
									<th className="p-3 bg-gray-100 text-center">SN</th>
									<th className="p-3 text-left bg-gray-100">Buyer</th>
									<th className="p-3 text-left bg-gray-100">Amount</th>
									<th className="p-3 text-left bg-gray-100">Status</th>
									<th className="p-3 text-left bg-gray-100">Items Sold</th>
									<th className="p-3 text-left bg-gray-100">Action</th>
								</tr>
							</thead>
							<tbody>
								{sales.map((sale, index) => (
									<tr key={sale.id} className="hover:bg-gray-100 border-b">
										<td className="p-3 border-r text-center">{index + 1}</td>
										<td className="p-3">{sale.buyerName}</td>
										<td className="p-3">{formatMoney(sale.totalCost)}</td>
										<td className="p-3">{sale.status}</td>
										<td className="p-3 border-r border-l">
											<ul className="list-style-none">
												{sale.itemsSold.map((item, index) => (
													<li className="flex" key={index}>
														<span className="font-bold">{item.itemId}:</span>{" "}
														<span className="text-green-500 flex-grow text-right mr-5">
															{item.quantity} Bags
														</span>
													</li>
												))}
											</ul>
										</td>
										<td className="p-3">
											<Link
												to={`/sales/all/${sale.id}`}
												className="hover:underline bg-blue-500 p-2 px-3 text-white w-full inline-block text-center">
												View Details
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				}
			/>
			<Route exact path="/:transactionId" element={<TransactionSummary />} />
		</Routes>
	);
};

function TransactionSummary() {
	const [transaction, setTransaction] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [refresh, setRefresh] = useState(0);
	const [modalData, setModalData] = useState({
		isOpen: false,
		message: "",
		isError: false,
	});

	const { transactionId } = useParams();

	useEffect(() => {
		try {
			const fetchTransaction = async () => {
				setIsLoading(true);
				const result = await getTransactionById(transactionId);
				setTransaction(result);
				setIsLoading(false);
			};
			fetchTransaction();
		} catch (error) {}
	}, [refresh]);
	return isLoading ? (
		<div className="h-20 w-full flex items-center justify-center">
			<Spinner />
		</div>
	) : (
		<div className="overflow-hidden border border-gray-200 sm:rounded-lg container mx-auto p-4 bg-white rounded-md shadow-md">
			<div className="mb-5 flex space-x-2">
				<RefreshButton refresh={refresh} setRefresh={setRefresh} />
				<BackButton />
			</div>
			<h1 className="text-xl font-bold mb-4">Sale Transaction Summary</h1>
			<table className="min-w-full">
				<tbody className="bg-white divide-y divide-gray-200">
					<tr>
						<td className="px-6 py-4">
							<p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
								Date
							</p>
							<p>{transaction?.date}</p>
						</td>
					</tr>
					<tr>
						<td className="px-6 py-4">
							<p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
								Created By
							</p>
							<p>{transaction?.createdBy}</p>
						</td>
					</tr>
					<tr>
						<td className="px-6 py-4">
							<p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
								Order Number
							</p>
							<p>{transaction?.orderNumber}</p>
						</td>
					</tr>
					<tr>
						<td className="px-6 py-4">
							<p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
								Buyer
							</p>
							<p>{transaction?.buyerName}</p>
						</td>
					</tr>
					<tr>
						<td className="px-6 py-4">
							<p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
								Buyer Phone
							</p>
							<p>{transaction?.buyerPhone}</p>
						</td>
					</tr>
					<tr>
						<td className="px-6 py-4">
							<p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
								Items Sold
							</p>
							<ul>
								{transaction?.itemsSold.map((item, index) => (
									<li className=" flex max-w-md justify-between" key={index}>
										<span className="font-bold">{item.itemId}</span>
										<span className="font-bold text-green-500">{`Quantity: ${item.quantity}`}</span>
										<span className="font-bold text-blue-500">{`Quantity Taken: ${item.taken}`}</span>
										<span className="font-bold text-red-500">{`Balance: ${
											item.quantity - item.taken
										}`}</span>
									</li>
								))}
							</ul>
						</td>
					</tr>

					<tr>
						<td className="px-6 py-4">
							<p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
								Total Cost
							</p>
							<p>{formatMoney(transaction?.totalCost)}</p>
						</td>
					</tr>
					<tr>
						<td className="px-6 py-4">
							<p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
								Total Paid
							</p>
							<p>{formatMoney(transaction?.totalPaid)}</p>
						</td>
					</tr>
					<tr>
						<td className="px-6 py-4">
							<p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
								Balance
							</p>
							<p>
								{formatMoney(transaction?.totalCost - transaction?.totalPaid)}
							</p>
						</td>
					</tr>
					{transaction?.payments.length != 0 && (
						<tr>
							<td className="px-6 py-4">
								<p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
									Payments
								</p>
								<table className="w-full border-collapse border rounded-lg text-sm my-5 bg-green-50">
									<thead>
										<tr>
											<th className="p-3 bg-gray-500 text-white text-center">
												SN
											</th>
											<th className="p-3 bg-gray-500 text-white text-center">
												Date
											</th>
											<th className="p-3 text-left bg-gray-500 text-white">
												Beneficiary
											</th>
											<th className="p-3 text-left bg-gray-500 text-white">
												Account
											</th>
											<th className="p-3 text-left bg-gray-500 text-white">
												Bank
											</th>
											<th className="p-3 text-left bg-gray-500 text-white">
												Amount
											</th>
											<th className="p-3 text-left bg-gray-500 text-white">
												Payment Reference
											</th>
										</tr>
									</thead>
									<tbody>
										{transaction?.payments.map((payment, index) => (
											<tr
												key={payment.id}
												className="hover:bg-gray-100 border-b">
												<td className="p-3 border-r text-center">
													{index + 1}
												</td>
												<td className="p-3">{payment.date}</td>
												<td className="p-3">{payment.beneficiaryName}</td>
												<td className="p-3">{payment.beneficiaryAccount}</td>
												<td className="p-3">{payment.beneficiaryBank}</td>
												<td className="p-3">{formatMoney(payment.amount)}</td>
												<td className="p-3">{payment.paymentRef}</td>
											</tr>
										))}
									</tbody>
								</table>
							</td>
						</tr>
					)}
				</tbody>
			</table>
			{transaction?.status != "completed" && (
				<AddPaymentForm
					transactionId={transactionId}
					setModalData={setModalData}
				/>
			)}
			{modalData.isOpen && (
				<Modal
					modalData={modalData}
					setModalData={setModalData}
					onClose={() => setRefresh(refresh + 1)}
				/>
			)}
		</div>
	);
}

export default AccountingSales;
