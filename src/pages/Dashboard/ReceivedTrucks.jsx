import { useEffect, useState } from "react";
import { getTrucksWithFilter } from "../../util/crud";
import InfoAlert from "../../components/alerts/InfoAlert";
import Spinner from "../../components/Spinner";
import { formatTimestamp } from "../../util/functions";
import { useMenu } from "../../contexts/menuContext";
import ReturnWaybillView from "../../components/ReturnWaybillView";
import { Link, Route, Routes } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import TrucksList from "../../components/TruckList";
import ButtonPrimary from "../../components/buttons/ButtonPrimary";
import EditTruck from "../../components/EditTruck";
import { useQuery } from "react-query";

function ReceivedTrucks() {
  const { user } = useAuth();

  const fetchAllReceivedTrucks = async () => {
    try {
      const result = await getTrucksWithFilter(
        "status",
        "received",
        "dateReceived"
      );
      const mappedResult = result.map((truck) => {
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
      return mappedResult;
    } catch (error) {
      throw error;
    }
  };

  const { isLoading, error, data, isFetching, refetch } = useQuery(
    "getReceivedTrucks",
    fetchAllReceivedTrucks
  );

  const { setIsMenuOpen } = useMenu();
  useEffect(() => {
    setIsMenuOpen(false);
  }, []);

  const trucksHeader = [
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

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (user.role === "inventory" || user.role === "admin")
    trucksHeader.push("Waybill");
  if (user.role === "admin") trucksHeader.push("Edit");

  return isLoading || isFetching ? (
    <div className='flex items-center justify-center h-48 w-full'>
      <Spinner />
    </div>
  ) : error ? (
    <div className='p-5 bg-red-500 text-red-200'>
      Error Loading Trucks, Please Try Again.
    </div>
  ) : (
    <>
      <div className='mb-5'>
        <ButtonPrimary onClick={() => refetch()}>Refresh</ButtonPrimary>
      </div>
      <Routes>
        <Route
          exact
          path='/*'
          element={<TrucksList allTrucks={data} trucksHeader={trucksHeader} />}
        />
        <Route path='/waybill/:truckId' element={<ReturnWaybillView />} />
        <Route path='/edit/:truckId' element={<EditTruck />} />
      </Routes>
    </>
  );
}

export { ReceivedTrucks as default };
