import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import TopNavBar from "../../components/TopNavBar";
import SalaryForm from "../../components/SalaryForm";
import DefaultTable from "../../components/tables/DefaultTable";
import { useQuery } from "react-query";
import {
  getAllSalaries,
  getAllStaffs,
  getSalaryById,
  getSalaryPaymentsByYearAndMonth,
} from "../../util/crud";
import { useEffect, useState } from "react";
import ButtonPrimary from "../../components/buttons/ButtonPrimary";
import Modal from "../../components/Modal";

export default function Salaries() {
  return (
    <div>
      <TopNavBar
        links={[
          {
            path: "",
            title: "All Salaries",
          },
          {
            path: "create-new",
            title: "Create New Salary",
          },
        ]}
      />
      <Routes>
        <Route exact path='/*' element={<SalaryList />} />
        <Route
          exact
          path='/create-new/*'
          element={
            <div>
              <h2 className='text-3xl text-center'>Create a new Salary</h2>
              <SalaryForm />
            </div>
          }
        />
      </Routes>
    </div>
  );
}

const SalaryList = () => {
  const fetchAllSalaries = async () => {
    try {
      const result = await getAllSalaries();
      const mappedResult = result.map((salary) => {
        const { month, year, id } = salary;
        const data = {
          month,
          year,
          view: (
            <Link
              to={`${id}`}
              className='hover:underline bg-gray-500 p-2 px-3 text-white w-full inline-block text-center'
            >
              View
            </Link>
          ),
          edit: (
            <Link
              to={`edit/${id}`}
              className='hover:underline bg-blue-500 p-2 px-3 text-white w-full inline-block text-center'
            >
              Edit
            </Link>
          ),
        };

        return data;
      });
      return mappedResult;
    } catch (error) {
      throw error;
    }
  };

  const { isLoading, error, data, isFetching, refetch } = useQuery(
    "getSalaries",
    fetchAllSalaries
  );

  const tableHeader = ["SN", "Month", "Year", "View", "Edit"];
  //   const salaries = [{ month: "Jan", year: "23" }];

  return isLoading || isFetching ? (
    "loading..."
  ) : error ? (
    "Error Loading Salaries.."
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
        <Route exact path='/:id/*' element={<ViewSalary />} />
        <Route exact path='/edit/:id/*' element={<EditSalary />} />
      </Routes>
    </div>
  );
};

const EditSalary = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchSalary = async () => {
    try {
      const result = await getSalaryById(id);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const { isLoading, error, data, isFetching, refetch } = useQuery(
    ["getSalary", id],
    fetchSalary
  );

  return isLoading ? (
    "Loading..."
  ) : (
    <>
      <div className='mb-5'>
        <ButtonPrimary onClick={() => navigate(-1)}>Back</ButtonPrimary>
      </div>
      {data.month}
    </>
  );
};

const ViewSalary = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchSalary = async () => {
    try {
      const salary = await getSalaryById(id);
      const staffList = await getAllStaffs();
      const salaryPayments = await getSalaryPaymentsByYearAndMonth(
        salary.year,
        salary.month
      );
      if (salaryPayments.length != 0)
        salaryPayments = salaryPayments.map((payment) => payment.staffId);
      return { salary, staffList, salaryPayments };
    } catch (error) {
      throw error;
    }
  };

  const { isLoading, error, data, isFetching, refetch } = useQuery(
    ["getSalary", id],
    fetchSalary
  );

  useEffect(() => {
    console.log(data);
  }, [data]);

  return isLoading || isFetching ? (
    "Loading..."
  ) : error ? (
    "Error Loading..."
  ) : (
    <>
      <div className='mb-5'>
        <ButtonPrimary onClick={() => navigate(-1)}>Back</ButtonPrimary>
      </div>
      <div>
        <h2 className='text-xl font-bold text-center'>
          Viewing Salary for the Month of {data.salary.month} and year{" "}
          {data.salary.year}
        </h2>
        <div className='mb-5'>
          <div>Month: {data.salary.month}</div>
          <div>Year: {data.salary.year}</div>
        </div>
        <div>
          <p className='uppercase tracking-wider mb-5'>Payments:</p>
          <DefaultTable
            tableData={[{ staff: "Ngozi", amount: "30000" }]}
            tableHeader={["SN", "Name", "Amount"]}
          />
        </div>
        <div>
          <SalaryPaymentForm payload={data} />
        </div>
      </div>
    </>
  );
};

const SalaryPaymentForm = ({ payload }) => {
  const [formData, setFormData] = useState({
    year: payload.salary.year,
    month: payload.salary.month,
    staffId: "",
    staffName: "",
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
    console.log(formData);
    //  try {
    //    setIsSubmitting(true);
    //    await addSalary(formData);
    //    setModalData({
    //      isOpen: true,
    //      message: `Salary Created Successfully`,
    //      isError: false,
    //    });
    //    setIsSubmitting(false);
    //  } catch (error) {
    //    console.error(error);
    //    setModalData({
    //      isOpen: true,
    //      message: error.message,
    //      isError: true,
    //    });
    //    setIsSubmitting(false);
    //  }
  };

  useEffect(() => {
    formData.staffName != "" &&
      setFormData({
        ...formData,
        staffId: payload.staffList.find(
          (staff) => staff.name === formData.staffName
        ).id,
      });
  }, [formData.staffName]);

  const isSubmitDisabled = !formData.month || !formData.year;

  return (
    <div className='max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md'>
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
            id='staffName'
            name='staffName'
            value={formData.staffName}
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
            required
          >
            <option value='' disabled>
              Select Staff
            </option>
            {payload.staffList.map((staff, index) => (
              <option key={index} value={staff.name}>
                {staff.name}
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
