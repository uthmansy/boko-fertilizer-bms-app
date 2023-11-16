import { useState } from "react";
import DapTotalInventory from "../../components/DapTotalInventory";
import GasTotalInventory from "../../components/GasTotalInventory";
import LsgTotalInventory from "../../components/LsgTotalInventory";
import MopTotalInventory from "../../components/MopTotalInventory";
import RefreshButton from "../../components/RefreshButton";
import UreaTotalInventory from "../../components/UreaTotalInventory";
import TopNavBar from "../../components/TopNavBar";
import { Route, Routes } from "react-router-dom";

export default function InventoryTotalInventory() {
	const [refresh, setRefresh] = useState(0);

	return (
		<div>
			<TopNavBar
				links={[
					{
						title: "Raw Materials",
						path: "/raw-materials",
					},
					{
						title: "Finished Products",
						path: "/products",
					},
				]}
			/>
			<div className="mb-5">
				<RefreshButton refresh={refresh} setRefresh={setRefresh} />
			</div>
			<Routes>
				<Route exact path="/*" element={<RawMaterials refresh={refresh} />} />
				<Route exact path="/products" element={<div>all products</div>} />
			</Routes>
		</div>
	);
}

const RawMaterials = ({ refresh }) => {
	return (
		<div className="grid grid-cols-2 gap-5">
			<MopTotalInventory refresh={refresh} />
			<DapTotalInventory refresh={refresh} />
			<GasTotalInventory refresh={refresh} />
			<LsgTotalInventory refresh={refresh} />
			<UreaTotalInventory refresh={refresh} />
		</div>
	);
};
