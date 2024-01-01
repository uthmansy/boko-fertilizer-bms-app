import { Link, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTrucksWithFilter } from "../../util/crud";
import InventoryReceiveTruck from "./InventoryReceiveTruck";
import ContentLoader from "../../components/ContentLoader";
import ButtonGroup from "../../components/buttons/ButtonGroup";
import InfoAlert from "../../components/alerts/InfoAlert";
import { formatTimestamp } from "../../util/functions";
import ButtonPrimary from "../../components/buttons/ButtonPrimary";
import { companyFullName } from "../../constants/company";

export default function AdminTransit() {
  const [rawTrucks, setRawTrucks] = useState(null);
  const [trucks, setTrucks] = useState(null);
  const [isLoadingTrucks, setIsLoadingTrucks] = useState(true);
  const [destinationFilter, setDestinationFilter] = useState("none");

  //fetch transit trucks in use effect
  useEffect(() => {
    const getTrucks = async () => {
      const trucks = await getTrucksWithFilter("status", "transit");
      setRawTrucks(trucks);
      setTrucks(
        trucks?.filter((truck) => truck.destination === companyFullName)
      );
      setIsLoadingTrucks(false);
    };
    getTrucks();
  }, []);

  useEffect(() => {
    if (destinationFilter != "none") {
      const filteredTrucks = rawTrucks?.filter(
        (truck) => truck.destination === destinationFilter
      );
      setTrucks(filteredTrucks);
    }
  }, [destinationFilter]);

  return isLoadingTrucks ? (
    <div className='h-screen'>
      <ContentLoader />
    </div>
  ) : (
    <div>
      <Routes>
        <Route
          exact
          path='/*'
          element={
            <AdminTransitList
              setDestinationFilter={setDestinationFilter}
              trucks={trucks}
            />
          }
        />
        <Route path='/truck/:truckId' element={<InventoryReceiveTruck />} />
      </Routes>
    </div>
  );
}

function AdminTransitList({ setDestinationFilter, trucks }) {
  //render a table of trucks or an info saying no trucks based on trucks prop
  const trucksHeader = [
    "Truck Number",
    "Item Carried",
    "Origin",
    "Destination",
    "Waybill Number",
    "Date Loaded",
  ];

  const tableTrucks = trucks.map((truck) => {
    // Extract only the desired key-value pairs
    const {
      truckNumber,
      origin,
      destination,
      waybillNumber,
      dateLoaded,
      id,
      item,
    } = truck;

    // Create a new object with the extracted key-value pairs
    return {
      truckNumber,
      item,
      origin,
      destination,
      waybillNumber,
      dateLoaded: formatTimestamp(dateLoaded),
    };
  });

  return (
    <div>
      <div className='mb-5'>
        <ButtonGroup
          onClick1={() => setDestinationFilter(companyFullName)}
          onClick2={() => setDestinationFilter("Others")}
          child1={companyFullName}
          child2='Others'
        />
      </div>
      {tableTrucks.length != 0 ? (
        <AdminTransitTable tableHeader={trucksHeader} tableData={tableTrucks} />
      ) : (
        <InfoAlert>
          There are currently no Trucks on Transit, Thank You!
        </InfoAlert>
      )}
    </div>
  );
}

function AdminTransitTable({ tableHeader, tableData }) {
  return (
    <div className='relative overflow-x-auto'>
      <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400 bg-white'>
        <thead className='text-xs text-white uppercase bg-green-500 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              SN
            </th>
            {tableHeader.map((header, index) => (
              <th scope='col' className='px-6 py-3' key={index}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='bg-white'>
          {tableData.map((item, index) => {
            const dataEntries = Object.entries(item);
            return (
              <tr className='bg-white dark:border-gray-700' key={index}>
                <td className='px-6 py-4 border-r text-center bg-slate-50 font-bold'>
                  {index + 1}
                </td>
                {dataEntries.map(([key, value]) => (
                  <td className='px-6 py-4' key={key}>
                    {value}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
