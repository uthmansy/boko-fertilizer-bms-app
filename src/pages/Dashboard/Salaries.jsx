import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import TopNavBar from "../../components/TopNavBar";
import SalaryForm from "../../components/SalaryForm";
import DefaultTable from "../../components/tables/DefaultTable";
import { useQuery, useQueryClient } from "react-query";
import {
  getAllSalaries,
  getAllStaffs,
  getSalaryById,
  getSalaryPaymentsByYearAndMonth,
} from "../../util/crud";
import { useEffect } from "react";
import ButtonPrimary from "../../components/buttons/ButtonPrimary";
import SalaryPaymentForm from "../../components/SalaryPaymentForm";
import { useState } from "react";
import { formatMoney } from "../../util/functions";
import ViewSalary from "../../components/ViewSalary";
import { useMenu } from "../../contexts/menuContext";

export default function Salaries() {
  const { setIsMenuOpen } = useMenu();

  useEffect(() => {
    setIsMenuOpen(false);
  }, []);
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

  const tableHeader = ["SN", "Month", "Year", "View"];

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
