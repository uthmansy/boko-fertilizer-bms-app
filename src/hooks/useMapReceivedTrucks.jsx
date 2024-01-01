import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { formatTimestamp } from "../util/functions";
import { Link } from "react-router-dom";
import ButtonPrimary from "../components/buttons/ButtonPrimary";

export default function useMapReceivedTrucks(serielData) {
  const [trucks, setTrucks] = useState(null);

  const { user } = useAuth();

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
        // orderNumber,
        dateReceived,
        item,
        qtyBagsDispatched,
        qtyBagsReceived,
        id,
      } = truck; // Create a new object with the extracted key-value pairs

      const data = {
        truckNumber,
        origin,
        destination,
        item,
        qtyBagsDispatched,
        qtyBagsReceived,
        waybillNumber,
        // orderNumber: orderNumber || "NIL",
        dateReceived: formatTimestamp(dateReceived),
      };
      if (destination === "Others") data.destination = otherDestination;

      if (origin === "Others") data.origin = otherOrigin;
      if (user.role === "inventory" || user.role === "admin")
        data.viewWaybillButton = (
          <Link
            to={`waybill/${id}`}
            className='hover:underline bg-gray-500 p-2 px-3 text-white w-full inline-block text-center'
          >
            View
          </Link>
        );
      if (user.role === "admin")
        data.editButton = (
          <Link to={`edit/${id}`}>
            <ButtonPrimary>Edit</ButtonPrimary>
          </Link>
        );
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
    "Qty Received",
    "Waybill Number", // "Order Number",
    "Date Received",
  ];

  if (user.role === "inventory" || user.role === "admin")
    tableHeader.push("Waybill");
  if (user.role === "admin") tableHeader.push("Edit");

  return { trucks, tableHeader };
}
