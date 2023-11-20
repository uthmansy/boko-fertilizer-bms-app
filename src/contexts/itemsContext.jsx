import { createContext, useContext, useEffect, useState } from "react";
import { fetchAllItems } from "../util/crud";

const ItemsContext = createContext();

export function useItems() {
  return useContext(ItemsContext);
}

export function ItemsProvider({ children }) {
  const defaultItems = [
    {
      name: "MOP",
      code: "01",
      type: "raw",
    },
    {
      name: "DAP",
      code: "02",
      type: "raw",
    },
    {
      name: "GAS",
      code: "03",
      type: "raw",
    },
    {
      name: "UREA",
      code: "04",
      type: "raw",
    },
    {
      name: "LSG",
      code: "05",
      type: "raw",
    },
    {
      name: "NPK20:10:10",
      code: "AA",
      type: "product",
    },
    {
      name: "NPK20:10:10+s",
      code: "BB",
      type: "product",
    },
    {
      name: "NPK15:15:15",
      code: "CC",
      type: "product",
    },
    {
      name: "NPK27:13:13",
      code: "DD",
      type: "product",
    },
  ];
  const [items, setItems] = useState(defaultItems);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const allItems = await fetchAllItems();
        setItems(allItems);
      } catch (error) {
        setItems(defaultItems);
      }
    };

    fetchItems();
  }, []);

  const value = {
    items,
  };

  return (
    <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
  );
}
