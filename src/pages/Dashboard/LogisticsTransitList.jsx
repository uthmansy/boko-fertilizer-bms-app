import { useState } from "react";
import InfoAlert from "../../components/alerts/InfoAlert";
import ButtonPrimary from "../../components/buttons/ButtonPrimary";
import DefaultTable from "../../components/tables/DefaultTable";
import { formatTimestamp } from "../../util/functions";

export default function LogisticsTransitList({ trucks }) {
  const rawTrucks = trucks.map((truck) => {
    // Extract only the desired key-value pairs
    const {
      truckNumber,
      origin,
      destination,
      otherDestination,
      waybillNumber,
      dateLoaded,
      item,
    } = truck;

    // Create a new object with the extracted key-value pairs
    const data = {
      truckNumber,
      origin,
      destination,
      item,
      waybillNumber,
      dateLoaded: formatTimestamp(dateLoaded),
    };

    if (destination === "Others") data.destination = otherDestination;

    return data;
  });

  const [tableTrucks, setTableTrucks] = useState(rawTrucks);

  //render a table of trucks or an info saying no trucks based on trucks prop
  const trucksHeader = [
    "SN",
    "Truck Number",
    "Origin",
    "Destination",
    "Item",
    "Waybill Number",
    "Date Loaded",
  ];

  const filterDestination = (destination) => {
    const filteredTrucks = rawTrucks.filter((truck) => {
      return destination === "Boko Fertilizer"
        ? truck.destination === "Boko Fertilizer"
        : truck.destination !== "Boko Fertilizer";
    });
    setTableTrucks(filteredTrucks);
  };
  const filterOrigin = (origin) => {
    const filteredTrucks = rawTrucks.filter((truck) => {
      return origin === "Port Harcourt"
        ? truck.origin === "Port Harcourt"
        : origin === "Boko Fertilizer"
        ? truck.origin === "Boko Fertilizer"
        : truck.origin !== "Boko Fertilizer" &&
          truck.origin !== "Port Harcourt";
    });
    setTableTrucks(filteredTrucks);
  };

  return tableTrucks.length != 0 ? (
    <>
      <nav className='mb-5 flex space-x-2'>
        <ButtonPrimary onClick={() => filterDestination("Boko Fertilizer")}>
          To Boko
        </ButtonPrimary>
        <ButtonPrimary onClick={() => filterDestination("Others")}>
          To Others
        </ButtonPrimary>
        <ButtonPrimary onClick={() => filterOrigin("Port Harcourt")}>
          From Portharcout
        </ButtonPrimary>
        <ButtonPrimary onClick={() => filterOrigin("Boko Fertilizer")}>
          From Boko
        </ButtonPrimary>
        <ButtonPrimary onClick={() => filterOrigin("Others")}>
          From Others
        </ButtonPrimary>
      </nav>
      <DefaultTable tableHeader={trucksHeader} tableData={tableTrucks} />
    </>
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
