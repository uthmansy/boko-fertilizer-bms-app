import { useState } from "react";
import Modal from "./Modal";
import { addSalary } from "../util/crud";
import { useQueryClient } from "react-query";

const SalaryForm = () => {
  const currentYear = new Date().getFullYear();
  const queryClient = useQueryClient();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [formData, setFormData] = useState({
    month: "",
    year: currentYear.toString(),
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await addSalary(formData);
      setModalData({
        isOpen: true,
        message: `Salary Created Successfully`,
        isError: false,
      });
      setFormData({
        month: "",
        year: currentYear.toString(),
      });
      setIsSubmitting(false);
      queryClient.invalidateQueries("getSalaries");
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

  const isSubmitDisabled = !formData.month || !formData.year;

  // Generate an array of years, you can adjust the range as needed
  const years = Array.from({ length: 10 }, (_, index) =>
    (currentYear - index).toString()
  );

  return (
    <div className='max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md'>
      <h2 className='text-2xl font-semibold mb-4'>New Salary</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='month'
          >
            Month
          </label>
          <select
            id='month'
            name='month'
            value={formData.month}
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
            required
          >
            <option value='' disabled>
              Select Month
            </option>
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='year'
          >
            Year
          </label>
          <select
            id='year'
            name='year'
            value={formData.year}
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
            required
          >
            <option value='' disabled>
              Select Year
            </option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <button
          type='submit'
          disabled={isSubmitDisabled || isSubmitting}
          className={`bg-${
            isSubmitDisabled ? "gray-400" : "blue-500"
          } text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300`}
        >
          {isSubmitting ? "Submitting" : "Create Salary"}
        </button>
      </form>
      {modalData.isOpen && (
        <Modal modalData={modalData} setModalData={setModalData} />
      )}
    </div>
  );
};

export default SalaryForm;
