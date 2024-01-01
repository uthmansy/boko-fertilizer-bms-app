import { createContext, useContext, useEffect, useState } from "react";
import { fetchAllItems } from "../util/crud";
import { useQuery } from "react-query";

const ItemsContext = createContext();

export function useItems() {
  return useContext(ItemsContext);
}

export function ItemsProvider({ children }) {
  const [items, setItems] = useState([]);
  const { data } = useQuery("getItems", fetchAllItems);

  useEffect(() => {
    data && setItems(data);
  }, [data]);

  const value = {
    items,
  };

  return (
    <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
  );
}
