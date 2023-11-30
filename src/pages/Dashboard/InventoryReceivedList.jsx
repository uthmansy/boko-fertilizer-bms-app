import { formatTimestamp } from "../../util/functions";
import InventoryReceivedTable from "../../components/tables/InventoryReceivedTable";
import { Route, Routes, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getTruckById } from "../../util/crud";
import { useState } from "react";
import PrintDoc from "../../components/PrintDoc";
import ReturnWaybill from "../../components/ReturnWaybill";
import ReturnWaybillView from "../../components/ReturnWaybillView";

export default function InventoryReceivedList({
  trucks,
  setDestinationFilter,
}) {
  //render a table of trucks or an info saying no trucks based on trucks prop
  const trucksHeader = [
    "SN",
    "Truck Number",
    "Item Carried",
    "Origin",
    "Destination",
    "Waybill Number",
    "Date Received",
  ];

  const tableTrucks = trucks.map((truck) => {
    // Extract only the desired key-value pairs
    const {
      truckNumber,
      id,
      item,
      origin,
      destination,
      waybillNumber,
      dateReceived,
    } = truck;

    // Create a new object with the extracted key-value pairs
    return {
      truckNumber,
      item,
      id,
      origin,
      destination,
      waybillNumber,
      dateReceived: formatTimestamp(dateReceived),
    };
  });

  return (
    <div>
      <Routes>
        <Route
          exact
          path='/'
          element={
            <InventoryReceivedTable
              tableHeader={trucksHeader}
              tableData={tableTrucks}
              setDestinationFilter={setDestinationFilter}
            />
          }
        />
        <Route exact path='/:truckId' element={<ReturnWaybillView />} />
      </Routes>
    </div>
  );
}
