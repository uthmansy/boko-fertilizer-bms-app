import { Route, Routes } from "react-router-dom";
import LogisticsSingleTruck from "./LogisticsSingleTruck";
import { useEffect, useState } from "react";
import { getTrucksWithFilter } from "../../util/crud";
import ContentLoader from "../../components/ContentLoader";
import { useMenu } from "../../contexts/menuContext";
import TransitList from "./TransitList";
import ReceiveTruck from "./ReceiveTruck";
import ReturnWaybillView from "../../components/ReturnWaybillView";
import EditTruck from "../../components/EditTruck";
import ButtonPrimary from "../../components/buttons/ButtonPrimary";
import RefreshButton from "../../components/RefreshButton";

function Transit() {
  const { setIsMenuOpen } = useMenu();

  const [trucks, setTrucks] = useState(null);
  const [isLoadingTrucks, setIsLoadingTrucks] = useState(true);
  const [isLoadingError, setIsLoadingError] = useState(false);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    setIsMenuOpen(false);
  }, []); //fetch transit trucks in use effect

  useEffect(() => {
    const getTrucks = async () => {
      try {
        setIsLoadingTrucks(true);
        const trucks = await getTrucksWithFilter("status", "transit");
        setTrucks(trucks);
        setIsLoadingTrucks(false);
      } catch (error) {
        console.error(error);
        setIsLoadingTrucks(false);
        setIsLoadingError(true);
      }
    };

    getTrucks();
  }, [refresh]);
  return isLoadingTrucks ? (
    <div className='h-screen'>
      <ContentLoader />
    </div>
  ) : isLoadingError ? (
    <div className='text-red-500'>Error Loading Trucks..</div>
  ) : (
    <div>
      <div className='mb-5'>
        <RefreshButton setRefresh={setRefresh} />
      </div>
      <Routes>
        <Route exact path='/*' element={<TransitList trucks={trucks} />} />
        <Route
          path='/receive/:truckId'
          element={<ReceiveTruck setTrucks={setTrucks} trucks={trucks} />}
        />
        <Route path='/waybill/:truckId' element={<ReturnWaybillView />} />
        <Route path='/edit/:truckId' element={<EditTruck />} />
        <Route path='/truck/:id' element={<LogisticsSingleTruck />} />
      </Routes>
    </div>
  );
}

export { Transit as default };
