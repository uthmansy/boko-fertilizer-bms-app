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
import { useInfiniteQuery, useQuery } from "react-query";
import ViewWaybill from "../../components/ViewWaybill";
import useSerielData from "../../hooks/useSerielData";
import ButtonPrimary from "../../components/buttons/ButtonPrimary";
import SearchTruck from "../../components/SearchTruck";

function Transit() {
  const { setIsMenuOpen } = useMenu();

  useEffect(() => {
    setIsMenuOpen(false);
  }, []);

  const {
    isLoading,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["getAllTransitTrucks"],
    queryFn: ({ pageParam = null }) =>
      getTrucksWithFilter("status", "transit", "dateLoaded", pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
  });

  const [serielData] = useSerielData(data);

  return isLoading ? (
    <div className='h-screen'>
      <ContentLoader />
    </div>
  ) : error ? (
    <div className='text-red-500'>Error Loading Trucks..</div>
  ) : (
    <div>
      <Routes>
        <Route
          exact
          path='/*'
          element={
            <>
              <SearchTruck status='transit' />
              <TransitList trucks={serielData} />
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
        <Route path='/receive/:truckId' element={<ReceiveTruck />} />
        <Route path='/waybill/:truckId/*' element={<ViewWaybill />} />
        <Route path='/edit/:truckId' element={<EditTruck />} />
        <Route path='/truck/:id' element={<LogisticsSingleTruck />} />
      </Routes>
    </div>
  );
}

export { Transit as default };
