import { useState } from "react";
import Modal from "./Modal";
import { formatMoney, moneyStringToNumber } from "../util/functions";
import { useEffect } from "react";
import { addSalaryPayment } from "../util/crud";
import InfoAlert from "./alerts/InfoAlert";

const SalaryPaymentForm = ({ setTotalSalaries, setTableData, payload }) => {
  const [formData, setFormData] = useState({
    year: payload.salary.year,
    month: payload.salary.month,
    staffId: "",
    staffName: "",
    amountPaid: "",
    paymentNote: "",
    paymentStatus: "paid",
    salaryAmount: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalData, setModalData] = useState({
    isOpen: false,
    message: "",
    isError: false,
  });

  const validStaffs = payload.staffList.filter(
    (staff) => !payload.salaryPaymentsIds.includes(staff.id)
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAmountChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatMoney(value);

    setFormData({
      ...formData,
      [e.target.name]: formattedValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const data = { ...formData };
    data.amountPaid = moneyStringToNumber(data.amountPaid);
    console.log(data);
    try {
      setIsSubmitting(true);
      await addSalaryPayment(data);

      payload.salaryPaymentsIds = [...payload.salaryPaymentsIds, data.staffId];
      const category = payload.staffList.filter(
        (staff) => staff.id === data.staffId
      )[0].category;
      setTableData((prev) => [
        ...prev,
        {
          staffName: data.staffName,
          category,
          salaryAmount: formatMoney(data.salaryAmount),
          amountPaid: formatMoney(data.amountPaid),
          paymentNote: data.paymentNote,
          paymentStatus: data.paymentStatus,
        },
      ]);
      setTotalSalaries((prev) => prev + data.amountPaid);
      setModalData({
        isOpen: true,
        message: `Payment Added Successfully`,
        isError: false,
      });
      setFormData({
        year: payload.salary.year,
        month: payload.salary.month,
        staffId: "",
        staffName: "",
        amountPaid: "",
        paymentNote: "",
        paymentStatus: "paid",
        salaryAmount: 0,
      });
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      setModalData({
        isOpen: true,
        message: error.message,
        isError: true,
      });
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (formData.staffId != "") {
      let staff = payload.staffList.find(
        (staff) => staff.id === formData.staffId
      );
      setFormData({
        ...formData,
        staffName: staff.name,
        salaryAmount: staff.salaryAmount,
      });
    }
  }, [formData.staffId]);

  const isSubmitDisabled = !formData.staffName || !formData.amountPaid;

  return validStaffs.length != 0 ? (
    <div className='p-6 bg-white shadow-md'>
      <h2 className='text-2xl font-semibold mb-4'>New Payment</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='staffName'
          >
            Staff Name
          </label>
          <select
            id='staffId'
            name='staffId'
            value={formData.staffId}
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
            required
          >
            <option value='' disabled>
              Select Staff
            </option>
            {validStaffs.map((staff, index) => (
              <option key={index} value={staff.id}>
                {staff.name}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-5'>
          This Staff Salary Amount is {formatMoney(formData.salaryAmount)}
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='staffName'
          >
            Amount Paid
          </label>
          <input
            type='text'
            id='amountPaid'
            name='amountPaid'
            value={formData.amountPaid}
            onChange={handleAmountChange}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
            required
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='staffName'
          >
            Payment Note
          </label>
          <input
            type='text'
            id='paymentNote'
            name='paymentNote'
            value={formData.paymentNote}
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
            required
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='paymentStatus'
          >
            Payment Status
          </label>
          <select
            id='paymentStatus'
            name='paymentStatus'
            value={formData.paymentStatus}
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
            required
          >
            <option value='paid'>Paid</option>
            <option value='pending'>Pending</option>
          </select>
        </div>
        <button
          type='submit'
          disabled={isSubmitDisabled || isSubmitting}
          className={`bg-${
            isSubmitDisabled ? "gray-400" : "blue-500"
          } text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300`}
        >
          {isSubmitting ? "Submitting" : "Create Payment"}
        </button>
      </form>
      {modalData.isOpen && (
        <Modal modalData={modalData} setModalData={setModalData} />
      )}
    </div>
  ) : (
    <InfoAlert>All Salary Payments are made</InfoAlert>
  );
};

export default SalaryPaymentForm;
