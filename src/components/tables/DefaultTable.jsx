import InfoAlert from "../alerts/InfoAlert";

export default function DefaultTable({ tableHeader, tableData }) {
  return tableData.length !== 0 ? (
    <div className='relative overflow-x-auto'>
      <table className='w-full scale-75 origin-top-left sm:scale-100  text-sm text-left text-gray-500 dark:text-gray-400'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
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
              <tr
                className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
                key={index}
              >
                <td className='px-6 py-4'>{index + 1}</td>
                {dataEntries.map(([key, value]) => (
                  <td className='px-6 py-4' key={key}>
                    {value}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <InfoAlert>This List is Currently Empty</InfoAlert>
  );
}
