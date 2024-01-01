import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { getStaffById, updateStaff } from "../util/crud";
import { useQuery, useQueryClient } from "react-query";
import ButtonPrimary from "./buttons/ButtonPrimary";
import DefaultTable from "./tables/DefaultTable";
import { useEffect, useState } from "react";
import {
  fetchAllStaffs,
  formatMoney,
  moneyStringToNumber,
} from "../util/functions";
import Modal from "./Modal";

const StaffList = () => {
  const { isLoading, error, data, isFetching, refetch } = useQuery(
    "getStaffs",
    fetchAllStaffs
  );

  const tableHeader = [
    "SN",
    "Name",
    "Phone Number",
    "Account Number",
    "Category",
    "Job Description",
    "Status",
    "Salary Amount",
    // "View",
    "Edit",
  ];

  return isLoading || isFetching ? (
    "loading..."
  ) : error ? (
    "Error Loading Staffs.."
  ) : (
    <div>
      <Routes>
        <Route
          exact
          path='/*'
          element={
            <div>
              <div className='mb-5'>
                <ButtonPrimary onClick={() => refetch()}>Refresh</ButtonPrimary>
              </div>
              <DefaultTable tableHeader={tableHeader} tableData={data} />
            </div>
          }
        />
        <Route exact path='/:id/*' element={<div>view staff</div>} />
        <Route exact path='/edit/:id/*' element={<EditStaff />} />
      </Routes>
    </div>
  );
};

const EditStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    isLoading,
    error,
    data: staff,
    isFetching,
    refetch,
  } = useQuery(["getStaff", id], () => getStaffById(id));

  return isLoading || isFetching ? (
    "loading..."
  ) : error ? (
    "Error Loading Staffs.."
  ) : (
    <div className='bg-white p-5'>
      <header className='mb-5 flex space-x-3'>
        <nav>
          <ButtonPrimary onClick={() => navigate(-1)}>Go Back</ButtonPrimary>
        </nav>
        <h2 className='sm:text-2xl font-bold'>Edit Staff</h2>
      </header>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <StaffInfo staff={staff} />
        <EditForm staff={staff} />
      </div>
    </div>
  );
};

const StaffInfo = ({ staff }) => {
  const {
    accountNumber,
    phoneNumber,
    salaryAmount,
    jobDescription,
    name,
    category,
    status,
  } = staff;

  const staffInfo = {
    Name: name,
    "Phone Number": phoneNumber,
    "Account Number": accountNumber,
    Salary: formatMoney(salaryAmount),
    "Job Description": jobDescription,
    Category: category,
    Status: status || "active",
  };
  const dataEntries = Object.entries(staffInfo);
  return (
    <div>
      <h2 className='text-lg font-semibold text-gray-700 capitalize dark:text-white mb-5'>
        truck info
      </h2>
      <div className='relative overflow-x-auto border'>
        <table className='w-full text-sm text-left text-gray-500 bg-gray-100'>
          <tbody>
            {dataEntries.map(([key, value]) => (
              <tr
                key={key}
                className='border-b border-gray-200 dark:border-gray-700'
              >
                <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800'>
                  {key}
                </td>
                <td className='px-6 py-4'>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EditForm = ({ staff }) => {
  console.log(staff);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    ...staff,
    salaryAmount: formatMoney(staff.salaryAmount),
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
      status,
    } = formData;
    const payload = {
      name,
      jobDescription,
      category,
      phoneNumber,
      accountNumber,
      salaryAmount: moneyStringToNumber(salaryAmount),
      status,
    };
    try {
      setIsSubmitting(true);
      await updateStaff(staff.id, payload);
      setModalData({
        isOpen: true,
        message: `Staff Edited Successfully`,
        isError: false,
      });
      queryClient.invalidateQueries("getStaffs");
      queryClient.invalidateQueries("getStaff");

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

  const isSubmitDisabled =
    !formData.name || !formData.salaryAmount || !formData.jobDescription;

  return (
    <div className='bg-white rounded-md shadow-md'>
      <h2 className='text-2xl font-semibold mb-4'>Staff</h2>
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
            htmlFor='category'
          >
            Status
          </label>
          <select
            value={formData.status}
            onChange={handleChange}
            name='status'
            required
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
          >
            <option value='active'>Active</option>
            <option value='disabled'>Disabled</option>
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
          {isSubmitting ? "Submitting..." : "Edit Staff"}
        </button>
      </form>
      {modalData.isOpen && (
        <Modal modalData={modalData} setModalData={setModalData} />
      )}
    </div>
  );
};

export default StaffList;
