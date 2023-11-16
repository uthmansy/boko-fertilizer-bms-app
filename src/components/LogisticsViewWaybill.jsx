import { useEffect } from "react";
import PrintDoc from "./PrintDoc";
import ButtonPrimary from "./buttons/ButtonPrimary";
import DeliveryWaybill from "./DeliveryWaybill";

export default function LogisticsViewWaybill({ waybillData, setNewDispatch }) {
	useEffect(() => {
		window.scroll({ top: 0, left: 0 });
	}, []);

	return (
		<div>
			<div className="mb-3">
				<ButtonPrimary onClick={() => setNewDispatch(null)}>
					Create New
				</ButtonPrimary>
			</div>
			<PrintDoc>
				<DeliveryWaybill payload={waybillData} />
			</PrintDoc>
		</div>
	);
}
