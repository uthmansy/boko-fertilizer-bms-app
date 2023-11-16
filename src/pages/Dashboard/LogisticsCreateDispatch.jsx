import { useState } from "react";
import LogisticsViewWaybill from "../../components/LogisticsViewWaybill";
import LogisticsDispatchForm from "../../components/LogisticsDispatchForm";

export default function LogisticsCreateDispatch() {
	const [newDispatch, setNewDispatch] = useState(null);

	return newDispatch ? (
		<LogisticsViewWaybill
			setNewDispatch={setNewDispatch}
			waybillData={newDispatch}
		/>
	) : (
		<LogisticsDispatchForm setNewDispatch={setNewDispatch} />
	);
}
