import { useNavigate, useParams } from "react-router-dom";
import ButtonPrimaryIcon from "../../components/buttons/ButtonPrimaryIcon";
import { useEffect, useState } from "react";
import { getTruckById, receiveTruck } from "../../util/crud";
import ContentLoader from "../../components/ContentLoader";
import InfoAlert from "../../components/alerts/InfoAlert";
import Modal from "../../components/Modal";
import { useAuth } from "../../contexts/authContext";
import {
  bagsToMetricTonnes,
  getDateTimestamp,
  moneyStringToNumber,
} from "../../util/functions";
import TruckInfo from "../../components/TruckInfo";
import { useQueryClient } from "react-query";

function ReceiveTruck() {
  const { truckId } = useParams();
  const navigate = useNavigate();

  const [truck, setTruck] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingError, setIsLoadingError] = useState(null);

  useEffect(() => {
    const getTruck = async () => {
      try {
        setIsLoading(true);
        console.log(truckId);
        const truck = await getTruckById(truckId);
        setTruck(truck);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setIsLoadingError(error.message);
        console.error(error);
      }
    };
    getTruck();
  }, [truckId]);

  return (
    <div>
      <div className='mb-10'>
        <ButtonPrimaryIcon
          icon={
            <svg
              className='w-6 h-6 text-gray-800 dark:text-white'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 14 10'
            >
              <path
                stroke='white'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='1.2'
                d='M13 5H1m0 0 4 4M1 5l4-4'
              />
            </svg>
          }
          onClick={() => navigate(-1)}
        >
          Back
        </ButtonPrimaryIcon>
      </div>
      {isLoading ? (
        <div className='h-screen'>
          <ContentLoader />
        </div>
      ) : isLoadingError ? (
        isLoadingError
      ) : truck.status === "transit" ? (
        <div className='flex space-x-5'>
          <div className='w-1/2 p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800'>
            <TruckInfo truck={truck} />
          </div>
          <div className='w-1/2'>
            <ReceiveForm truck={truck} truckId={truckId} />
          </div>
        </div>
      ) : (
        <InfoAlert>This Truck has already been received</InfoAlert>
      )}
    </div>
  );
}

