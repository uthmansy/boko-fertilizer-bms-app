import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteTruckData, getTruckById, updateTruckData } from "../util/crud";
import TruckInfo from "./TruckInfo";
import ButtonPrimary from "./buttons/ButtonPrimary";
import { getDateTimestamp } from "../util/functions";
import Modal from "./Modal";
import Alert from "./Alert";

export default function EditTruck() {
  const { truckId } = useParams();
  const navigate = useNavigate();

  const origins = ["Port Harcourt", "Lagos", "Others"];
  const destinations = ["Boko Fertilizer", "Others"];

  const codeMappings = {
    origin: {
      "Port Harcourt": "PH",
      Lagos: "LG",
      Abuja: "AB",
      Others: "OTH",
    },
    destination: {
      "Boko Fertilizer": "BKF",
      Others: "OTH", // Add more mappings as needed
    },
    items: {},
  };

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isError, setIsError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [truck, setTruck] = useState(null);
  const [dateLoaded, setDateLoaded] = useState("");
  const [dateReceived, setDateReceived] = useState(null);
  const [truckNumber, setTruckNumber] = useState("");
  const [sWaybill, setSWaybill] = useState("");
  const [waybillNumber, setWaybilNumber] = useState("");
  const [origin, setOrigin] = useState("");
  const [otherOrigin, setOtherOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [otherDestination, setOtherDestination] = useState("");
  const [modalData, setModalData] = useState({
    isOpen: false,
    message: "",
    isError: false,
  });
  const [alertData, setAlertData] = useState({
    isOpen: false,
    message: "",
  });

  const handleDateLoadedChange = (e) => {
    setDateLoaded(e.target.value);
    checkFormValidity();
  };
  const handleDateReceived = (e) => {
    setDateReceived(e.target.value);
    checkFormValidity();
  };

  const handleTruckNumberChange = (e) => {
    setTruckNumber(e.target.value);
    checkFormValidity();
  };

  const handlesWaybillChange = (e) => {
    setSWaybill(e.target.value);
    checkFormValidity();
  };

  const handleOriginChange = (e) => {
    setOrigin(e.target.value);
    let newOriginCode = codeMappings.origin[e.target.value];

    // Using regular expression to match everything up to the first hyphen
    let newWaybillNumber = waybillNumber.replace(/^[^-]+/, newOriginCode);
    setWaybilNumber(newWaybillNumber);
    checkFormValidity();
  };
  const handleOtherOriginChange = (e) => {
    setOtherOrigin(e.target.value);
  };
  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
    let newDestinationCode = codeMappings.destination[e.target.value];

    // Using regular expression to match everything up to the first hyphen
    let newWaybillNumber = waybillNumber.replace(
      /-[^-]+/,
      `-${newDestinationCode}`
    );
    setWaybilNumber(newWaybillNumber);
    checkFormValidity();
  };
  const handleOtherDestinationChange = (e) => {
    setOtherDestination(e.target.value);
    checkFormValidity();
  };

  const setDefaultValues = () => {
    setDateLoaded(
      new Date((truck.dateLoaded.seconds + 12 * 60 * 60) * 1000)
        .toISOString()
        .split("T")[0]
    );
    truck.dateReceived &&
      setDateReceived(
        new Date((truck.dateReceived.seconds + 12 * 60 * 60) * 1000)
          .toISOString()
          .split("T")[0]
      );
    setTruckNumber(truck.truckNumber);
    setOrigin(truck.origin);
    setOtherOrigin(truck.otherOrigin);
    setDestination(truck.destination);
    setOtherDestination(truck.otherDestination);
    setSWaybill(truck.sWaybill);
    setWaybilNumber(truck.waybillNumber);
  };

  const checkFormValidity = () => {
    const isValid = dateLoaded !== "";
    setIsFormValid(isValid);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      dateLoaded: getDateTimestamp(dateLoaded),
      truckNumber,
      sWaybill,
      waybillNumber,
      origin,
      destination,
      otherOrigin,
      otherDestination,
      dateReceived: dateReceived ? getDateTimestamp(dateReceived) : null,
    };

    const updateTruck = async () => {
      try {
        setIsUpdating(true);
        await updateTruckData(truckId, payload);
        setModalData({
          isOpen: true,
          message: `Truck Updated Successfully`,
          isError: false,
        });
        setIsUpdating(false);
      } catch (error) {
        setIsUpdating(false);
        console.error(error);
        setModalData({
          isOpen: true,
          message: `Failed to update Truck: ${error.message}`,
          isError: true,
        });
      }
    };
    updateTruck();
  };

  const handleDelete = () => {
    const deleteTruck = async () => {
      try {
        setAlertData({
          isOpen: false,
          message: ".",
          disableButtons: false,
        });
        setIsDeleting(true);
        await deleteTruckData(
          truckId,
          truck.qtyBagsDispatched,
          truck.item,
          truck.orderNumber
        );
        setIsDeleting(false);
        setTruck(null);
      } catch (error) {
        console.error(error);
        setModalData({
          isOpen: true,
          message: "Error Deleting Truck, Please Try Again",
          isError: true,
        });
      }
    };
    deleteTruck();
  };

  useEffect(() => {
    const fetchTruck = async () => {
      setIsLoading(true);
      try {
        const truck = await getTruckById(truckId);
        setTruck(truck);
        console.log(truck);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setIsError(error.message);
      }
    };
    fetchTruck();
  }, [truckId]);

  useEffect(() => {
    if (truck) {
      setDefaultValues();
    }
  }, [truck]);

  useEffect(() => {
    checkFormValidity();
  }, [dateLoaded]);

  return isLoading ? (
    "loading..."
  ) : isError ? (
    "error..."
  ) : isDeleting ? (
    "Deleting Truck..."
  ) : truck ? (
    <>
      <header className='mb-5 flex space-x-3'>
        <nav>
          <ButtonPrimary onClick={() => navigate(-1)}>Go Back</ButtonPrimary>
        </nav>
        <h2 className='sm:text-2xl font-bold'>
          Edit Truck with Waybill of {truck.waybillNumber}
        </h2>
      </header>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <div className='p-6 bg-white rounded-md shadow-md dark:bg-gray-800'>
          <TruckInfo truck={truck} />
        </div>
        <div className='p-6 bg-white rounded-md shadow-md'>
          <h1 className='text-2xl font-semibold mb-4'>Edit Truck</h1>
          <form className='mb-5' onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2'>
                Date Loaded:
              </label>
              <input
                className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
                type='date'
                value={dateLoaded}
                onChange={handleDateLoadedChange}
              />
            </div>
            {truck.status === "received" && (
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>
                  Date Received:
                </label>
                <input
                  className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
                  type='date'
                  value={dateReceived}
                  onChange={handleDateReceived}
                />
              </div>
            )}

            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2'>
                Truck Number:
              </label>
              <input
                className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
                type='text'
                value={truckNumber}
                onChange={handleTruckNumberChange}
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2'>
                Sancham Waybill Number:
              </label>
              <input
                className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
                type='text'
                value={sWaybill}
                onChange={handlesWaybillChange}
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2'>
                Boko Waybill Number:
              </label>
              <input
                className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
                type='text'
                readOnly
                value={waybillNumber}
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2'>
                Origin
              </label>
              <div className='relative'>
                <select
                  value={origin}
                  onChange={handleOriginChange}
                  className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 '
                >
                  {origins.map((origin, i) => (
                    <option key={i} value={origin}>
                      {origin}
                    </option>
                  ))}
                </select>
              </div>
              {origin === "Others" && (
                <div>
                  <label className='block text-gray-700 text-sm font-bold mb-2'>
                    Other Origin
                  </label>
                  <input
                    type='text'
                    value={otherOrigin}
                    onChange={handleOtherOriginChange}
                    className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
                  />
                </div>
              )}
            </div>
            {truck.status !== "received" && (
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>
                  Destination
                </label>
                <div className='relative'>
                  <select
                    value={destination}
                    onChange={handleDestinationChange}
                    className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 '
                  >
                    {destinations.map((destination, i) => (
                      <option key={i} value={destination}>
                        {destination}
                      </option>
                    ))}
                  </select>
                </div>
                {destination === "Others" && (
                  <div>
                    <label className='block text-gray-700 text-sm font-bold mb-2'>
                      Other Destination
                    </label>
                    <input
                      type='text'
                      value={otherDestination}
                      onChange={handleOtherDestinationChange}
                      className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
                    />
                  </div>
                )}
              </div>
            )}

            <button
              disabled={!isFormValid || isUpdating}
              className='bg-blue-500 disabled:bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue'
              onClick={handleSubmit}
            >
              {isUpdating ? "Updating Truck..." : "Update Truck"}
            </button>
          </form>
          {truck.status === "transit" && (
            <div>
              <button
                className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue'
                onClick={() =>
                  setAlertData({
                    isOpen: true,
                    message: "Are you sure you want to delete this truck?",
                    disableButtons: false,
                  })
                }
              >
                Delete Truck
              </button>
              {alertData.isOpen && (
                <Alert
                  alertData={alertData}
                  setAlertData={setAlertData}
                  onOk={handleDelete}
                />
              )}
            </div>
          )}
          {modalData.isOpen && (
            <Modal modalData={modalData} setModalData={setModalData} />
          )}
        </div>
      </div>
    </>
  ) : (
    <div>
      <nav>
        <ButtonPrimary onClick={() => navigate(-1)}>Go Back</ButtonPrimary>
      </nav>
      <p>"This truck Doesnt Exist Anymore"</p>
    </div>
  );
}
