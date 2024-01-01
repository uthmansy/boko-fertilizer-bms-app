import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import ButtonPrimary from "../components/buttons/ButtonPrimary";
import { Link } from "react-router-dom";

export default function useMapSubmissions(
  serielData,
  handleApprove,
  handleReject
) {
  const [submissions, setSubmissions] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    const mappedResult = serielData.map((submission) => {
      const {
        id,
        date,
        productType,
        approver,
        status,
        quantity,
        submitterName,
      } = submission;
      const data = {
        date,
        productType,
        quantity,
        submitterName,
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
        approver: approver || "Not Approved Yet",
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
              onClick={() => handleApprove(id, productType)}
              classes={"bg-green-500"}
            >
              Approve
            </ButtonPrimary>
            <ButtonPrimary
              onClick={() => handleReject(id)}
              classes={"bg-red-500"}
            >
              Reject
            </ButtonPrimary>
          </div>
        );

      return data;
    });
    setSubmissions(mappedResult);
  }, [serielData]);

  const tableHeader = [
    "SN",
    "Date",
    "Product",
    "Quantity Submitted",
    "Submitted By",
    "Status",
    "Approved By",
    "View",
  ];

  if (user.role === "inventory") tableHeader.push("Action");

  return { submissions, tableHeader };
}