const ReceiveForm = ({ truck, truckId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    qtyBagsDispatched,
    item,
    transportFeeNumericBalance,
    transportFeeBalance,
    destination,
  } = truck;

  const [qtyBagsReceived, setQtyBagsReceived] = useState();
  const [dateReceived, setDateReceived] = useState();
  const [qtyMtsReceived, setQtyMtsReceived] = useState();
  const [transportFeePaidOnReceived, setTransportFeePaidOnReceived] =
    useState("₦");
  const [transportFeeFinalBalance, setTransportFeeFinalBalance] =
    useState("₦0");
  const [transportFeeFinalBalanceNumeric, setTransportFeeFinalBalanceNumeric] =
    useState(transportFeeNumericBalance);
  const [shortage, setShortage] = useState(0);
  const [isReceiving, setIsReceiving] = useState(false);
  const [showTransportFees, setShowTransportFees] = useState(false);
  const [modalData, setModalData] = useState({
    isOpen: false,
    message: "",
    isError: false,
  });

  const areAllFieldsFilled = () => {
    return qtyBagsReceived && qtyMtsReceived && !isReceiving && dateReceived;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsReceiving(true);
    const receivedData = {
      qtyBagsReceived,
      qtyMtsReceived,
      dateReceived: getDateTimestamp(dateReceived),
      shortage,
      receivingOfficer: user.name,
      transportFeeFinalBalanceNumeric,
      transportFeeFinalBalance,
      transportFeePaidOnReceived,
      item,
      transportFeePaidStatus:
        transportFeeFinalBalanceNumeric == 0 ? "Fully Paid" : "Not Fully Paid",
    };
    try {
      await receiveTruck(truckId, receivedData, destination);
      queryClient.invalidateQueries("getAllTransitTrucks");

      setModalData({
        isOpen: true,
        message: "Truck Received Successfully",
        isError: false,
      });
    } catch (error) {
      console.log(error);
      setIsReceiving(false);
      setModalData({
        isOpen: true,
        message: error.message,
        isError: true,
      });
    }
  };

  useEffect(() => {
    setShortage(parseInt(qtyBagsDispatched) - parseInt(qtyBagsReceived) || 0);
  }, [qtyBagsReceived]);

  useEffect(() => {
    setShowTransportFees(transportFeeNumericBalance != 0);
  }, [transportFeeNumericBalance]);

  useEffect(() => {
    const addCommas = (value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const numericBalance =
      moneyStringToNumber(transportFeeBalance) -
      moneyStringToNumber(transportFeePaidOnReceived);
    setTransportFeeFinalBalanceNumeric(numericBalance);
    const stringBalance = numericBalance.toString();
    const formattedBalance = `₦${addCommas(stringBalance)}`;
    setTransportFeeFinalBalance(formattedBalance);
  }, [transportFeePaidOnReceived]);

  return (
    <div>
      <section className='max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800'>
        <h2 className='text-lg font-semibold text-gray-700 capitalize dark:text-white'>
          Receive a Truck
        </h2>

        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2'>
            <div>
              <label
                className='text-gray-700 dark:text-gray-200'
                for='username'
              >
                Date Received
              </label>
              <input
                type='date'
                value={dateReceived}
                onChange={(e) => {
                  setDateReceived(e.target.value);
                }}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
              />
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
                value={qtyBagsReceived}
                onChange={(e) => {
                  const input = e.target.value;
                  const numericInput = input.replace(/[^0-9]/g, "");
                  setQtyBagsReceived(numericInput);
                  setQtyMtsReceived(bagsToMetricTonnes(numericInput));
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
                value={qtyMtsReceived}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
              />
            </div>
            <div>
              <label
                className='text-gray-700 dark:text-gray-200'
                for='username'
              >
                Shortage
              </label>
              <input
                type='text'
                value={shortage}
                className='block w-full px-4 py-2 mt-2 text-red-700 bg-white border border-red-200 rounded-md dark:bg-red-800 dark:text-red-300 dark:border-red-600 focus:border-red-400 focus:ring-red-300 focus:ring-opacity-40 dark:focus:border-red-300 focus:outline-none focus:ring'
              />
            </div>
            {showTransportFees && (
              <div>
                <label
                  className='text-gray-700 dark:text-gray-200'
                  for='username'
                >
                  Received Transport Fee
                </label>
                <input
                  type='text'
                  value={transportFeePaidOnReceived}
                  onChange={(e) => {
                    const addCommas = (value) =>
                      value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                    const input = e.target.value;
                    const numericInput = input.replace(/[^0-9]/g, "");
                    const formattedInput = `₦${addCommas(numericInput)}`;
                    setTransportFeePaidOnReceived(formattedInput);
                  }}
                  className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
                />
              </div>
            )}

            {showTransportFees && (
              <div>
                <label
                  className='text-gray-700 dark:text-gray-200'
                  for='username'
                >
                  Final Balance
                </label>
                <input
                  type='text'
                  value={transportFeeFinalBalance}
                  onChange={(e) => {
                    const addCommas = (value) =>
                      value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                    const input = e.target.value;
                    const numericInput = input.replace(/[^0-9]/g, "");
                    const formattedInput = `₦${addCommas(numericInput)}`;
                    setTransportFeeFinalBalance(formattedInput);
                  }}
                  className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
                />
              </div>
            )}
          </div>

          <div className='flex justify-end mt-6'>
            <button
              disabled={!areAllFieldsFilled()}
              className='disabled:bg-gray-400 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600'
            >
              {isReceiving ? (
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
                "Receive"
              )}
            </button>
          </div>
        </form>
      </section>
      {modalData.isOpen && (
        <Modal
          modalData={modalData}
          setModalData={setModalData}
          onClose={() => navigate(`/transit/waybill/${truckId}`)}
        />
      )}
    </div>
  );
};

export { ReceiveTruck as default };
