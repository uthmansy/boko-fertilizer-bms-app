import { useEffect, useState } from "react";
import {
	bagsToMetricTonnes,
	getDateTimestamp,
	moneyStringToNumber,
} from "../util/functions";
import { useAuth } from "../contexts/authContext";
import { receiveTruck, updateInventoryRecord } from "../util/crud";

export default function InventoryReceiveForm({
	truck,
	truckId,
	setReceivedTruck,
}) {
	const {
		qtyBagsDispatched,
		item,
		transportFeeNumericBalance,
		transportFeeBalance,
		destination,
	} = truck;

	const [qtyBagsReceived, setQtyBagsReceived] = useState();
	const [dateReceived, setDateReceived] = useState();
	const [qtyMtsReceived, setQtyMtsReceived] = useState();
	const [transportFeePaidOnReceived, setTransportFeePaidOnReceived] =
		useState("₦");
	const [transportFeeFinalBalance, setTransportFeeFinalBalance] =
		useState("₦0");
	const [transportFeeFinalBalanceNumeric, setTransportFeeFinalBalanceNumeric] =
		useState(transportFeeNumericBalance);
	const [shortage, setShortage] = useState(0);
	const [isReceiving, setIsReceiving] = useState(false);
	const [showTransportFees, setShowTransportFees] = useState(false);

	useEffect(() => {
		setShortage(parseInt(qtyBagsDispatched) - parseInt(qtyBagsReceived) || 0);
	}, [qtyBagsReceived]);

	const areAllFieldsFilled = () => {
		return qtyBagsReceived && qtyMtsReceived && !isReceiving && dateReceived;
	};

	const { user } = useAuth();

	useEffect(() => {
		setShowTransportFees(transportFeeNumericBalance != 0);
	}, [transportFeeNumericBalance]);

	useEffect(() => {
		const addCommas = (value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		const numericBalance =
			moneyStringToNumber(transportFeeBalance) -
			moneyStringToNumber(transportFeePaidOnReceived);
		setTransportFeeFinalBalanceNumeric(numericBalance);
		const stringBalance = numericBalance.toString();
		const formattedBalance = `₦${addCommas(stringBalance)}`;
		setTransportFeeFinalBalance(formattedBalance);
	}, [transportFeePaidOnReceived]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsReceiving(true);
		const receivedData = {
			qtyBagsReceived,
			qtyMtsReceived,
			dateReceived: getDateTimestamp(dateReceived),
			shortage,
			receivingOfficer: user.name,
			transportFeeFinalBalanceNumeric,
			transportFeeFinalBalance,
			transportFeePaidOnReceived,
			transportFeePaidStatus:
				transportFeeFinalBalanceNumeric == 0 ? "Fully Paid" : "Not Fully Paid",
		};
		try {
			//call a function to update received status of truck with reception info
			const updatedTruck = await receiveTruck(truckId, receivedData);
			if (destination === "Boko Fertilizer") {
				await updateInventoryRecord(item, "received", qtyBagsReceived);
			}
			setReceivedTruck(updatedTruck.data());
		} catch (error) {
			console.log(error);
			setIsReceiving(false);
		}
	};

	return (
		<div>
			<section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800">
				<h2 className="text-lg font-semibold text-gray-700 capitalize dark:text-white">
					Receive a Truck
				</h2>

				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
						<div>
							<label
								className="text-gray-700 dark:text-gray-200"
								for="username">
								Date Received
							</label>
							<input
								type="date"
								value={dateReceived}
								onChange={(e) => {
									setDateReceived(e.target.value);
								}}
								className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
							/>
						</div>
						<div>
							<label
								className="text-gray-700 dark:text-gray-200"
								for="username">
								Number Of Bags
							</label>
							<input
								type="text"
								value={qtyBagsReceived}
								onChange={(e) => {
									const input = e.target.value;
									const numericInput = input.replace(/[^0-9]/g, "");
									setQtyBagsReceived(numericInput);
									setQtyMtsReceived(bagsToMetricTonnes(numericInput));
								}}
								className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
							/>
						</div>
						<div>
							<label
								className="text-gray-700 dark:text-gray-200"
								for="username">
								Metric Tons
							</label>
							<input
								type="text"
								value={qtyMtsReceived}
								className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
							/>
						</div>
						<div>
							<label
								className="text-gray-700 dark:text-gray-200"
								for="username">
								Shortage
							</label>
							<input
								type="text"
								value={shortage}
								className="block w-full px-4 py-2 mt-2 text-red-700 bg-white border border-red-200 rounded-md dark:bg-red-800 dark:text-red-300 dark:border-red-600 focus:border-red-400 focus:ring-red-300 focus:ring-opacity-40 dark:focus:border-red-300 focus:outline-none focus:ring"
							/>
						</div>
						{showTransportFees && (
							<div>
								<label
									className="text-gray-700 dark:text-gray-200"
									for="username">
									Received Transport Fee
								</label>
								<input
									type="text"
									value={transportFeePaidOnReceived}
									onChange={(e) => {
										const addCommas = (value) =>
											value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

										const input = e.target.value;
										const numericInput = input.replace(/[^0-9]/g, "");
										const formattedInput = `₦${addCommas(numericInput)}`;
										setTransportFeePaidOnReceived(formattedInput);
									}}
									className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
								/>
							</div>
						)}

						{showTransportFees && (
							<div>
								<label
									className="text-gray-700 dark:text-gray-200"
									for="username">
									Final Balance
								</label>
								<input
									type="text"
									value={transportFeeFinalBalance}
									onChange={(e) => {
										const addCommas = (value) =>
											value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

										const input = e.target.value;
										const numericInput = input.replace(/[^0-9]/g, "");
										const formattedInput = `₦${addCommas(numericInput)}`;
										setTransportFeeFinalBalance(formattedInput);
									}}
									className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
								/>
							</div>
						)}
					</div>

					<div className="flex justify-end mt-6">
						<button
							disabled={!areAllFieldsFilled()}
							className="disabled:bg-gray-400 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
							{isReceiving ? (
								<svg
									className="w-6 h-6 animate-spin text-gray-800 dark:text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 18 20">
									<path
										stroke="white"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="1.2"
										d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97"
									/>
								</svg>
							) : (
								"Receive"
							)}
						</button>
					</div>
				</form>
			</section>
		</div>
	);
}
