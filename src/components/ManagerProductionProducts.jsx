import { useState } from "react";
import { getInventoryItems } from "../util/crud";
import Spinner from "./Spinner";
import { useEffect } from "react";

const ManagerProductionProducts = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Fetch product items
		getInventoryItems("product")
			.then((items) => {
				setProducts(items);
				setLoading(false);
			})
			.catch((err) => {
				setError(err);
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<div className="text-center mt-8 h-20 w-full flex items-center justify-center">
				<Spinner />
			</div>
		);
	}

	if (error) {
		return <div className="text-center mt-8 text-red-600">{error.message}</div>;
	}

	return (
		<div className="grid grid-cols-2 gap-4">
			{products.map((product) => (
				<div
					key={product.id}
					className="border border-gray-200 rounded-md shadow-md p-4 bg-white text-sm">
					<h2 className="text-xl font-semibold">{product.name}</h2>
					<table className="mt-4 w-full">
						<tbody>
							<tr className="border-b border-gray-200">
								<td className="py-2 font-bold">
									Available in Production (bags):
								</td>
								<td className="py-2">{product.availableInProduction} Bags</td>
								<td className="py-2">
									{(product.availableInProduction * 50) / 1000} Tons
								</td>
							</tr>
							<tr className="border-b border-gray-200">
								<td className="py-2 font-bold">Delivered to Store:</td>
								<td className="py-2">{product.deliveredToStore} Bags</td>
								<td className="py-2">
									{(product.deliveredToStore * 50) / 1000} Tons
								</td>
							</tr>
							<tr>
								<td className="py-2 font-bold">Quantity Produced:</td>
								<td className="py-2">{product.quantityProduced} Bags</td>
								<td className="py-2">
									{(product.quantityProduced * 50) / 1000} Tons
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			))}
		</div>
	);
};

export default ManagerProductionProducts;
