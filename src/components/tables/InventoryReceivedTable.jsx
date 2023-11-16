import { Link } from "react-router-dom";
import InfoAlert from "../alerts/InfoAlert";
import ButtonGroup from "../buttons/ButtonGroup";

export default function InventoryReceivedTable({
	tableHeader,
	tableData,
	setDestinationFilter,
}) {
	return (
		<div class="relative overflow-x-auto">
			<div className="mb-5">
				<ButtonGroup
					onClick1={() => setDestinationFilter("Boko Fertilizer")}
					onClick2={() => setDestinationFilter("Others")}
					child1="Boko Fertilizer"
					child2="Others"
				/>
			</div>
			{tableData.length != 0 ? (
				<table class="w-full border-collapse border rounded-lg text-sm">
					<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
						<tr>
							{tableHeader.map((header, index) => (
								<th
									scope="col"
									class="p-3 text-left bg-blue-500 text-white"
									key={index}>
									{header}
								</th>
							))}
							<th className="p-3 text-left bg-blue-500 text-white">Action</th>
						</tr>
					</thead>
					<tbody>
						{tableData.map((item, index) => {
							const dataEntries = Object.entries(item);
							return (
								<tr
									className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
									key={index}>
									<td class="px-6 py-4 border-r bg-gray-50">{index + 1}</td>
									{dataEntries.map(([key, value]) => {
										if (key === "id") return;
										return (
											<td class="px-6 py-4" key={key}>
												{value}
											</td>
										);
									})}
									<td className="p-3 border-l">
										<Link
											to={`/received/${item.id}`}
											className="hover:underline bg-gray-500 p-2 px-3 text-white w-full inline-block text-center">
											View
										</Link>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			) : (
				<InfoAlert>
					There are currently no Trucks Received, Thank You!
				</InfoAlert>
			)}
		</div>
	);
}
