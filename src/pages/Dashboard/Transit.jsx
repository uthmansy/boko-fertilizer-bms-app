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
import { useQuery } from "react-query";
import ViewWaybill from "../../components/ViewWaybill";

const fetchAllTransitTrucks = async () => {
  try {
    const trucks = await getTrucksWithFilter("status", "transit");
    return trucks;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

function Transit() {
  const { setIsMenuOpen } = useMenu();

  const { isLoading, error, data, isFetching, refetch } = useQuery(
    "getAllTransitTrucks",
    fetchAllTransitTrucks
  );

  useEffect(() => {
    setIsMenuOpen(false);
  }, []); //fetch transit trucks in use effect

  return isLoading || isFetching ? (
    <div className='h-screen'>
      <ContentLoader />
    </div>
  ) : error ? (
    <div className='text-red-500'>Error Loading Trucks..</div>
  ) : (
    <div>
      <Routes>
        <Route exact path='/*' element={<TransitList trucks={data} />} />
        <Route path='/receive/:truckId' element={<ReceiveTruck />} />
        <Route path='/waybill/:truckId/*' element={<ViewWaybill />} />
        <Route path='/edit/:truckId' element={<EditTruck />} />
        <Route path='/truck/:id' element={<LogisticsSingleTruck />} />
      </Routes>
    </div>
  );
}

export { Transit as default };
