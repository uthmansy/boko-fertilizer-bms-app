import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTrucksWithFilter } from "../../util/crud";
import InventoryTransitList from "./InventoryTransitList";
import InventoryReceiveTruck from "./InventoryReceiveTruck";
import ContentLoader from "../../components/ContentLoader";
import { companyFullName } from "../../constants/company";

export default function InventoryTransit() {
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
      console.log(trucks);
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
            <InventoryTransitList
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
