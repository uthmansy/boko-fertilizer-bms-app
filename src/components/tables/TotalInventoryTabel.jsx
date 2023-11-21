export default function TotalInventoryTable({ item, tableHeader, tableData }) {
  return (
    <div className='bg-white overflow-x-auto shadow-lg'>
      <table className='w-full text-sm text-left text-gray-500'>
        <thead className='text-xs text-white uppercase bg-teal-500 shadow-lg'>
          <tr className='border-b'>
            <th scope='col' className='px-6 py-3'>
              {item}
            </th>
            {tableHeader.map((header, index) => (
              <th scope='col' className='px-6 py-3' key={index}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, index) => {
            const dataEntries = Object.entries(item);
            return (
              <tr className='bg-white border-b border-grey-700' key={index}>
                {dataEntries.map(([key, value]) => (
                  <td
                    className={`px-6 py-4 border-b border-r border-gray-300 text-gray-500 ${
                      (key === "totalReceived" ||
                        key === "totalDispatched" ||
                        key === "balance") &&
                      "bg-gray-200 font-bold"
                    }`}
                    key={key}
                  >
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
