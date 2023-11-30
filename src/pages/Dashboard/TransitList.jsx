import { useState } from "react";
import InfoAlert from "../../components/alerts/InfoAlert";
import ButtonPrimary from "../../components/buttons/ButtonPrimary";
import DefaultTable from "../../components/tables/DefaultTable";
import { formatTimestamp } from "../../util/functions";
import { useAuth } from "../../contexts/authContext";
import { Link } from "react-router-dom";
import TrucksList from "../../components/TruckList";

function TransitList({ trucks }) {
  const { user } = useAuth();
  const allTrucks = trucks.map((truck) => {
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
    return data;
  });

  const trucksHeader = [
    "SN",
    "Truck Number",
    "Origin",
    "Destination",
    "Item",
    "QTY Dispatched",
    "Waybill Number",
    "Date Loaded",
  ];
  if (user.role === "admin") trucksHeader.push("Driver Phone");
  if (user.role === "admin") trucksHeader.push("Edit");
  if (user.role === "inventory" || user.role === "admin")
    trucksHeader.push("Receive");

  return allTrucks.length != 0 ? (
    <TrucksList trucksHeader={trucksHeader} allTrucks={allTrucks} />
  ) : (
    <>
      <div className='mb-5'>
        <ButtonPrimary onClick={() => setTableTrucks(rawTrucks)}>
          Back
        </ButtonPrimary>
      </div>
      <InfoAlert>
        There are currently no Trucks on Transit, Thank You!
      </InfoAlert>
    </>
  );
}

export { TransitList as default };
