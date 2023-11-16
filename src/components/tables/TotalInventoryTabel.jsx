export default function TotalInventoryTable({ item, tableHeader, tableData }) {
	return (
		<div class="bg-white overflow-hidden rounded-md shadow-lg">
			<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<thead class="text-xs text-white uppercase bg-yellow-500 dark:bg-gray-700 dark:text-gray-400 shadow-lg">
					<tr className="border-b">
						<th scope="col" class="px-6 py-3">
							{item}
						</th>
						{tableHeader.map((header, index) => (
							<th scope="col" class="px-6 py-3" key={index}>
								{header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{tableData.map((item, index) => {
						const dataEntries = Object.entries(item);
						return (
							<tr
								className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
								key={index}>
								{dataEntries.map(([key, value]) => (
									<td
										class={`px-6 py-4 border-r text-red-500 ${
											(key === "totalReceived" ||
												key === "totalDispatched" ||
												key === "balance") &&
											"bg-gray-50 font-bold"
										}`}
										key={key}>
										{value}
									</td>
								))}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
