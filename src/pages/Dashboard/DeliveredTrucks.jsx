import { useState } from "react";
import { useMenu } from "../../contexts/menuContext";
import { useEffect } from "react";
import { getTruckById, getTrucksWithFilter } from "../../util/crud";
import Spinner from "../../components/Spinner";
import { Route, Routes, useParams } from "react-router-dom";
import TrucksList from "../../components/TruckList";
import EditTruck from "../../components/EditTruck";
import ViewWaybill from "../../components/ViewWaybill";
import { useInfiniteQuery } from "react-query";
import useSerielData from "../../hooks/useSerielData";
import useMapDeliveredTrucks from "../../hooks/useMapDeliveredTrucks";
import ButtonPrimary from "../../components/buttons/ButtonPrimary";
import SearchTruck from "../../components/SearchTruck";

export default function DeliveredTrucks() {
  const { setIsMenuOpen } = useMenu();

  const {
    isLoading,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["getDeliveredTrucks"],
    queryFn: ({ pageParam = null }) =>
      getTrucksWithFilter("status", "delivered", "dateLoaded", pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
  });

  const [serielData] = useSerielData(data);
  const { trucks, tableHeader } = useMapDeliveredTrucks(serielData);

  useEffect(() => {
    setIsMenuOpen(false);
  }, []);

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
      <div>
        <ButtonPrimary classes={"mb-5"} onClick={refetch}>
          Refresh
        </ButtonPrimary>
        <Routes>
          <Route
            exact
            path='/*'
            element={
              <>
                <SearchTruck status='delivered' />
                <TrucksList allTrucks={trucks} trucksHeader={tableHeader} />
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
          <Route path='/waybill/:truckId' element={<DeliveredWaybill />} />
          <Route path='/edit/:truckId' element={<EditTruck />} />
        </Routes>
      </div>
    </>
  );
}

const DeliveredWaybill = () => {
  const { truckId } = useParams();

  const [truck, setTruck] = useState(null);
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTruck = async () => {
      setIsLoading(true);
      try {
        const truck = await getTruckById(truckId);
        setTruck(truck);
        console.log(truck);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setIsError(error.message);
      }
    };
    fetchTruck();
  }, [truckId]);

  return isLoading ? (
    "Loading..."
  ) : isError ? (
    "Error Loading Waybill"
  ) : truck ? (
    <ViewWaybill waybillData={truck} />
  ) : (
    "This Truck Doesnt Exist"
  );
};
