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
import { useInfiniteQuery, useQuery } from "react-query";
import useSerielData from "../../hooks/useSerielData";
import DefaultTable from "../../components/tables/DefaultTable";
import useMapReceivedTrucks from "../../hooks/useMapReceivedTrucks";
import SearchTruck from "../../components/SearchTruck";

function ReceivedTrucks() {
  const {
    isLoading,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["getReceivedTrucks"],
    queryFn: ({ pageParam = null }) =>
      getTrucksWithFilter("status", "received", "dateReceived", pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
  });

  const [serielData] = useSerielData(data);

  const { setIsMenuOpen } = useMenu();
  useEffect(() => {
    setIsMenuOpen(false);
  }, []);

  const { trucks, tableHeader } = useMapReceivedTrucks(serielData);

  return isLoading ? (
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
          element={
            <>
              <SearchTruck status='received' />
              <TrucksList allTrucks={trucks} trucksHeader={tableHeader} />
              {/* <DefaultTable tableHeader={tableHeader} tableData={trucks} /> */}
              {hasNextPage && (
                <nav className='mt-5 flex items-center justify-center'>
                  <ButtonPrimary
                    onClick={() => fetchNextPage()}
                    disabled={isFetching}
                  >
                    {isFetching ? "Loading..." : "Load more"}
                  </ButtonPrimary>
                </nav>
              )}
            </>
          }
        />
        <Route path='/waybill/:truckId' element={<ReturnWaybillView />} />
        <Route path='/edit/:truckId' element={<EditTruck />} />
      </Routes>
    </>
  );
}

export { ReceivedTrucks as default };
