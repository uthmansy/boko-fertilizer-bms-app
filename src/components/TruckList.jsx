import { useState } from "react";
import { useItems } from "../contexts/itemsContext";
import ButtonPrimary from "./buttons/ButtonPrimary";
import DefaultTable from "./tables/DefaultTable";
import { useAuth } from "../contexts/authContext";

const TrucksList = ({ allTrucks, trucksHeader }) => {
  const { items } = useItems();
  const { user } = useAuth();

  const [filteredTrucks, setFilteredTrucks] = useState(allTrucks);

  const filterDestination = (destination) => {
    const filteredTrucks = allTrucks.filter((truck) => {
      if (destination === "Boko Fertilizer") {
        return truck.destination === "Boko Fertilizer";
      } else return truck.destination != "Boko Fertilizer";
    });
    console.log(filteredTrucks);

    setFilteredTrucks(filteredTrucks);
  };

  const filterOrigin = (origin) => {
    const filteredTrucks = allTrucks.filter((truck) => {
      return origin === "Port Harcourt"
        ? truck.origin === "Port Harcourt"
        : origin === "Boko Fertilizer"
        ? truck.origin === "Boko Fertilizer"
        : truck.origin !== "Boko Fertilizer" &&
          truck.origin !== "Port Harcourt";
    });
    setFilteredTrucks(filteredTrucks);
  };

  const filterItem = (item) => {
    const filteredTrucks = allTrucks.filter((truck) => {
      return truck.item === item;
    });
    setFilteredTrucks(filteredTrucks);
  };

  return (
    <>
      <nav className='mb-2 grid grid-cols-3 md:grid-cols-8 gap-2'>
        <ButtonPrimary onClick={() => setFilteredTrucks(allTrucks)}>
          All
        </ButtonPrimary>
        <ButtonPrimary onClick={() => filterDestination("Boko Fertilizer")}>
          To Boko
        </ButtonPrimary>
        {(user.role === "admin" || user.role === "logistics") && (
          <ButtonPrimary onClick={() => filterDestination("Others")}>
            To Others
          </ButtonPrimary>
        )}

        <ButtonPrimary onClick={() => filterOrigin("Port Harcourt")}>
          From PH
        </ButtonPrimary>
        <ButtonPrimary onClick={() => filterOrigin("Boko Fertilizer")}>
          From Boko
        </ButtonPrimary>
        <ButtonPrimary onClick={() => filterOrigin("Others")}>
          From Others
        </ButtonPrimary>
      </nav>
      <nav className='mb-5 grid grid-cols-3 md:grid-cols-8 gap-2'>
        {items.map((item, index) => (
          <ButtonPrimary
            classes='bg-red-500'
            key={index}
            onClick={() => filterItem(item.name)}
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
