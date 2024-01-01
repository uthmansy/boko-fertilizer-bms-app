import { useEffect } from "react";
import { useState } from "react";
import {
  disableArrowKeys,
  disableScroll,
  formatMoney,
  moneyStringToNumber,
} from "../../util/functions";
import { useAuth } from "../../contexts/authContext";
import {
  addTransportFeePayment,
  getAllTransportFeePayments,
  getAllTransportFeeUsage,
  getTransportFeeInfo,
} from "../../util/crud";
import Modal from "../../components/Modal";
import { useQuery, useQueryClient } from "react-query";
import { Route, Routes } from "react-router-dom";
import ButtonPrimary from "../../components/buttons/ButtonPrimary";
import DefaultTable from "../../components/tables/DefaultTable";
import { useMenu } from "../../contexts/menuContext";

export default function TransportFee() {
  const { setIsMenuOpen } = useMenu();

  useEffect(() => {
    setIsMenuOpen(false);
  }, []);
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
      <div className='bg-white p-5 shadow-md rounded-lg'>
        <TransportFeeInfo />
      </div>
      <div>
        <PaymentForm />
      </div>
      <div className='bg-white p-5 shadow-md rounded-lg'>
        <PaymentsList />
      </div>
      <div className='bg-white p-5 shadow-md rounded-lg'>
        <UsageList />
      </div>
    </div>
  );
  //   return <PaymentForm />;
}

