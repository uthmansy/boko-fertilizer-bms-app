import { useState } from "react";
import { useMenu } from "../../contexts/menuContext";
import { useEffect } from "react";
import { getTruckById, getTrucksWithFilter } from "../../util/crud";
import { formatTimestamp } from "../../util/functions";
import Spinner from "../../components/Spinner";
import InfoAlert from "../../components/alerts/InfoAlert";
import { useAuth } from "../../contexts/authContext";
import { Link, Route, Routes, useParams } from "react-router-dom";
import TrucksList from "../../components/TruckList";
import RefreshButton from "../../components/RefreshButton";
import EditTruck from "../../components/EditTruck";
import ViewWaybill from "../../components/ViewWaybill";

export default function DeliveredTrucks() {
  const { user } = useAuth();

  //Loading, empty, error states
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isError, setIsError] = useState(false);
  const [refresh, setRefresh] = useState(0);

  //all received trucks
  const [allTrucks, setAllTrucks] = useState([]);

  const { setIsMenuOpen } = useMenu();

  useEffect(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    const fetchAllReceivedTrucks = async () => {
      try {
        setIsLoading(true);
        const result = await getTrucksWithFilter(
          "status",
          "delivered",
          "dateLoaded"
        );
        if (result.length === 0) setIsEmpty(true);
        const mappedResult = result.map((truck) => {
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

        setAllTrucks(mappedResult);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        setIsError(true);
      }
    };
    fetchAllReceivedTrucks();
  }, [refresh]);

  const trucksHeader = [
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

  return isLoading ? (
    <div className='flex items-center justify-center h-48 w-full'>
      <Spinner />
    </div>
  ) : isEmpty ? (
    <InfoAlert>There are Currently No Delivered Trucks</InfoAlert>
  ) : isError ? (
    <div className='p-5 bg-red-500 text-red-200'>
      Error Loading Trucks, Please Try Again.
    </div>
  ) : (
    <>
      <div>
        <div className='mb-5'>
          <RefreshButton setRefresh={setRefresh} />
        </div>
        <Routes>
          <Route
            exact
            path='/*'
            element={
              <TrucksList allTrucks={allTrucks} trucksHeader={trucksHeader} />
            }
          />
          <Route path='/waybill/:truckId' element={<DeliveredWaybill />} />
          <Route path='/edit/:truckId' element={<EditTruck />} />
        </Routes>
      </div>
    </>
  );
}

const DeliveredWaybill = () => {
  const { truckId } = useParams();

  const [truck, setTruck] = useState(null);
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTruck = async () => {
      setIsLoading(true);
      try {
        const truck = await getTruckById(truckId);
        setTruck(truck);
        console.log(truck);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setIsError(error.message);
      }
    };
    fetchTruck();
  }, [truckId]);

  return isLoading ? (
    "Loading..."
  ) : isError ? (
    "Error Loading Waybill"
  ) : truck ? (
    <ViewWaybill waybillData={truck} />
  ) : (
    "This Truck Doesnt Exist"
  );
};
