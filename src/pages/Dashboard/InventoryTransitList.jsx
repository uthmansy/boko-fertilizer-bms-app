import { useEffect } from "react";
import { formatTimestamp } from "../../util/functions";
import InventoryTransitTable from "../../components/tables/InventoryTransitTable";
import ButtonPrimary from "../../components/buttons/ButtonPrimary";
import { Link } from "react-router-dom";
import InfoAlert from "../../components/alerts/InfoAlert";
import ButtonGroup from "../../components/buttons/ButtonGroup";
import { companyFullName } from "../../constants/company";

export default function InventoryTransitList({ setDestinationFilter, trucks }) {
  //render a table of trucks or an info saying no trucks based on trucks prop
  const trucksHeader = [
    "Truck Number",
    "Origin",
    "Destination",
    "Waybill Number",
    "Date Loaded",
    "Receive",
  ];

  useEffect(() => {
    console.log(trucks);
  }, []);

  const tableTrucks = trucks.map((truck) => {
    // Extract only the desired key-value pairs
    const { truckNumber, origin, destination, waybillNumber, dateLoaded, id } =
      truck;

    // Create a new object with the extracted key-value pairs
    return {
      truckNumber,
      origin,
      destination,
      waybillNumber,
      dateLoaded: formatTimestamp(dateLoaded),
      receiveButton: (
        <Link to={`truck/${id}`}>
          <ButtonPrimary>Receive</ButtonPrimary>
        </Link>
      ),
    };
  });

  return (
    <div>
      <div className='mb-10'>
        <ButtonGroup
          onClick1={() => setDestinationFilter(companyFullName)}
          onClick2={() => setDestinationFilter("Others")}
          child1={companyFullName}
          child2='Others'
        />
      </div>
      {tableTrucks.length != 0 ? (
        <InventoryTransitTable
          tableHeader={trucksHeader}
          tableData={tableTrucks}
        />
      ) : (
        <InfoAlert>
          There are currently no Trucks on Transit, Thank You!
        </InfoAlert>
      )}
    </div>
  );
}
