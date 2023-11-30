import { Link, Route, Routes } from "react-router-dom";
import TopNavBar from "../../components/TopNavBar";
import StaffForm from "../../components/StaffForm";
import { getAllStaffs } from "../../util/crud";
import DefaultTable from "../../components/tables/DefaultTable";
import ButtonPrimary from "../../components/buttons/ButtonPrimary";
import { useQuery } from "react-query";

export default function Staffs() {
  return (
    <div>
      <TopNavBar
        links={[
          {
            path: "",
            title: "All Staffs",
          },
          {
            path: "create-new",
            title: "Create New Staff",
          },
        ]}
      />
      <Routes>
        <Route exact path='/*' element={<StaffList />} />
        <Route
          exact
          path='/create-new/*'
          element={
            <div>
              <h2 className='text-3xl text-center'>Create a new Staff</h2>
              <StaffForm />
            </div>
          }
        />
      </Routes>
    </div>
  );
}

const StaffList = () => {
  const fetchAllStaffs = async () => {
    try {
      const result = await getAllStaffs();
      const mappedResult = result.map((staff) => {
        const { name, jobDescription, salaryAmount, id } = staff;
        const data = {
          name,
          jobDescription,
          salaryAmount,
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
    "getStaffs",
    fetchAllStaffs
  );

  const tableHeader = [
    "SN",
    "Name",
    "Job Description",
    "Salary Amount",
    "View",
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
