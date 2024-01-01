import { useEffect, useState } from "react";
import { useItems } from "../contexts/itemsContext";
import ButtonPrimary from "./buttons/ButtonPrimary";
import DefaultTable from "./tables/DefaultTable";
import { useAuth } from "../contexts/authContext";
import { companyFullName, companyName } from "../constants/company";

const TrucksList = ({ allTrucks, trucksHeader }) => {
  const { items } = useItems();
  const { user } = useAuth();

  const [filteredTrucks, setFilteredTrucks] = useState(allTrucks);
  const [itemFilter, setItemFilter] = useState(null);
  const [destinationFilter, setDestinationFilter] = useState(null);
  const [originFilter, setOriginFilter] = useState(null);

  useEffect(() => {
    if (itemFilter)
      setFilteredTrucks(
        allTrucks.filter((truck) => {
          return truck.item === itemFilter;
        })
      );
    if (destinationFilter)
      setFilteredTrucks(
        allTrucks.filter((truck) => {
          if (destinationFilter === companyFullName) {
            return truck.destination === companyFullName;
          } else return truck.destination != companyFullName;
        })
      );
    if (originFilter)
      setFilteredTrucks(
        allTrucks.filter((truck) => {
          return originFilter === "Port Harcourt"
            ? truck.origin === "Port Harcourt"
            : origin === companyFullName
            ? truck.origin === companyFullName
            : truck.origin !== companyFullName &&
              truck.origin !== "Port Harcourt";
        })
      );
    if (!originFilter && !destinationFilter && !itemFilter)
      setFilteredTrucks(allTrucks);
  }, [allTrucks, itemFilter, destinationFilter, originFilter]);

  const resetFilters = () => {
    setItemFilter(null);
    setDestinationFilter(null);
    setOriginFilter(null);
  };

  return (
    <>
      <nav className='mb-2 grid grid-cols-3 md:grid-cols-8 gap-2 capitalize'>
        <ButtonPrimary onClick={resetFilters}>All</ButtonPrimary>
        <ButtonPrimary onClick={() => setDestinationFilter(companyFullName)}>
          To {companyName}
        </ButtonPrimary>
        {(user.role === "admin" || user.role === "logistics") && (
          <ButtonPrimary onClick={() => setDestinationFilter("Others")}>
            To Others
          </ButtonPrimary>
        )}

        <ButtonPrimary onClick={() => setOriginFilter("Port Harcourt")}>
          From PH
        </ButtonPrimary>
        <ButtonPrimary onClick={() => setOriginFilter(companyFullName)}>
          From {companyName}
        </ButtonPrimary>
        <ButtonPrimary onClick={() => setOriginFilter("Others")}>
          From Others
        </ButtonPrimary>
      </nav>
      <nav className='mb-5 grid grid-cols-3 md:grid-cols-8 gap-2'>
        {items.map((item, index) => (
          <ButtonPrimary
            classes='bg-red-500'
            key={index}
            onClick={() => setItemFilter(item.name)}
          >
            {item.name}
          </ButtonPrimary>
        ))}
      </nav>
      <DefaultTable tableHeader={trucksHeader} tableData={filteredTrucks} />
    </>
  );
};

export default TrucksList;
