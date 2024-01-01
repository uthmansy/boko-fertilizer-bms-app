import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { formatTimestamp } from "../util/functions";
import { Link } from "react-router-dom";
import ButtonPrimary from "../components/buttons/ButtonPrimary";

export default function useMapTransitTrucks(serielData) {
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
        qtyBagsDispatched,
        waybillNumber,
        dateLoaded,
        item,
        driverNumber,
        id,
      } = truck; // Create a new object with the extracted key-value pairs

      const data = {
        truckNumber,
        origin,
        destination,
        item,
        qtyBagsDispatched,
        waybillNumber,
        dateLoaded: formatTimestamp(dateLoaded),
      };
      if (destination === "Others") data.destination = otherDestination;
      if (origin === "Others") data.origin = otherOrigin;
      if (user.role === "admin") data.driverNumber = driverNumber;
      if (user.role === "inventory" || user.role === "admin")
        data.receiveButton = (
          <Link to={`receive/${id}`}>
            <ButtonPrimary>Receive</ButtonPrimary>
          </Link>
        );
      if (user.role === "admin")
        data.editButton = (
          <Link to={`edit/${id}`}>
            <ButtonPrimary>Edit</ButtonPrimary>
          </Link>
        );
      if (user.role === "logistics" || user.role === "admin")
        data.waybillButton = (
          <Link to={`waybill/${id}`}>
            <ButtonPrimary>waybill</ButtonPrimary>
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
    "QTY Dispatched",
    "Waybill Number",
    "Date Loaded",
  ];
  if (user.role === "admin") tableHeader.push("Driver Phone");
  if (user.role === "admin") tableHeader.push("Edit");
  if (user.role === "admin" || user.role === "logistics")
    tableHeader.push("View");
  if (user.role === "inventory" || user.role === "admin")
    tableHeader.push("Receive");

  return { trucks, tableHeader };
}
