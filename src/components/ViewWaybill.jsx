import { useEffect } from "react";
import PrintDoc from "./PrintDoc";
import DeliveryWaybill from "./DeliveryWaybill";
import { useParams } from "react-router-dom";
import { getTruckById } from "../util/crud";
import { useQuery } from "react-query";

const getTruck = async (truckId) => {
  try {
    const truck = await getTruckById(truckId);
    return truck;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

function ViewWaybill() {
  const { truckId } = useParams();

  const { isLoading, error, data, isFetching } = useQuery(
    ["getTransitTruck", truckId],
    () => getTruck(truckId)
  );

  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
    });
  }, []);

  return isLoading || isFetching ? (
    <div>Loading...</div>
  ) : error ? (
    <div>Error Loading waybill</div>
  ) : (
    <div>
      <PrintDoc>
        <DeliveryWaybill payload={data} />
      </PrintDoc>
    </div>
  );
}

export { ViewWaybill as default };
