import { useEffect } from "react";
import PrintDoc from "./PrintDoc";
import InventoryReturnWaybill from "./InventoryReturnWaybill";

export default function InventoryViewReturnWaybill({ waybillData }) {
	useEffect(() => {
		window.scroll({ top: 0, left: 0 });
	}, []);

	return (
		<div>
			<PrintDoc>
				<InventoryReturnWaybill payload={waybillData} />
			</PrintDoc>
		</div>
	);
}
