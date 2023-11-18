import { useEffect, useState } from "react";
import { getTrucksWithFilter } from "../../util/crud";
import InfoAlert from "../../components/alerts/InfoAlert";
import Spinner from "../../components/Spinner";

export default function AdminReceivedTrucks() {
  //Loading, empty, error states
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isError, setIsError] = useState(false);

  //all received trucks
  const [allTrucks, setAllTrucks] = useState([]);

  const [currentTab, setCurrentTab] = useState(1);

  useEffect(() => {
    const fetchAllReceivedTrucks = async () => {
      try {
        setIsLoading(true);
        const result = await getTrucksWithFilter(
          "status",
          "received",
          "dateReceived"
        );
        console.log(result);
        if (result.length === 0) setIsEmpty(true);
        setAllTrucks(result);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setIsError(true);
      }
    };
    fetchAllReceivedTrucks();
  }, []);

  return isLoading ? (
    <div className='flex items-center justify-center h-48 w-full'>
      <Spinner />
    </div>
  ) : isEmpty ? (
    <InfoAlert>There are Currently No Received Trucks</InfoAlert>
  ) : isError ? (
    <div className='p-5 bg-red-500 text-red-200'>
      Error Loading Trucks, Please Try Again.
    </div>
  ) : (
    <div>
      <div className='flex space-x-5 font-bold'>
        <button
          onClick={() => setCurrentTab(1)}
          className='px-4 py-3 bg-teal-600 text-slate-800 uppercase text-sm'
        >
          Boko Fertilizer
        </button>
        <button
          onClick={() => setCurrentTab(2)}
          className='px-4 py-3 bg-teal-600 text-slate-800 uppercase text-sm'
        >
          Other
        </button>
      </div>
      {currentTab === 1 ? <BokoDestination allTrucks={allTrucks} /> : "2"}
    </div>
  );
}

const BokoDestination = ({ allTrucks }) => {
  return "boko";
};
