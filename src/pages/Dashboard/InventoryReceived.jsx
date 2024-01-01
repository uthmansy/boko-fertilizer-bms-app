import { useEffect, useState } from "react";
import { getTrucksWithFilter } from "../../util/crud";
import InventoryReceivedList from "./InventoryReceivedList";
import ContentLoader from "../../components/ContentLoader";
import { companyFullName } from "../../constants/company";

export default function InventoryReceived() {
  const [trucks, setTrucks] = useState(null);
  const [rawTrucks, setRawTrucks] = useState(null);
  const [isLoadingTrucks, setIsLoadingTrucks] = useState(true);
  const [destinationFilter, setDestinationFilter] = useState(companyFullName);
  const [itemFilter, setItemFilter] = useState("MOP");

  //fetch Received trucks in use effect
  useEffect(() => {
    try {
      const fetchTrucks = async () => {
        const trucks = await getTrucksWithFilter(
          "status",
          "received",
          "dateReceived"
        );
        setRawTrucks(trucks);
        setTrucks(
          trucks
            ?.filter((truck) => truck.destination === companyFullName)
            .filter((truck) => truck.item === itemFilter)
        );
        setIsLoadingTrucks(false);
      };
      fetchTrucks();
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (rawTrucks != null) {
      let filteredTrucks = rawTrucks.filter(
        (truck) => truck.destination === destinationFilter
      );

      let filteredTrucksItem = filteredTrucks.filter(
        (truck) => truck.item === itemFilter
      );
      setTrucks(filteredTrucksItem);
    }
  }, [destinationFilter, itemFilter, rawTrucks]);

  return isLoadingTrucks ? (
    <div className='h-screen'>
      <ContentLoader />
    </div>
  ) : (
    <div>
      <div className='mb-5 flex space-x-2'>
        <button
          onClick={() => setItemFilter("MOP")}
          className={`p-2 border ${
            itemFilter === "MOP"
              ? "bg-red-500 border-red-500 text-white"
              : "bg-white border-blue-600"
          }  px-3`}
        >
          MOP
        </button>
        <button
          onClick={() => setItemFilter("DAP")}
          className={`p-2 border ${
            itemFilter === "DAP"
              ? "bg-red-500 border-red-500 text-white"
              : "bg-white border-blue-600"
          }  px-3`}
        >
          DAP
        </button>
        <button
          onClick={() => setItemFilter("UREA")}
          className={`p-2 border ${
            itemFilter === "UREA"
              ? "bg-red-500 border-red-500 text-white"
              : "bg-white border-blue-600"
          }  px-3`}
        >
          UREA
        </button>
        <button
          onClick={() => setItemFilter("LSG")}
          className={`p-2 border ${
            itemFilter === "LSG"
              ? "bg-red-500 border-red-500 text-white"
              : "bg-white border-blue-600"
          }  px-3`}
        >
          LSG
        </button>
        <button
          onClick={() => setItemFilter("GAS")}
          className={`p-2 border ${
            itemFilter === "GAS"
              ? "bg-red-500 border-red-500 text-white"
              : "bg-white border-blue-600"
          }  px-3`}
        >
          GAS
        </button>
      </div>
      <InventoryReceivedList
        setDestinationFilter={setDestinationFilter}
        trucks={trucks}
      />
    </div>
  );
}
