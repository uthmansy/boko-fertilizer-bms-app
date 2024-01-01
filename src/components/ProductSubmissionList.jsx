import React, { useEffect } from "react";
import { useState } from "react";
import { useInfiniteQuery, useMutation, useQuery } from "react-query";
import {
  approveProductReception,
  getProductSubmissions,
  getSubmissionById,
  rejectProductSubmission,
} from "../util/crud";
import useSerielData from "../hooks/useSerielData";
import useMapSubmissions from "../hooks/useMapSubmissions";
import { Route, Routes, useParams } from "react-router-dom";
import ButtonPrimary from "./buttons/ButtonPrimary";
import DefaultTable from "./tables/DefaultTable";
import { useAuth } from "../contexts/authContext";
import InfoModal from "./InfoModal";
import PrintDoc from "./PrintDoc";
import DocumentHeader from "./DocumentHeader";

function ProductSubmissionList() {
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
    queryKey: ["getProductSubmissions"],
    queryFn: ({ pageParam = null }) => getProductSubmissions(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
  });

  const [filter, setFilter] = useState(null);
  const [serielData, setSerielData] = useSerielData(data, filter);

  const approveMutation = useMutation({
    mutationFn: ({ id, productType, user }) =>
      approveProductReception(id, productType, user.name),
    onMutate: () => {
      setOpenModal(true);
    },
    onSuccess: (id) => {
      setSerielData((prev) =>
        prev.map((submission) => {
          if (submission.id === id) submission.status = "approved";
          return submission;
        })
      );
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, user }) => rejectProductSubmission(id, user.name),
    onMutate: () => {
      setOpenModal(true);
    },
    onSuccess: (id) => {
      setSerielData((prev) =>
        prev.map((submission) => {
          if (submission.id === id) submission.status = "rejected";
          return submission;
        })
      );
    },
  });

  const handleApprove = (id, productType) =>
    approveMutation.mutate({
      id,
      productType,
      user,
    });

  const handleReject = (id) =>
    rejectMutation.mutate({
      id,
      user,
    });

  const { submissions, tableHeader } = useMapSubmissions(
    serielData,
    handleApprove,
    handleReject
  );

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => console.log(submissions), [submissions]);

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
              <div className='mb-5 flex space-x-3'>
                <ButtonPrimary onClick={() => setFilter(null)}>
                  All
                </ButtonPrimary>
                <ButtonPrimary onClick={() => setFilter("approved")}>
                  Approved
                </ButtonPrimary>
                <ButtonPrimary onClick={() => setFilter("pending")}>
                  Pending
                </ButtonPrimary>
                <ButtonPrimary onClick={() => setFilter("rejected")}>
                  Rejected
                </ButtonPrimary>
              </div>
              <DefaultTable tableHeader={tableHeader} tableData={submissions} />
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
        <Route path='/:id' element={<SubmissionSummary />} />
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
}

const SubmissionSummary = () => {
  const { id } = useParams();

  const { isLoading, error, data, isFetching } = useQuery(
    ["getSubmission", id],
    () => getSubmissionById(id)
  );

  return isLoading || isFetching ? (
    "Loading..."
  ) : error ? (
    "Error Loading Request, Please try again"
  ) : (
    <PrintDoc>
      <div className='bg-white p-20'>
        <DocumentHeader heading='Finished Product Submission' />
        <div className='font-medium text-gray-500 uppercase tracking-wider mb-20'>
          <p>Submission Date:</p>
          <div>{data.date}</div>
        </div>
        <div>
          <div className='font-medium text-gray-500 uppercase tracking-wider mb-5'>
            <p>Submitted By:</p>
            <div>{data.submitterName}</div>
          </div>
          <div className='font-medium text-gray-500 uppercase tracking-wider mb-20'>
            <p className='mb-7'>Signature & Stamp:</p>
            <div className='w-[300px] border-b border-black'></div>
          </div>
        </div>

        {data.approver && (
          <div>
            <div className='font-medium text-gray-500 uppercase tracking-wider mb-5'>
              <p>Received By:</p>
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
            Product Submitted
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
                  {data.productType}
                </td>
                <td class='px-2 py-2 capitalize border-r border-gray-500'>
                  {data.quantity}
                </td>
                <td class='px-2 py-2 capitalize border-r border-gray-500'>
                  {(data.quantity * 50) / 1000}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </PrintDoc>
  );
};

export default ProductSubmissionList;