const PaymentForm = () => {
  const queryClient = useQueryClient();

  const [paymentData, setPaymentData] = useState({
    date: "",
    beneficiary: "",
    beneficiaryAccount: "",
    beneficiaryName: "",
    beneficiaryBank: "",
    amount: "",
  });
  const [modalData, setModalData] = useState({
    isOpen: false,
    message: "",
    isError: false,
  });

  const [formIsValid, setFormIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isFormValid = Object.values(paymentData).every(
      (value) => value.trim() !== ""
    );
    setFormIsValid(isFormValid);
  }, [paymentData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: value,
    });
  };

  const handleAmountChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatMoney(value);

    setPaymentData({
      ...paymentData,
      amount: formattedValue,
    });
  };

  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      date,
      beneficiary,
      beneficiaryAccount,
      beneficiaryName,
      beneficiaryBank,
      amount,
    } = paymentData;
    const payload = {
      date,
      type: "transportFee",
      beneficiary,
      beneficiaryAccount,
      beneficiaryName,
      beneficiaryBank,
      amount: moneyStringToNumber(amount),
      createdBy: user.name,
    };

    console.log(payload);
    try {
      setIsLoading(true);
      await addTransportFeePayment(payload);
      queryClient.invalidateQueries("getTransportFeeInfo");
      queryClient.invalidateQueries("getTransportFeePayments");
      setIsLoading(false);
      setModalData({
        isOpen: true,
        message: "Payment Added Successfully",
        isError: false,
      });
    } catch (error) {
      setIsLoading(false);
      setModalData({
        isOpen: true,
        message: error.message,
        isError: true,
      });
    }
    setPaymentData({
      date: "",
      beneficiary: "",
      beneficiaryAccount: "",
      beneficiaryName: "",
      beneficiaryBank: "",
      amount: "",
    });
  };

  return (
    <div className='border p-5 rounded-md border-green-400 bg-green-50'>
      <form className='w-full grid grid-cols-2 gap-4' onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block mb-2'>Date:</label>
          <input
            type='date'
            name='date'
            value={paymentData.date}
            onChange={handleInputChange}
            className='w-full p-2 border rounded'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Beneficiary:</label>
          <input
            type='text'
            name='beneficiary'
            value={paymentData.beneficiary}
            onChange={handleInputChange}
            className='w-full p-2 border rounded'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Beneficiary Account:</label>
          <input
            type='number'
            name='beneficiaryAccount'
            onWheel={disableScroll}
            onKeyDown={disableArrowKeys}
            value={paymentData.beneficiaryAccount}
            onChange={handleInputChange}
            className='w-full p-2 border rounded'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Account Name:</label>
          <input
            type='text'
            name='beneficiaryName'
            value={paymentData.beneficiaryName}
            onChange={handleInputChange}
            className='w-full p-2 border rounded'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Beneficiary Bank:</label>
          <input
            type='text'
            name='beneficiaryBank'
            value={paymentData.beneficiaryBank}
            onChange={handleInputChange}
            className='w-full p-2 border rounded'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Amount:</label>
          <input
            type='text'
            name='beneficiaryBank'
            value={paymentData.amount}
            onChange={handleAmountChange}
            className='w-full p-2 border rounded'
          />
        </div>
        <button
          type='submit'
          disabled={!formIsValid || isLoading}
          className={`col-span-2 p-2 bg-green-500 text-white rounded hover:bg-green-600 ${
            !formIsValid && "opacity-50 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Loading..." : "Add Payment"}
        </button>
      </form>
      {modalData.isOpen && (
        <Modal modalData={modalData} setModalData={setModalData} />
      )}
    </div>
  );
};

const TransportFeeInfo = () => {
  const fetchTransportFeeInfo = async () => {
    try {
      const result = await getTransportFeeInfo();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const { isLoading, error, data, isFetching, refetch } = useQuery(
    "getTransportFeeInfo",
    fetchTransportFeeInfo
  );

  useEffect(() => {
    console.log(data);
  }, [data]);

  return isLoading || isFetching ? (
    "Loading.."
  ) : error ? (
    "Error Loading..."
  ) : (
    <div className='p-5 text-xl'>
      <h2 className='font-bold text-3xl uppercase mb-5'>Summary</h2>
      <div className='grid grid-cols-2 gap-x-5 gap-y-2'>
        <div className='font-bold uppercase tracking-wide'>Total Paid:</div>
        <div>{formatMoney(data.totalPaid)}</div>
        <div className='font-bold uppercase tracking-wide'>Total Used:</div>
        <div>{formatMoney(data.totalUsed)}</div>
        <div className='font-bold uppercase tracking-wide mt-5'>Balance:</div>
        <div className='text-3xl md:text-5xl font-black mt-5 pb-3 border-b-4 border-black'>
          {formatMoney(data.totalPaid - data.totalUsed)}
        </div>
      </div>
    </div>
  );
};

const PaymentsList = () => {
  const fetchAllTransportFeePayments = async () => {
    try {
      const result = await getAllTransportFeePayments();
      const mappedResult = result.map((payment) => {
        const {
          date,
          amount,
          beneficiary,
          beneficiaryAccount,
          beneficiaryBank,
          beneficiaryName,
        } = payment;
        const data = {
          date,
          amount: formatMoney(amount),
          beneficiary,
          beneficiaryAccount,
          beneficiaryBank,
          beneficiaryName,
        };

        return data;
      });
      return mappedResult;
    } catch (error) {
      throw error;
    }
  };

  const { isLoading, error, data, isFetching, refetch } = useQuery(
    "getTransportFeePayments",
    fetchAllTransportFeePayments
  );

  const tableHeader = [
    "SN",
    "Date",
    "Amount",
    "Beneficiary",
    "Account",
    "Bank",
    "Account Name",
  ];

  return isLoading || isFetching ? (
    "loading..."
  ) : error ? (
    "Error Loading Payments.."
  ) : (
    <div>
      <Routes>
        <Route
          exact
          path='/*'
          element={
            <div>
              <h2 className='text-xl mb-5  font-bold uppercase tracking-wide'>
                All Payments
              </h2>
              <DefaultTable tableHeader={tableHeader} tableData={data} />
            </div>
          }
        />
        <Route exact path='/:id/*' element={<div>View payment</div>} />
      </Routes>
    </div>
  );
};

const UsageList = () => {
  const fetchAllTransportFeeUsage = async () => {
    try {
      const result = await getAllTransportFeeUsage();
      const mappedResult = result.map((usage) => {
        const {
          truckNumber,
          waybillNumber,
          transportFeePaid,
          dispatchOfficer,
        } = usage;
        const data = {
          truckNumber,
          waybillNumber,
          transportFeePaid: formatMoney(transportFeePaid),
          dispatchOfficer,
        };

        return data;
      });
      return mappedResult;
    } catch (error) {
      throw error;
    }
  };

  const { isLoading, error, data, isFetching, refetch } = useQuery(
    "getAllTransportFeeUsage",
    fetchAllTransportFeeUsage
  );

  const tableHeader = [
    "SN",
    "Truck Number",
    "Waybill Number",
    "Fee Paid",
    "Dispatch Officer",
  ];

  return isLoading || isFetching ? (
    "loading..."
  ) : error ? (
    "Error Loading Payments.."
  ) : (
    <div>
      <Routes>
        <Route
          exact
          path='/*'
          element={
            <div>
              <h2 className='text-xl mb-5 font-bold uppercase tracking-wide'>
                All Usage
              </h2>
              <DefaultTable tableHeader={tableHeader} tableData={data} />
            </div>
          }
        />
        <Route exact path='/:id/*' element={<div>View payment</div>} />
      </Routes>
    </div>
  );
};
