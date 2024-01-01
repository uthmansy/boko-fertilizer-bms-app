import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import { format } from "date-fns";
import { useInfiniteQuery, useMutation, useQuery } from "react-query";
import {
  approveProductionRequest,
  getAllMaterialRequests,
  getRequestById,
  rejectMaterialRequest,
} from "../util/crud";
import ButtonPrimary from "./buttons/ButtonPrimary";
import { Link, Route, Routes, useParams } from "react-router-dom";
import DefaultTable from "./tables/DefaultTable";
import { formatTimestamp } from "../util/functions";
import PrintDoc from "./PrintDoc";
import DocumentHeader from "./DocumentHeader";
import InfoModal from "./InfoModal";

const ViewRawMaterialRequests = ({ filter = null }) => {
  const { user } = useAuth();

  const [serielData, setSerielData] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const approveMutation = useMutation({
    mutationFn: ({ id, user }) => approveProductionRequest(id, user),
    onMutate: () => {
      setOpenModal(true);
    },
    onSuccess: (id) => {
      setSerielData((prev) =>
        prev.map((request) => {
          if (request.id === id) request.status = "approved";
          return request;
        })
      );
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, user }) => rejectMaterialRequest(id, user),
    onMutate: () => {
      setOpenModal(true);
    },
    onSuccess: (id) => {
      setSerielData((prev) =>
        prev.map((request) => {
          if (request.id === id) request.status = "rejected";
          return request;
        })
      );
    },
  });

  const fetchRequests = async ({ pageParam = null }) => {
    try {
      const result = await getAllMaterialRequests(pageParam);

      return result;
    } catch (error) {
      throw error;
    }
  };

  const {
    isLoading,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["getMaterialRequests"],
    queryFn: fetchRequests,
    getNextPageParam: (lastPage, pages) => lastPage.nextPageToken,
  });

  useEffect(() => {
    console.log(allRequests);
  }, [allRequests]);

  useEffect(() => {
    if (data) {
      let serielData = [];

      data.pages.forEach((page) => {
        page.data.forEach((data) => serielData.push(data));
      });
      setSerielData(serielData);
    }
  }, [data]);

  useEffect(() => {
    filter
      ? setAllRequests(serielData.filter((data) => data.status === filter))
      : setAllRequests(serielData);
  }, [filter, serielData]);

  useEffect(() => {
    let filteredData = serielData;

    if (filter) {
      filteredData = serielData.filter((request) => request.status === filter);
    }

    const mappedResult = filteredData.map((request) => {
      const { id, requestDate, requester, approver, rawMaterials, status } =
        request;
      const data = {
        requestDate: formatTimestamp(requestDate),
        requester,
        approver: approver || "Not Yet Approved",
        rawMaterials: rawMaterials.map((material, index) => (
          <li key={index} className=''>
            {material.material}: {material.quantity}
          </li>
        )),
        status: (
          <div
            className={`bg-${
              status === "approved"
                ? "green"
                : status === "pending"
                ? "blue"
                : "red"
            }-500 rounded-full  text-white uppercase p-2 flex items-center bg-o justify-center`}
          >
            {status}
          </div>
        ),
        viewButton: (
          <ButtonPrimary>
            <Link to={id}>View</Link>
          </ButtonPrimary>
        ),
      };

      if (user.role === "inventory")
        data.action = status === "pending" && (
          <div className='flex space-x-2'>
            <ButtonPrimary
              onClick={() => approveMutation.mutate({ id, user })}
              classes={"bg-green-500"}
            >
              Approve
            </ButtonPrimary>
            <ButtonPrimary
              onClick={() => rejectMutation.mutate({ id, user })}
              classes={"bg-red-500"}
            >
              Reject
            </ButtonPrimary>
          </div>
        );

      return data;
    });

    setAllRequests(mappedResult);
  }, [serielData, filter]);

  const tableHeader = [
    "SN",
    "Date",
    "Requester",
    "Approver",
    "Materials Requested",
    "Status",
    "View",
  ];
  if (user.role === "inventory") tableHeader.push("Action");

  return isLoading ? (
    <div>Loading....</div>
  ) : error ? (
    <div>Error Loading Production Requests...</div>
  ) : (
    <div>
      <Routes>
        <Route
          path='/*'
          element={
            <>
              <div>
                <ButtonPrimary onClick={refetch}>Refresh</ButtonPrimary>
              </div>
              <DefaultTable tableHeader={tableHeader} tableData={allRequests} />
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
            </>
          }
        />
        <Route path='/:id' element={<RequestSummary />} />
      </Routes>
      {openModal && (
        <InfoModal close={() => setOpenModal(false)}>
          {approveMutation.isLoading || rejectMutation.isLoading
            ? "loading..."
            : approveMutation.isSuccess || rejectMutation.isSuccess
            ? "Success"
            : "Error"}
        </InfoModal>
      )}
    </div>
  );
};

const RequestSummary = () => {
  const { id } = useParams();
  const fetchRequest = async () => {
    try {
      const result = await getRequestById(id);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const { isLoading, error, data, isFetching } = useQuery(
    ["getRequest", id],
    fetchRequest
  );

  return isLoading || isFetching ? (
    "Loading..."
  ) : error ? (
    "Error Loading Request, Please try again"
  ) : (
    <PrintDoc>
      <div className='bg-white p-20'>
        <DocumentHeader heading='Raw Material Request' />
        <div className='font-medium text-gray-500 uppercase tracking-wider mb-20'>
          <p>Date:</p>
          <div>{formatTimestamp(data.requestDate)}</div>
        </div>
        <div>
          <div className='font-medium text-gray-500 uppercase tracking-wider mb-5'>
            <p>Requested By:</p>
            <div>{data.requester}</div>
          </div>
          <div className='font-medium text-gray-500 uppercase tracking-wider mb-20'>
            <p className='mb-7'>Signature & Stamp:</p>
            <div className='w-[300px] border-b border-black'></div>
          </div>
        </div>

        {data.approver && (
          <div>
            <div className='font-medium text-gray-500 uppercase tracking-wider mb-5'>
              <p>Approved By:</p>
              <div>{data.approver}</div>
            </div>
            <div className='font-medium text-gray-500 uppercase tracking-wider mb-20'>
              <p className='mb-7'>Signature & Stamp:</p>
              <div className='w-[300px] border-b border-black'></div>
            </div>
          </div>
        )}
        {data.rejectedBy && (
          <div>
            <div className='font-medium text-gray-500 uppercase tracking-wider mb-5'>
              <p>Rejected By:</p>
              <div>{data.rejectedBy}</div>
            </div>
            <div className='font-medium text-gray-500 uppercase tracking-wider mb-20'>
              <p className='mb-7'>Signature & Stamp:</p>
              <div className='w-[300px] border-b border-black'></div>
            </div>
          </div>
        )}
        <div className='w-full mb-20'>
          <p className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-5'>
            Raw Materials Requested
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
              {data?.rawMaterials.map((item, index) => (
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
      </div>
    </PrintDoc>
  );
};

export default ViewRawMaterialRequests;
