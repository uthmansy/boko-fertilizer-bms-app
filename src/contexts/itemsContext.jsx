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
		},
		{
			name: "DAP",
			code: "02",
		},
		{
			name: "GAS",
			code: "03",
		},
		{
			name: "UREA",
			code: "04",
		},
		{
			name: "LSG",
			code: "05",
		},
		{
			name: "NPK20:10:10",
			code: "06",
		},
		{
			name: "NPK20:10:10+s",
			code: "07",
		},
		{
			name: "NPK15:15:15",
			code: "08",
		},
		{
			name: "NPK27:13:13",
			code: "09",
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
