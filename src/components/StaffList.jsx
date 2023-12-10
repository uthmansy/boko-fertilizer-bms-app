import { Link, Route, Routes } from "react-router-dom";
import { getAllStaffs } from "../util/crud";
import { useQuery } from "react-query";
import ButtonPrimary from "./buttons/ButtonPrimary";
import DefaultTable from "./tables/DefaultTable";

const StaffList = () => {
  const fetchAllStaffs = async () => {
    try {
      const result = await getAllStaffs();
      const mappedResult = result.map((staff) => {
        const {
          name,
          jobDescription,
          salaryAmount,
          id,
          phoneNumber,
          accountNumber,
          category,
        } = staff;
        const data = {
          name,
          phoneNumber: phoneNumber || "NILL",
          accountNumber: accountNumber || "NILL",
          category: category || "salary",
          jobDescription,
          salaryAmount,
          //   view: (
          //     <Link
          //       to={`${id}`}
          //       className='hover:underline bg-gray-500 p-2 px-3 text-white w-full inline-block text-center'
          //     >
          //       View
          //     </Link>
          //   ),
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
        <Route exact path='/edit/:id/*' element={<div>edit staff</div>} />
      </Routes>
    </div>
  );
};

export default StaffList;
