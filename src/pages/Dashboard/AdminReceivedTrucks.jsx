import { useEffect, useState } from "react";
import { getTrucksWithFilter } from "../../util/crud";
import InfoAlert from "../../components/alerts/InfoAlert";
import Spinner from "../../components/Spinner";
import ButtonPrimary from "../../components/buttons/ButtonPrimary";
import DefaultTable from "../../components/tables/DefaultTable";
import { formatTimestamp } from "../../util/functions";
import { useMenu } from "../../contexts/menuContext";

export default function AdminReceivedTrucks() {
  //Loading, empty, error states
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isError, setIsError] = useState(false);

  //all received trucks
  const [allTrucks, setAllTrucks] = useState([]);
  const [filteredTrucks, setFilteredTrucks] = useState([]);

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
          "received",
          "dateReceived"
        );
        if (result.length === 0) setIsEmpty(true);
        const mappedResult = result.map((truck, index) => {
          // Extract only the desired key-value pairs
          const {
            truckNumber,
            origin,
            // destination,
            // otherDestination,
            otherOrigin,
            waybillNumber,
            // orderNumber,
            dateReceived,
            item,
            qtyBagsDispatched,
            qtyBagsReceived,
          } = truck;
          // Create a new object with the extracted key-value pairs
          const data = {
            truckNumber,
            origin,
            // destination,
            item,
            qtyBagsDispatched,
            qtyBagsReceived,
            waybillNumber,
            // orderNumber: orderNumber || "NIL",
            dateReceived: formatTimestamp(dateReceived),
          };

          // if (destination === "Others") data.destination = otherDestination;
          if (origin === "Others") data.origin = otherOrigin;

          return data;
        });

        setAllTrucks(mappedResult);
        setFilteredTrucks(mappedResult);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setIsError(true);
      }
    };
    fetchAllReceivedTrucks();
  }, []);

  const trucksHeader = [
    "SN",
    "Truck Number",
    "Origin",
    // "Destination",
    "Item",
    "Qty Dispatched",
    "Qty Received",
    "Waybill Number",
    // "Order Number",
    "Date Received",
  ];

  const filterDestination = (destination) => {
    const filteredTrucks = allTrucks.filter((truck) => {
      return destination === "Boko Fertilizer"
        ? truck.destination === "Boko Fertilizer"
        : truck.destination !== "Boko Fertilizer";
    });
    setFilteredTrucks(filteredTrucks);
  };
  const filterOrigin = (origin) => {
    const filteredTrucks = allTrucks.filter((truck) => {
      return origin === "Port Harcourt"
        ? truck.origin === "Port Harcourt"
        : origin === "Boko Fertilizer"
        ? truck.origin === "Boko Fertilizer"
        : truck.origin !== "Boko Fertilizer" &&
          truck.origin !== "Port Harcourt";
    });
    setFilteredTrucks(filteredTrucks);
  };

  const filterItem = (item) => {
    const filteredTrucks = allTrucks.filter((truck) => {
      return truck.item === item;
    });
    setFilteredTrucks(filteredTrucks);
  };

  return isLoading ? (
    <div className='flex items-center justify-center h-48 w-full'>
      <Spinner />
    </div>
  ) : isEmpty ? (
    <InfoAlert>There are Currently No Received Trucks</InfoAlert>
  ) : isError ? (
    <div className='p-5 bg-red-500 text-red-200'>
      Error Loading Trucks, Please Try Again.
    </div>
  ) : (
    <>
      <nav className='mb-5 grid grid-cols-3 md:grid-cols-6 gap-2'>
        <ButtonPrimary onClick={() => setFilteredTrucks(allTrucks)}>
          All
        </ButtonPrimary>
        <ButtonPrimary onClick={() => filterDestination("Boko Fertilizer")}>
          To Boko
        </ButtonPrimary>
        <ButtonPrimary onClick={() => filterDestination("Others")}>
          To Others
        </ButtonPrimary>
        <ButtonPrimary onClick={() => filterOrigin("Port Harcourt")}>
          From PH
        </ButtonPrimary>
        <ButtonPrimary onClick={() => filterOrigin("Boko Fertilizer")}>
          From Boko
        </ButtonPrimary>
        <ButtonPrimary onClick={() => filterOrigin("Others")}>
          From Others
        </ButtonPrimary>
      </nav>
      <nav className='mb-5 grid grid-cols-3 md:grid-cols-6 gap-2'>
        <ButtonPrimary onClick={() => filterItem("MOP")}>MOP</ButtonPrimary>
        <ButtonPrimary onClick={() => filterItem("DAP")}>DAP</ButtonPrimary>
        <ButtonPrimary onClick={() => filterItem("UREA")}>UREA</ButtonPrimary>
        <ButtonPrimary onClick={() => filterItem("GAS")}>GAS</ButtonPrimary>
        <ButtonPrimary onClick={() => filterItem("LSG")}>LSG</ButtonPrimary>
      </nav>
      <DefaultTable tableHeader={trucksHeader} tableData={filteredTrucks} />
    </>
  );
}
