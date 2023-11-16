import { useNavigate, useParams } from "react-router-dom";
import ButtonPrimaryIcon from "../../components/buttons/ButtonPrimaryIcon";
import InventoryReceiveForm from "../../components/InventoryReceiveForm";
import { useEffect, useState } from "react";
import { getTruckById } from "../../util/crud";
import InventoryTransitTruckInfo from "./InventoryTransitTruckInfo";
import InventoryViewReturnWaybill from "../../components/InventoryViewReturnWaybill";
import ContentLoader from "../../components/ContentLoader";
import InfoAlert from "../../components/alerts/InfoAlert";

export default function InventoryReceiveTruck() {
	const { truckId } = useParams();
	const navigate = useNavigate();

	const [truck, setTruck] = useState();
	const [receivedTruck, setReceivedTruck] = useState(null);

	useEffect(() => {
		const getTruck = async () => {
			const truck = await getTruckById(truckId);
			setTruck(truck);
		};
		getTruck();
	}, []);

	return !receivedTruck ? (
		<div>
			<div className="mb-10">
				<ButtonPrimaryIcon
					icon={
						<svg
							className="w-6 h-6 text-gray-800 dark:text-white"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 14 10">
							<path
								stroke="white"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="1.2"
								d="M13 5H1m0 0 4 4M1 5l4-4"
							/>
						</svg>
					}
					onClick={() => navigate(-1)}>
					Back
				</ButtonPrimaryIcon>
			</div>
			{truck ? (
				truck.status === "transit" ? (
					<div className="flex space-x-5">
						<div className="w-1/2 p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800">
							<InventoryTransitTruckInfo truck={truck} />
						</div>
						<div className="w-1/2">
							<InventoryReceiveForm
								truck={truck}
								truckId={truckId}
								setReceivedTruck={setReceivedTruck}
							/>
						</div>
					</div>
				) : (
					<InfoAlert>This Truck has already been received</InfoAlert>
				)
			) : (
				<div className="h-screen">
					<ContentLoader />
				</div>
			)}
		</div>
	) : (
		<div>
			<InventoryViewReturnWaybill waybillData={receivedTruck} />
		</div>
	);
}
