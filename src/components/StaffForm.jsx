import { useState } from "react";
import { formatMoney, moneyStringToNumber } from "../util/functions";
import Modal from "./Modal";
import { addStaff } from "../util/crud";
import { useQueryClient } from "react-query";

const StaffForm = () => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    jobDescription: "",
    category: "salary",
    salaryAmount: "",
    phoneNumber: "",
    accountNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalData, setModalData] = useState({
    isOpen: false,
    message: "",
    isError: false,
  });

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
    const {
      name,
      jobDescription,
      category,
      salaryAmount,
      phoneNumber,
      accountNumber,
    } = formData;
    const payload = {
      name,
      jobDescription,
      category,
      phoneNumber,
      accountNumber,
      salaryAmount: moneyStringToNumber(salaryAmount),
      status: "active",
    };
    try {
      setIsSubmitting(true);
      await addStaff(payload);
      setModalData({
        isOpen: true,
        message: `Staff Created Successfully`,
        isError: false,
      });
      queryClient.invalidateQueries("getStaffs");

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
    setFormData({
      name: "",
      jobDescription: "",
      category: "salary",
      salaryAmount: "",
      phoneNumber: "",
      accountNumber: "",
    });
  };

  const isSubmitDisabled =
    !formData.name || !formData.salaryAmount || !formData.jobDescription;

  return (
    <div className='max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md'>
      <h2 className='text-2xl font-semibold mb-4'>New Staff</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='name'
          >
            Name
          </label>
          <input
            type='text'
            value={formData.name}
            name='name'
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
            required
          />
        </div>

        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='jobDescription'
          >
            Job Description
          </label>
          <input
            type='text'
            value={formData.jobDescription}
            name='jobDescription'
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
            required
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='category'
          >
            Category
          </label>
          <select
            value={formData.category}
            onChange={handleChange}
            name='category'
            required
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
          >
            <option value='salary'>Salary</option>
            <option value='allowance'>Allowance</option>
          </select>
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='phoneNumber'
          >
            Phone Number
          </label>
          <input
            type='text'
            value={formData.phoneNumber}
            name='phoneNumber'
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
            required
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='phoneNumber'
          >
            Account Number
          </label>
          <input
            type='text'
            value={formData.accountNumber}
            name='accountNumber'
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
            required
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='jobDescription'
          >
            Salary Amount
          </label>
          <input
            type='text'
            value={formData.salaryAmount}
            name='salaryAmount'
            onChange={handleAmountChange}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
            required
          />
        </div>

        <button
          type='submit'
          disabled={isSubmitDisabled || isSubmitting}
          className={`bg-${
            isSubmitDisabled ? "gray-400" : "blue-500"
          } text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300`}
        >
          {isSubmitting ? "Submitting" : "Create Staff"}
        </button>
      </form>
      {modalData.isOpen && (
        <Modal modalData={modalData} setModalData={setModalData} />
      )}
    </div>
  );
};

export default StaffForm;
