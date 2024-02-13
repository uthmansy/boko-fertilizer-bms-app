import IMAGES from "../assets/images/Images";
import { companyAddress, companyFullName } from "../constants/company";
import { formatTimestamp } from "../util/functions";

function ReturnWaybill({ payload }) {
  const {
    waybillNumber,
    truckNumber,
    sWaybill,
    dateReceived,
    driverName,
    driverNumber,
    transporter,
    transportFee,
    transportFeeBalance,
    transportFeeFinalBalance,
    transportFeePaidOnReceived,
    item,
    shortage,
    qtyBagsDispatched,
    qtyBagsReceived,
    receivingOfficer,
    origin,
    otherOrigin,
    destination,
    otherDestination,
  } = payload;
  return (
    <div className='p-10 w-[795px] bg-white relative'>
      <div className='absolute flex items-center justify-center h-full w-full top-0 left-0 right-0 bottom-0'>
        <span className='uppercase font-bold text-6xl scale-150 rotate-45 opacity-10'>
          {companyFullName}
        </span>
      </div>
      <div className='mb-10 flex items-center flex-col'>
        <img className='w-24' src={IMAGES.logo} alt='logo' />

        <h1 className='font-black text-3xl uppercase text-center'>
          {companyFullName} Return Waybill
        </h1>
        <div className=''>{companyAddress}</div>
      </div>
      <div className='flex mb-5 space-x-10'>
        <div className='w-1/2'>
          <div>
            <div className='flex space-x-3 mb-2 text-xs'>
              <span className='font-bold'>Received By: </span>
              <div className='flex-grow'>{receivingOfficer}</div>
            </div>
            <div className='flex flex-col space-y-7 mb-2 text-xs'>
              <span className='font-bold'>Signature & Stamp: </span>
              <div className='flex-grow border-b border-black'></div>
            </div>
          </div>
        </div>
        <div className='w-1/2'>
          <h2 className='font-bold mb-5'>Waybill Info:</h2>
          <table className=' w-full border border-gray-500 text-xs text-left text-gray-500 dark:text-gray-400'>
            <tbody>
              <tr className=' border-b border-gray-500 dark:bg-gray-800 dark:border-gray-700'>
                <td
                  scope='row'
                  className='px-2 bg-gray-100 border-r border-gray-500 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                >
                  Waybill Number
                </td>
                <td className='px-2 py-2'>{waybillNumber}</td>
              </tr>
              <tr className=' border-b border-gray-500 dark:bg-gray-800 dark:border-gray-700'>
                <td
                  scope='row'
                  className='bg-gray-100 border-r border-gray-500 px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                >
                  Receiving Date
                </td>
                <td className='px-2 py-2'>{formatTimestamp(dateReceived)}</td>
              </tr>
              <tr className=' border-b border-gray-500 dark:bg-gray-800'>
                <td
                  scope='row'
                  className='bg-gray-100 border-r border-gray-500 px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                >
                  Sancham Waybill
                </td>
                <td className='px-2 py-2'>{sWaybill}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <table className='mb-5 w-full border border-gray-500 text-xs text-left text-gray-500 dark:text-gray-400'>
          <tbody>
            <tr className=' border-b border-gray-500 dark:bg-gray-800'>
              <td
                scope='row'
                className='bg-gray-100 w-48 border-r border-gray-500 px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
              >
                Truck Number
              </td>
              <td className='px-2 py-2'>{truckNumber}</td>
            </tr>

            <tr className=' border-b border-gray-500 dark:bg-gray-800'>
              <td
                scope='row'
                className='bg-gray-100 border-r border-gray-500 px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
              >
                Origin
              </td>
              <td className='px-2 py-2'>
                {origin != "Others" ? origin : otherOrigin}
              </td>
            </tr>
            <tr className=' border-b border-gray-500 dark:bg-gray-800'>
              <td
                scope='row'
                className='bg-gray-100 border-r border-gray-500 px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
              >
                Destination
              </td>
              <td className='px-2 py-2'>
                {destination != "Others" ? destination : otherDestination}
              </td>
            </tr>
            <tr className=' border-b border-gray-500 dark:bg-gray-800'>
              <td
                scope='row'
                className='bg-gray-100 border-r border-gray-500 px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
              >
                Transporter
              </td>
              <td className='px-2 py-2'>{transporter}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <table className='mb-5 w-full border border-gray-500 text-xs text-left text-gray-500 dark:text-gray-400'>
          <tbody>
            <tr className=' border-b border-gray-500 dark:bg-gray-800 dark:border-gray-700'>
              <td
                scope='row'
                className='uppercase bg-gray-100 px-2 border-r border-gray-500 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
              >
                Tranport Fee
              </td>
              <td className='px-2 py-2'>{transportFee}</td>
            </tr>
            <tr className=' border-b border-gray-500 dark:bg-gray-800 dark:border-gray-700'>
              <td
                scope='row'
                className='uppercase bg-gray-100 border-r border-gray-500 px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
              >
                Transport Paid on Received
              </td>
              <td className='px-2 py-2'>{transportFeePaidOnReceived}</td>
            </tr>
            <tr className=' border-b border-gray-500 dark:bg-gray-800 dark:border-gray-700'>
              <td
                scope='row'
                className='uppercase bg-gray-100 border-r border-gray-500 px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
              >
                Initial Transport Fee Balance
              </td>
              <td className='px-2 py-2'>{transportFeeBalance}</td>
            </tr>
            <tr className=' border-b border-gray-500 dark:bg-gray-800 dark:border-gray-700'>
              <td
                scope='row'
                className='uppercase bg-gray-100 border-r border-gray-500 px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
              >
                Final Transport Fee Balance
              </td>
              <td className='px-2 py-2'>{transportFeeFinalBalance}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='flex space-x-3 mb-5'>
        <div className='w-1/3'>
          <table className='text-xs w-full border border-gray-500 text-left text-gray-500 dark:text-gray-400'>
            <tbody>
              <tr className=' border-b border-gray-500 dark:bg-gray-800 dark:border-gray-700'>
                <td
                  scope='row'
                  className='uppercase bg-gray-100 px-2 border-r border-gray-500 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                >
                  Item
                </td>
                <td className='px-2 py-2'>{item}</td>
              </tr>

              <tr className=' border-b border-gray-500 dark:bg-gray-800 dark:border-gray-700'>
                <td
                  scope='row'
                  className='uppercase bg-gray-100 border-r border-gray-500 px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                >
                  Quantity Dispatched (Bags)
                </td>
                <td className='px-2 py-2'>{qtyBagsDispatched}</td>
              </tr>
              <tr className=' border-b border-gray-500 dark:bg-gray-800 dark:border-gray-700'>
                <td
                  scope='row'
                  className='uppercase bg-gray-100 border-r border-gray-500 px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                >
                  Quantity Dispatched (Mts)
                </td>
                <td className='px-2 py-2'>{(qtyBagsDispatched * 50) / 1000}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='w-2/3'>
          <table className=' w-full border border-gray-500 text-xs text-left text-gray-500 dark:text-gray-400'>
            <tbody>
              <tr className=' border-b border-gray-500 dark:bg-gray-800 dark:border-gray-700'>
                <td
                  scope='row'
                  className='uppercase bg-gray-100 px-2 border-r border-gray-500 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                >
                  Unit
                </td>
                <td
                  scope='row'
                  className='uppercase bg-gray-100 px-2 border-r border-gray-500 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                >
                  Quantity Rceived
                </td>
                <td
                  scope='row'
                  className='uppercase bg-gray-100 px-2 border-r border-gray-500 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                >
                  Shortage
                </td>
              </tr>
              <tr className=' border-b border-gray-500 dark:bg-gray-800 dark:border-gray-700'>
                <td
                  scope='row'
                  className='bg-gray-100 border-r border-gray-500 px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                >
                  Bags
                </td>
                <td className='px-2 py-2 border-r border-gray-500 text-center'>
                  {qtyBagsReceived}
                </td>
                <td className='px-2 py-2'>{shortage}</td>
              </tr>
              <tr className=' border-b border-gray-500 dark:bg-gray-800 dark:border-gray-700'>
                <td
                  scope='row'
                  className='bg-gray-100 border-r border-gray-500 px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                >
                  MTS
                </td>
                <td className='px-2 py-2 border-r border-gray-500 text-center'>
                  {(qtyBagsReceived * 50) / 1000}
                </td>
                <td className='px-2 py-2'>{(shortage * 50) / 1000}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className='mt-10 text-xs'>
        <h2 className='font-bold mb-5 uppercase'>Driver Details:</h2>
        <div className='flex w-full'>
          <div className='flex flex-col space-y-2 flex-grow text-xs mb-5'>
            <span className='font-bold uppercase text-xs'>Name: </span>
            <div className='flex-grow'>{driverName}</div>
          </div>
          <div className='flex flex-col space-y-2 flex-grow text-xs mb-5'>
            <span className='font-bold uppercase'>Phone Number: </span>
            <div className='flex-grow'>{driverNumber}</div>
          </div>
          <div className='flex flex-col space-y-7 flex-grow text-xs'>
            <span className='font-bold uppercase'>Signature: </span>
            <div className='flex-grow border-b border-gray-500'></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ReturnWaybill as default };
