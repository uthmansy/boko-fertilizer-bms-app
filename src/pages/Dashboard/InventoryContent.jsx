import { Route, Routes } from "react-router-dom";
import InventoryTransit from "./InventoryTransit";
import InventoryTotalInventory from "./InventoryTotalInventory";
import InventoryReceived from "./InventoryReceived";
import InventoryProduction from "./InventoryProduction";

export default function InventoryContent() {
	return (
		<div>
			<Routes>
				<Route exact path="/*" element={<InventoryTotalInventory />} />
				<Route path="/dispatch/*" element={<div>dispatch content</div>} />
				<Route path="/production/*" element={<InventoryProduction />} />
				<Route path="/transit/*" element={<InventoryTransit />} />
				<Route path="/received/*" element={<InventoryReceived />} />
			</Routes>
		</div>
	);
}
