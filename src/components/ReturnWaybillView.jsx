import { useEffect } from "react";
import PrintDoc from "./PrintDoc";
import ReturnWaybill from "./ReturnWaybill";
import { useParams } from "react-router-dom";
import { getTruckById, getTrucksWithFilter } from "../util/crud";
import { useState } from "react";

function ReturnWaybillView() {
  const { truckId } = useParams();

  const [isLoading, setIsLoading] = useState(getTrucksWithFilter);
  const [isLoadingError, setIsLoadingError] = useState(null);
  const [truck, setTruck] = useState(false);

  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
    });
  }, []);

  useEffect(() => {
    const getTruck = async () => {
      try {
        setIsLoading(true);
        const truck = await getTruckById(truckId);
        setTruck(truck);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setIsLoadingError(error.message);
        console.error(error);
      }
    };
    getTruck();
  }, [truckId]);

  return (
    <div>
      <PrintDoc>
        {isLoading ? (
          <div className='bg-white p-5'>Loading...</div>
        ) : isLoadingError ? (
          <div className='bg-red-100 p-5'>{isLoadingError}</div>
        ) : (
          <ReturnWaybill payload={truck} />
        )}
      </PrintDoc>
    </div>
  );
}

export { ReturnWaybillView as default };
