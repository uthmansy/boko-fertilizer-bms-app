import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import {
  getAllStaffs,
  getSalaryById,
  getSalaryPaymentsByYearAndMonth,
} from "../util/crud";
import { useEffect } from "react";
import ButtonPrimary from "./buttons/ButtonPrimary";
import { formatMoney } from "../util/functions";
import DefaultTable from "./tables/DefaultTable";
import SalaryPaymentForm from "./SalaryPaymentForm";
import PrintDoc from "./PrintDoc";
import IMAGES from "../assets/images/Images";

const ViewSalary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [tableData, setTableData] = useState([]);
  const [totalSalaries, setTotalSalaries] = useState(0);

  const fetchSalary = async () => {
    try {
      const salary = await getSalaryById(id);
      const staffList = await getAllStaffs();
      const salaryPayments = await getSalaryPaymentsByYearAndMonth(
        salary.year,
        salary.month
      );
      let totalPaidSalaries = 0;
      salaryPayments.forEach(
        (salary) => (totalPaidSalaries += salary.amountPaid)
      );
      let salaryPaymentsIds = [];
      if (salaryPayments.length != 0)
        salaryPaymentsIds = salaryPayments.map((payment) => payment.staffId);
      return {
        salary,
        staffList,
        salaryPayments,
        salaryPaymentsIds,
        totalPaidSalaries,
      };
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

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries(["getSalary", id]);
    };
  }, [id]);

  useEffect(() => {
    if (data) {
      const salaryPaymentsList = data.salaryPayments.map((payment) => {
        const {
          staffName,
          amountPaid,
          salaryAmount,
          paymentNote,
          paymentStatus,
          staffId,
        } = payment;
        const category = data.staffList.filter(
          (staff) => staff.id === staffId
        )[0].category;

        return {
          staffName,
          category: category || "salary",
          salaryAmount: formatMoney(salaryAmount),
          amountPaid: formatMoney(amountPaid),
          paymentNote,
          paymentStatus,
        };
      });
      setTableData(salaryPaymentsList);
      setTotalSalaries(data.totalPaidSalaries);
    }
  }, [data]);

  return isLoading || isFetching ? (
    "Loading..."
  ) : error ? (
    "Error Loading..."
  ) : (
    <>
      <div className='mb-2 flex space-x-2'>
        <ButtonPrimary onClick={() => navigate(-1)}>Back</ButtonPrimary>
        <ButtonPrimary onClick={() => refetch()}>Reload</ButtonPrimary>
        <ButtonPrimary>
          <Link to='records'>Salary Payment Record</Link>
        </ButtonPrimary>
      </div>
      <Routes>
        <Route
          path='/'
          element={
            <SalaryInfo
              tableData={tableData}
              setTotalSalaries={setTotalSalaries}
              setTableData={setTableData}
              data={data}
              totalSalaries={totalSalaries}
            />
          }
        />

        <Route
          path='/records'
          element={<SalaryRecord tableData={tableData} />}
        />
      </Routes>
    </>
  );
};

const SalaryInfo = ({
  tableData,
  setTotalSalaries,
  setTableData,
  data,
  totalSalaries,
}) => (
  <div>
    <div className='container mx-auto'>
      <h2 className='text-2xl font-semibold mb-4'>Salary Information</h2>
      <table className='min-w-full bg-white border border-gray-300'>
        <tbody>
          <tr className='border-b'>
            <td className='py-2 px-4 font-semibold'>Month:</td>
            <td className='py-2 px-4'>{data.salary.month}</td>
          </tr>
          <tr className='border-b'>
            <td className='py-2 px-4 font-semibold'>Year:</td>
            <td className='py-2 px-4'>{data.salary.year}</td>
          </tr>
          <tr className='border-b'>
            <td className='py-2 px-4 font-semibold'>Total Salaries Paid:</td>
            <td className='py-2 px-4'>{formatMoney(totalSalaries)}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
      <div>
        <p className='uppercase tracking-wider mb-5'>Payments:</p>
        <DefaultTable
          tableData={tableData}
          tableHeader={[
            "SN",
            "Name",
            "Type",
            "Default Amount",
            "Amount Paid",
            "Payment Note",
            "Payment Status",
          ]}
        />
      </div>
      <div>
        <p className='uppercase tracking-wider mb-5'>Create new:</p>

        <SalaryPaymentForm
          setTotalSalaries={setTotalSalaries}
          setTableData={setTableData}
          payload={data}
        />
      </div>
    </div>
  </div>
);

const SalaryRecord = ({ tableData }) => {
  const [payments, setPayments] = useState(tableData);

  const filterCategory = (cat) => {
    setPayments(tableData.filter((payment) => payment.category === cat));
  };
  const resetCategory = () => {
    setPayments(tableData);
  };

  return (
    <div className='shadow-md rounded-lg mt-5'>
      <div className='mb-5 flex space-x-3'>
        <ButtonPrimary
          onClick={() => filterCategory("salary")}
          classes='bg-red-500'
        >
          Salary
        </ButtonPrimary>
        <ButtonPrimary
          onClick={() => filterCategory("allowance")}
          classes='bg-red-500'
        >
          Allowance
        </ButtonPrimary>
        <ButtonPrimary onClick={resetCategory} classes='bg-red-500'>
          All
        </ButtonPrimary>
      </div>
      <div className='border w-fit p-5'>
        <PrintDoc>
          <div className='p-10 bg-white'>
            <div className={`mb-20 flex items-center flex-col`}>
              <img className='w-24' src={IMAGES.logo} alt='logo' />

              <h1 className='font-black text-3xl uppercase text-center'>
                Boko Fertilizer Payroll
              </h1>
              <div className=''>
                No.60/61 UNGOGO ROAD KANO, KANO STATE UNGOGO, 700105, Kano
              </div>
            </div>
            <DefaultTable
              tableData={payments}
              tableHeader={[
                "SN",
                "Name",
                "Payment Type",
                "Default Amount",
                "Amount Paid",
                "Payment Note",
                "Payment Status",
              ]}
            />
          </div>
        </PrintDoc>
      </div>
    </div>
  );
};

export default ViewSalary;
