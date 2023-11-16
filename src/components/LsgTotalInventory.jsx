import { useEffect, useState } from "react";
import { getItemTotalInventory } from "../util/crud";
import TotalInventoryTable from "./tables/TotalInventoryTabel";
import ContentLoader from "./ContentLoader";

export default function LsgTotalInventory({ refresh }) {
	const [tableData, setTableData] = useState(null);

	const tableHeader = ["BAGS", "Tons"];

	useEffect(() => {
		const getItem = async () => {
			setTableData(null);
			const dbItem = await getItemTotalInventory("LSG");
			setTableData([
				{
					totalReceived: "Total Received",
					bags: dbItem.received || 0,
					mts: ((dbItem.received || 0) * 50) / 1000,
				},
				{
					totalDispatched: "Total Dispatched",
					bags: dbItem.dispatched || 0,
					mts: ((dbItem.dispatched || 0) * 50) / 1000,
				},
				{
					totalDispatched: "Dispatched to Production",
					bags: dbItem.dispatchedToProduction || 0,
					mts: ((dbItem.dispatchedToProduction || 0) * 50) / 1000,
				},
				{
					balance: "Balance",
					bags: dbItem.balance || 0,
					mts: ((dbItem.balance || 0) * 50) / 1000,
				},
			]);
			console.log(dbItem);
		};
		getItem();
	}, [refresh]);

	return tableData ? (
		<div>
			<TotalInventoryTable
				item={"LSG"}
				tableHeader={tableHeader}
				tableData={tableData}
			/>
		</div>
	) : (
		<div className="h-48 bg-gray-200 border border-gray-300">
			<ContentLoader />
		</div>
	);
}
