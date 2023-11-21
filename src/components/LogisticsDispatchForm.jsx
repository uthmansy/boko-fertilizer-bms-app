import { useEffect, useState } from "react";
import {
  bagsToMetricTonnes,
  generateWaybillNumber,
  getDateTimestamp,
  moneyStringToNumber,
} from "../util/functions";
import { useAuth } from "../contexts/authContext";
import {
  createNewDispatch,
  createNewSaleDispatch,
  getDispatchTransactions,
  getLastWaybillSequence,
  getTransactions,
} from "../util/crud";
import DangerAlert from "./alerts/DangerAlert";
import { useItems } from "../contexts/itemsContext";
import { useMenu } from "../contexts/menuContext";
import ButtonPrimary from "./buttons/ButtonPrimary";

export default function LogisticsDispatchForm({ setNewDispatch }) {
  const { items: allItems } = useItems();
  const itemsMap = {};
  for (const item of allItems) {
    itemsMap[item.name] = item.code;
  }

  const codeMappings = {
    origin: {
      "Port Harcourt": "PH",
      Lagos: "LG",
      Abuja: "AB",
      // Add more mappings as needed
    },
    destination: {
      "Boko Fertilizer": "BKF",
      // Add more mappings as needed
    },
    items: {
      ...itemsMap,
    },
  };

  const { setIsMenuOpen } = useMenu();

  useEffect(() => {
    setIsMenuOpen(false);
  }, []);

  const [dateLoaded, setDateLoaded] = useState("");
  const [origin, setOrigin] = useState("Port Harcourt");
  const [otherOrigin, setOtherOrigin] = useState("");
  const [destination, setDestination] = useState("Boko Fertilizer");
  const [otherDestination, setOtherDestination] = useState("");
  const [item, setItem] = useState("");
  const [otherItem, setOtherItem] = useState("");
  const [itemType, setItemType] = useState("raw");
  const [itemCode, setItemCode] = useState(codeMappings.items[item] || "00");
  const [truckNumber, setTruckNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverNumber, setDriverNumber] = useState("");
  const [sWaybill, setSWaybill] = useState("");
  const [transporter, setTransporter] = useState("");
  const [transportFee, setTransportFee] = useState("₦");
  const [transportFeePaid, setTransportFeePaid] = useState("₦");
  const [transportFeeBalance, setTransportFeeBalance] = useState("₦0");
  const [transportFeeNumericBalance, setTransportFeeNumericBalance] =
    useState(0);
  const [transportFeePaidStatus, setTransportFeePaidStatus] =
    useState("Not Fully Paid");
  const [qtyBagsDispatched, setQtyBagsDispatched] = useState("");
  const [qtyMtsDispatched, setQtyMtsDispatched] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const [orders, setOrders] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingError, setIsLoadingError] = useState(false);

  const areAllFieldsFilled = () => {
    return (
      origin != "" &&
      dateLoaded != "" &&
      orderNumber != "" &&
      destination != "" &&
      transporter != "" &&
      item != "" &&
      itemType != "" &&
      itemCode != "" &&
      truckNumber != "" &&
      driverName != "" &&
      driverNumber != "" &&
      sWaybill != "" &&
      transportFeePaid != "" &&
      transportFee != "" &&
      qtyBagsDispatched != "" &&
      qtyMtsDispatched != "" &&
      transportFeeNumericBalance >= 0 &&
      !isCreating
    );
  };

  const itemTypes = ["Raw Material", "Product"];
  const origins = ["Port Harcourt", "Lagos", "Others"];
  const destinations = ["Boko Fertilizer", "Others"];
  const transportFeeStatuses = ["Not Fully Paid", "Fully Paid"];

  const { user } = useAuth();

  useEffect(() => {
    setIsLoading(true);
    const fetchTransactions = async () => {
      try {
        // fetch transactions
        const transactions = await getDispatchTransactions("others", null);

        // Create a new data structure filtering items where quantity - taken > 0
        const orders = transactions
          .map((transaction) => ({
            orderNumber: transaction.orderNumber,
            items: transaction.itemsPurchased
              ? transaction.itemsPurchased.filter(
                  (item) => item.quantity - (item.taken || 0) > 0
                )
              : transaction.itemsSold.filter(
                  (item) => item.quantity - (item.taken || 0) > 0
                ),
          }))
          .filter((order) => order.items.length != 0);

        setOrders(orders);
      } catch (error) {
        setIsLoadingError(true);
        throw error;
      }
      setIsLoading(false);
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    setItemCode(codeMappings.items[item] || "00");
  }, [item, orderNumber]);

  useEffect(() => {
    setItem(
      orders.find((order) => order.orderNumber === orderNumber)?.items[0].itemId
    );
  }, [orderNumber]);

  useEffect(() => {
    const addCommas = (value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const numericBalance =
      moneyStringToNumber(transportFee) - moneyStringToNumber(transportFeePaid);
    setTransportFeeNumericBalance(numericBalance);
    const stringBalance = numericBalance.toString();
    const formattedBalance = `₦${addCommas(stringBalance)}`;
    setTransportFeeBalance(formattedBalance);
    numericBalance === 0
      ? setTransportFeePaidStatus("Fully Paid")
      : setTransportFeePaidStatus("Not Fully Paid");
  }, [transportFee, transportFeePaid]);

  const handleSubmit = async (e) => {
    setIsCreating(true);
    e.preventDefault();
    const lastSequenceNumber = await getLastWaybillSequence(item);
    const sequenceNumber = lastSequenceNumber + 1;
    const waybillNumber = generateWaybillNumber({
      origin,
      destination,
      item,
      sequenceNumber,
    });
    const newDispatchData = {
      dateLoaded: getDateTimestamp(dateLoaded),
      origin,
      orderNumber,
      otherOrigin,
      destination,
      otherDestination,
      item,
      otherItem,
      itemType,
      itemCode,
      truckNumber,
      driverName,
      driverNumber,
      sWaybill,
      transporter,
      transportFee,
      transportFeePaid,
      transportFeeBalance,
      transportFeeNumericBalance,
      transportFeePaidStatus,
      qtyBagsDispatched,
      qtyMtsDispatched,
      qtyBagsReceived: 0,
      qtyMtsReceived: 0,
      status: "transit",
      transportFeePaidOnReceived: "₦0",
      sequenceNumber,
      sWaybill,
      waybillNumber,
      shortage: 0,
      releaseOrder: null,
      dateReceived: null,
      receivingOfficer: null,
      receivingOfficerPhone: null,
      dispatchOfficer: user.name,
      dispatchOfficerPhone: user.phone,
    };
    try {
      if (newDispatchData.orderNumber.charAt(0) === "S") {
        await createNewSaleDispatch(newDispatchData);
      } else {
        await createNewDispatch(newDispatchData);
      }
      console.log(newDispatchData);
      setNewDispatch(newDispatchData);
    } catch (error) {
      console.error(error);
      setIsLoadingError(true);
      setIsCreating(false);
    }
  };

  return isLoading ? (
    "loading..."
  ) : isLoadingError ? (
    <div className='bg-white p-5'>
      Error Creating Dispatch{" "}
      <ButtonPrimary onClick={() => setIsLoadingError(false)}>
        Try Again
      </ButtonPrimary>{" "}
    </div>
  ) : (
    <div>
      <section className='max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800'>
        <h2 className='text-lg font-semibold text-gray-700 capitalize dark:text-white'>
          Create a New Dispatch
        </h2>

        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2'>
            <div>
              <label
                className='text-gray-700 dark:text-gray-200'
                for='username'
              >
                Order Number
              </label>
              <div className='relative'>
                <select
                  className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring appearance-none '
                  value={orderNumber}
                  onChange={(e) => {
                    setOrderNumber(e.target.value);
                  }}
                >
                  <option value=''>Select an order</option>
                  {orders?.map((order, index) => (
                    <option key={index} value={order.orderNumber}>
                      {order.orderNumber}
                    </option>
                  ))}
                </select>
                <span className='border-body-color absolute right-4 top-1/2 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2'></span>
              </div>
            </div>
            <div>
              <label
                className='text-gray-700 dark:text-gray-200'
                for='username'
              >
                Date Loaded
              </label>
              <input
                type='date'
                value={dateLoaded}
                onChange={(e) => {
                  setDateLoaded(e.target.value);
                }}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
              />
            </div>
            <div>
              <label className='text-gray-700 dark:text-gray-200'>Item</label>
              <div className='relative'>
                <select
                  value={item}
                  onChange={(e) => {
                    setItem(e.target.value);
                  }}
                  className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring appearance-none '
                >
                  {orders
                    .find((order) => order.orderNumber === orderNumber)
                    ?.items.map((item, index) => (
                      <option key={index} value={item.itemId}>
                        {item.itemId}
                      </option>
                    ))}
                  {/* {items.map((item) => (
										<option value={item}>{item}</option>
									))} */}
                </select>
                <span className='border-body-color absolute right-4 top-1/2 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2'></span>
              </div>
              {item === "Others" && (
                <div>
                  <label
                    className='text-gray-700 dark:text-gray-200'
                    for='username'
                  >
                    Other Item
                  </label>
                  <input
                    type='text'
                    value={otherItem}
                    onChange={(e) => setOtherItem(e.target.value)}
                    className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
                  />
                </div>
              )}
            </div>

            <div>
              <label className='text-gray-700 dark:text-gray-200'>
                Item Code
              </label>
              <div className='relative'>
                <select
                  value={itemCode}
                  // onChange={(e) => setItem(e.target.value)}
                  className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring appearance-none '
                >
                  {allItems?.map((item) => (
                    <option value={item.code}>{item.code}</option>
                  ))}
                </select>
                <span className='border-body-color absolute right-4 top-1/2 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2'></span>
              </div>
            </div>
            <div>
              <label className='text-gray-700 dark:text-gray-200'>
                Item Type
              </label>
              <div className='relative'>
                <select
                  value={itemType}
                  onChange={(e) => {
                    setItemType(e.target.value);
                  }}
                  className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring appearance-none '
                >
                  {itemTypes.map((itemType) => (
                    <option value={itemType}>{itemType}</option>
                  ))}
                </select>
                <span className='border-body-color absolute right-4 top-1/2 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2'></span>
              </div>
            </div>
            <div>
              <label
                className='text-gray-700 dark:text-gray-200'
                for='username'
              >
                Number Of Bags
              </label>
              <input
                type='text'
                value={qtyBagsDispatched}
                onChange={(e) => {
                  const input = e.target.value;
                  const numericInput = input.replace(/[^0-9]/g, "");
                  setQtyBagsDispatched(numericInput);
                  setQtyMtsDispatched(bagsToMetricTonnes(numericInput));
                }}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
              />
            </div>
            <div>
              <label
                className='text-gray-700 dark:text-gray-200'
                for='username'
              >
                Metric Tons
              </label>
              <input
                type='text'
                value={qtyMtsDispatched}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
              />
            </div>
            <div>
              <label className='text-gray-700 dark:text-gray-200'>Origin</label>
              <div className='relative'>
                <select
                  value={origin}
                  onChange={(e) => {
                    setOrigin(e.target.value);
                  }}
                  className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring appearance-none '
                >
                  {origins.map((origin) => (
                    <option value={origin}>{origin}</option>
                  ))}
                </select>
                <span className='border-body-color absolute right-4 top-1/2 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2'></span>
              </div>
              {origin === "Others" && (
                <div>
                  <label
                    className='text-gray-700 dark:text-gray-200'
                    for='username'
                  >
                    Other Origin
                  </label>
                  <input
                    type='text'
                    value={otherOrigin}
                    onChange={(e) => setOtherOrigin(e.target.value)}
                    className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
                  />
                </div>
              )}
            </div>

            <div>
              <label className='text-gray-700 dark:text-gray-200'>
                Destination
              </label>
              <div className='relative'>
                <select
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                  }}
                  className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring appearance-none '
                >
                  {destinations.map((destination) => (
                    <option value={destination}>{destination}</option>
                  ))}
                </select>
                <span className='border-body-color absolute right-4 top-1/2 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2'></span>
              </div>
              {destination === "Others" && (
                <div>
                  <label
                    className='text-gray-700 dark:text-gray-200'
                    for='username'
                  >
                    Other Destination
                  </label>
                  <input
                    type='text'
                    value={otherDestination}
                    onChange={(e) => setOtherDestination(e.target.value)}
                    className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
                  />
                </div>
              )}
            </div>

            <div>
              <label
                className='text-gray-700 dark:text-gray-200'
                for='username'
              >
                Truck Number
              </label>
              <input
                type='text'
                value={truckNumber}
                onChange={(e) => setTruckNumber(e.target.value)}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
              />
            </div>
            <div>
              <label
                className='text-gray-700 dark:text-gray-200'
                for='username'
              >
                Driver Name
              </label>
              <input
                type='text'
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
              />
            </div>
            <div>
              <label
                className='text-gray-700 dark:text-gray-200'
                for='username'
              >
                Driver Number
              </label>
              <input
                type='text'
                value={driverNumber}
                onChange={(e) => setDriverNumber(e.target.value)}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
              />
            </div>
            <div>
              <label
                className='text-gray-700 dark:text-gray-200'
                for='username'
              >
                Sancham Waybill
              </label>
              <input
                type='text'
                value={sWaybill}
                onChange={(e) => setSWaybill(e.target.value)}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
              />
            </div>
            <div>
              <label
                className='text-gray-700 dark:text-gray-200'
                for='username'
              >
                Transporter
              </label>
              <input
                type='text'
                value={transporter}
                onChange={(e) => setTransporter(e.target.value)}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
              />
            </div>
            <div>
              <label
                className='text-gray-700 dark:text-gray-200'
                for='username'
              >
                Transport Fee
              </label>
              <input
                type='text'
                value={transportFee}
                onChange={(e) => {
                  const addCommas = (value) =>
                    value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                  const input = e.target.value;
                  const numericInput = input.replace(/[^0-9]/g, "");
                  const formattedInput = `₦${addCommas(numericInput)}`;
                  setTransportFee(formattedInput);
                }}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
              />
            </div>
            <div>
              <label
                className='text-gray-700 dark:text-gray-200'
                for='username'
              >
                Transport Fee Paid
              </label>
              <input
                type='text'
                value={transportFeePaid}
                onChange={(e) => {
                  const addCommas = (value) =>
                    value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                  const input = e.target.value;
                  const numericInput = input.replace(/[^0-9]/g, "");
                  const formattedInput = `₦${addCommas(numericInput)}`;
                  setTransportFeePaid(formattedInput);
                }}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
              />
            </div>
            <div>
              <label
                className='text-gray-700 dark:text-gray-200'
                for='username'
              >
                Transport Fee Balance
              </label>
              <input
                type='text'
                value={transportFeeBalance}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
              />
              {transportFeeNumericBalance < 0 && (
                <DangerAlert>Balance Cannot Be less than zero</DangerAlert>
              )}
            </div>
            <div>
              <label className='text-gray-700 dark:text-gray-200'>
                Transport Fee Status
              </label>
              <div className='relative'>
                <select
                  value={transportFeePaidStatus}
                  className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring appearance-none '
                >
                  {transportFeeStatuses.map((status) => (
                    <option value={status}>{status}</option>
                  ))}
                </select>
                <span className='border-body-color absolute right-4 top-1/2 mt-[-2px] h-[10px] w-[10px] -translate-y-1/2 rotate-45 border-r-2 border-b-2'></span>
              </div>
            </div>
          </div>

          <div className='flex justify-end mt-6'>
            <button
              disabled={!areAllFieldsFilled()}
              className='disabled:bg-gray-400 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600'
            >
              {isCreating ? (
                <svg
                  className='w-6 h-6 animate-spin text-gray-800 dark:text-white'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 18 20'
                >
                  <path
                    stroke='white'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='1.2'
                    d='M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97'
                  />
                </svg>
              ) : (
                "Generate Waybill"
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
