import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import ButtonPrimary from "../components/buttons/ButtonPrimary";
import { Link } from "react-router-dom";
import { formatTimestamp } from "../util/functions";

export default function useMapDeliveredTrucks(serielData) {
  const [trucks, setTrucks] = useState(null);

  useEffect(() => {
    const mappedResult = serielData.map((truck) => {
      // Extract only the desired key-value pairs
      const {
        truckNumber,
        origin,
        destination,
        otherDestination,
        otherOrigin,
        waybillNumber,
        orderNumber,
        dateLoaded,
        item,
        qtyBagsDispatched,
        id,
        qtyBagsReceived,
      } = truck;
      // Create a new object with the extracted key-value pairs
      const data = {
        truckNumber,
        origin,
        destination,
        item,
        qtyBagsDispatched,
        waybillNumber,
        orderNumber: orderNumber || "NIL",
        dateLoaded: formatTimestamp(dateLoaded),
      };

      data.viewWaybillButton = (
        <Link
          to={`waybill/${id}`}
          className='hover:underline bg-gray-500 p-2 px-3 text-white w-full inline-block text-center'
        >
          View
        </Link>
      );

      if (destination === "Others") data.destination = otherDestination;
      if (origin === "Others") data.origin = otherOrigin;

      return data;
    });
    setTrucks(mappedResult);
  }, [serielData]);

  const tableHeader = [
    "SN",
    "Truck Number",
    "Origin",
    "Destination",
    "Item",
    "Qty Dispatched",
    "Waybill Number",
    "Order Number",
    "Date Loaded",
    "View Waybill",
  ];

  return { trucks, tableHeader };
}
