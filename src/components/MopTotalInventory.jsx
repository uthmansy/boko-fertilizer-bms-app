import { useEffect, useState } from "react";
import { getItemTotalInventory } from "../util/crud";
import TotalInventoryTable from "./tables/TotalInventoryTabel";
import ContentLoader from "./ContentLoader";

export default function MopTotalInventory({ refresh }) {
	const [tableData, setTableData] = useState(null);

	const tableHeader = ["BAGS", "Tons"];

	useEffect(() => {
		setTableData(null);
		const getItem = async () => {
			const dbItem = await getItemTotalInventory("MOP");
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
		};
		getItem();
	}, [refresh]);

	return tableData ? (
		<div>
			<TotalInventoryTable
				item={"MOP"}
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
