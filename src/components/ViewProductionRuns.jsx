import { useEffect } from "react";
import {
  deleteProductionRunById,
  getAllProductionRuns,
  getProductionRunById,
} from "../util/crud";
import DefaultTable from "./tables/DefaultTable";
import { useInfiniteQuery, useMutation, useQuery } from "react-query";
import ButtonPrimary from "./buttons/ButtonPrimary";
import { useState } from "react";
import InfoModal from "./InfoModal";
import { useAuth } from "../contexts/authContext";
import { Link, Route, Routes, useParams } from "react-router-dom";
import PrintDoc from "./PrintDoc";
import DocumentHeader from "./DocumentHeader";
import useSerielData from "../hooks/useSerielData";
import useMapProductions from "../hooks/useMapProduction";
import { companyFullName } from "../constants/company";

const fetchProductionRuns = async ({ pageParam = null }) => {
  try {
    const result = await getAllProductionRuns(pageParam);

    return result;
  } catch (error) {
    throw error;
  }
};

function ViewProductionRuns() {
  const { user } = useAuth();

  const {
    isLoading,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["getProductionRuns"],
    queryFn: fetchProductionRuns,
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
  });

  const [openModal, setOpenModal] = useState(false);
  const [serielData, setSerielData] = useSerielData(data);

  const mutation = useMutation({
    mutationFn: (id) => deleteProductionRunById(id),
    onMutate: () => {
      setOpenModal(true);
    },
    onSuccess: (id) => {
      setSerielData((prev) => prev.filter((run) => run.id != id));
    },
  });

  const handleDelete = (id) => {
    const isConfirmed = confirm(
      "Are you sure you want to delete this Production?"
    );
    if (isConfirmed) {
      mutation.mutate(id);
    }
  };

  const productionRuns = useMapProductions(serielData, handleDelete);

  const tableHeader = [
    "SN",
    "Date",
    "Finished Product",
    "Quantity Produced",
    "Raw Materials Used",
    "Production Staff",
    "View",
  ];
  if (user.role === "admin") tableHeader.push("Delete");

  return isLoading ? (
    <div>Loading....</div>
  ) : error ? (
    <div>Error Loading Production Runs...</div>
  ) : (
    <div>
      <Routes>
        <Route
          path='/*'
          element={
            <>
              <div className='mb-5'>
                <ButtonPrimary onClick={refetch}>Refresh</ButtonPrimary>
              </div>
              <DefaultTable
                tableHeader={tableHeader}
                tableData={productionRuns}
              />
              {hasNextPage && (
                <nav className='mt-5 flex items-center justify-center'>
                  <ButtonPrimary
                    onClick={() => fetchNextPage()}
                    disabled={isFetching}
                  >
                    {isFetching ? "Loading..." : "Load more"}
                  </ButtonPrimary>
                </nav>
              )}
              {openModal && (
                <InfoModal close={() => setOpenModal(false)}>
                  {mutation.isLoading
                    ? "loading..."
                    : mutation.isSuccess
                    ? "Success"
                    : "Error"}
                </InfoModal>
              )}
            </>
          }
        />
        <Route path='/:id' element={<ViewProductionRun />} />
      </Routes>
    </div>
  );
}

const ViewProductionRun = () => {
  const { id } = useParams();

  const fetchProductionRun = async () => {
    try {
      const production = await getProductionRunById(id);
      return production;
    } catch (error) {
      throw error;
    }
  };

  const { isLoading, error, data, isFetching } = useQuery(
    ["getProductionRun", id],
    fetchProductionRun
  );

  useEffect(() => {
    console.log(data);
  }, [data]);

  return isLoading || isFetching ? (
    "Loading..."
  ) : error ? (
    "Error Loading Production, Please try again"
  ) : (
    <PrintDoc>
      <div className='bg-white p-10'>
        <DocumentHeader
          heading={`${companyFullName} Daily Production Report`}
        />
        <div className='font-medium text-gray-500 uppercase tracking-wider mb-20'>
          <p>Date:</p>
          <div>{data.date}</div>
        </div>
        <div className='mb-20'>
          <div className='w-full mb-5'>
            <p className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-5'>
              Finished Product
            </p>
            <table class=' w-full border border-gray-500 text-xs text-left text-gray-500 '>
              <thead>
                <tr class=' border-b border-gray-500 bg-gray-500'>
                  <td
                    scope='row'
                    class='px-2 border-r border-gray-500 py-2 font-medium text-white whitespace-nowrap '
                  >
                    Item
                  </td>
                  <td class='px-2 py-2 capitalize border-r border-gray-500 text-white'>
                    Quantity Bags
                  </td>
                  <td class='px-2 py-2 capitalize border-r border-gray-500 text-white'>
                    Quantity Mts
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr class=' border-b border-gray-500'>
                  <td
                    scope='row'
                    class='px-2 bg-gray-100 border-r border-gray-500 py-2 font-medium text-gray-900 whitespace-nowrap '
                  >
                    {data.finishedProduct}
                  </td>
                  <td class='px-2 py-2 capitalize border-r border-gray-500'>
                    {data.quantityProduced}
                  </td>
                  <td class='px-2 py-2 capitalize border-r border-gray-500'>
                    {(data.quantityProduced * 50) / 1000}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='w-full mb-20'>
            <p className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-5'>
              Raw Materials Used
            </p>
            <table class=' w-full border border-gray-500 text-xs text-left text-gray-500 '>
              <thead>
                <tr class=' border-b border-gray-500 bg-gray-500'>
                  <td
                    scope='row'
                    class='px-2 border-r border-gray-500 py-2 font-medium text-white whitespace-nowrap '
                  >
                    Item
                  </td>
                  <td class='px-2 py-2 capitalize border-r border-gray-500 text-white'>
                    Quantity Bags
                  </td>
                  <td class='px-2 py-2 capitalize border-r border-gray-500 text-white'>
                    Quantity Mts
                  </td>
                </tr>
              </thead>
              <tbody>
                {data?.rawMaterialsUsed.map((item, index) => (
                  <tr key={index} class=' border-b border-gray-500'>
                    <td
                      scope='row'
                      class='px-2 bg-gray-100 border-r border-gray-500 py-2 font-medium text-gray-900 whitespace-nowrap '
                    >
                      {item.material}
                    </td>
                    <td class='px-2 py-2 capitalize border-r border-gray-500'>
                      {item.quantity}
                    </td>
                    <td class='px-2 py-2 capitalize border-r border-gray-500'>
                      {(item.quantity * 50) / 1000}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='mt-10 text-xs'>
            <h2 className='font-bold mb-5 uppercase'>Production Staff:</h2>
            <div className='flex w-full'>
              <div className='flex flex-col space-y-2 flex-grow text-xs mb-5'>
                <span className='font-bold uppercase text-xs'>Name: </span>
                <div className='flex-grow'>{data.runnerName}</div>
              </div>
              <div className='flex flex-col space-y-7 flex-grow text-xs'>
                <span className='font-bold uppercase'>
                  Signature and Stamp:{" "}
                </span>
                <div className='flex-grow border-b border-gray-500'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PrintDoc>
  );
};

export default ViewProductionRuns;
