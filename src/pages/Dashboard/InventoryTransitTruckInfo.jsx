import { useEffect } from "react";

export default function InventoryTransitTruckInfo({ truck }) {
	const {
		item,
		truckNumber,
		waybillNumber,
		qtyBagsDispatched,
		qtyMtsDispatched,
		origin,
		destination,
		transportFee,
		transportFeePaid,
		transportFeeBalance,
	} = truck;

	const truckInfo = {
		"Item Carried": item,
		"Truck Number": truckNumber,
		"Waybill Number": waybillNumber,
		"No of Bags": qtyBagsDispatched,
		"Metric Tons": qtyMtsDispatched,
		Origin: origin,
		Destination: destination,
		"Transport Fee": transportFee,
		"Transport Fee Paid": transportFeePaid,
		"Transport Fee Balance": transportFeeBalance,
	};
	const dataEntries = Object.entries(truckInfo);
	return (
		<div>
			<h2 className="text-lg font-semibold text-gray-700 capitalize dark:text-white mb-5">
				truck info
			</h2>
			<div className="relative overflow-x-auto border">
				<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
					<tbody>
						{dataEntries.map(([key, value]) => (
							<tr className="border-b border-gray-200 dark:border-gray-700">
								<td
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
									key={key}>
									{key}
								</td>
								<td class="px-6 py-4" key={key}>
									{value}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
