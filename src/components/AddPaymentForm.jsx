import React, { useState, useEffect } from "react";
import {
  disableArrowKeys,
  disableScroll,
  formatMoney,
  moneyStringToNumber,
} from "../util/functions";
import { useAuth } from "../contexts/authContext";
import { createPayment } from "../util/crud";

const AddPaymentForm = ({ transactionId, setModalData }) => {
  const [paymentData, setPaymentData] = useState({
    date: "",
    paymentRef: "",
    beneficiary: "",
    beneficiaryAccount: "",
    beneficiaryName: "",
    beneficiaryBank: "",
    amount: "",
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
    setIsLoading(true);
    const {
      date,
      paymentRef,
      beneficiary,
      beneficiaryAccount,
      beneficiaryName,
      beneficiaryBank,
      amount,
    } = paymentData;
    const payload = {
      date,
      paymentRef,
      beneficiary,
      beneficiaryAccount,
      beneficiaryName,
      beneficiaryBank,
      amount: moneyStringToNumber(amount),
      createdBy: user.name,
      transactionId,
    };
    try {
      await createPayment(payload);
      setModalData({
        isOpen: true,
        message: "Payment Added Successfully",
        isError: false,
      });
    } catch (error) {
      setModalData({
        isOpen: true,
        message: error.message,
        isError: true,
      });
    }
    setIsLoading(false);
    setPaymentData({
      date: "",
      paymentRef: "",
      beneficiary: "",
      beneficiaryAccount: "",
      beneficiaryName: "",
      beneficiaryBank: "",
      amount: "",
    });
  };

  return (
    <div className='border p-5 m-6 rounded-md border-green-400 bg-green-50'>
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
          <label className='block mb-2'>Payment Reference:</label>
          <input
            type='text'
            name='paymentRef'
            value={paymentData.paymentRef}
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
          {isLoading ? "Loading..." : "Ad Payment"}
        </button>
      </form>
    </div>
  );
};

export default AddPaymentForm;
