import { useEffect, useState } from "react";
import ButtonPrimary from "./buttons/ButtonPrimary";
import { searchTruck } from "../util/crud";
import { useMutation } from "react-query";
import DefaultTable from "./tables/DefaultTable";
import useMapTransitTrucks from "../hooks/useMapTransitTrucks";
import useMapReceivedTrucks from "../hooks/useMapReceivedTrucks";
import useMapDeliveredTrucks from "../hooks/useMapDeliveredTrucks";

export default function SearchTruck({ status }) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [serielData, setSerielData] = useState([]);
  const [count, setCount] = useState(0);

  const searchMutation = useMutation({
    mutationFn: ({ truckNumber, status }) => searchTruck(truckNumber, status),
    onMutate: () => {},
    onSuccess: (trucks) => {
      setCount((prev) => prev + 1);
      setSerielData(trucks);
    },
  });

  const statusMap = {
    transit: useMapTransitTrucks,
    received: useMapReceivedTrucks,
    delivered: useMapDeliveredTrucks,
  };

  const { trucks, tableHeader } = statusMap[status](serielData);

  const handleSearch = (e) => {
    e.preventDefault();
    searchMutation.mutate({ truckNumber: searchTerm, status });
  };

  const handleClose = (e) => {
    setCount(0);
    setSearchTerm("");
    setShowSearch(false);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "f") {
        setShowSearch(true);
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    searchTerm === "" && setCount(0);
  }, [searchTerm]);

  return (
    <>
      <div className='mb-5'>
        <ButtonPrimary
          classes={"bg-yellow-500"}
          onClick={() => setShowSearch(true)}
        >
          Search
        </ButtonPrimary>
      </div>
      {showSearch && (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-black z-50 flex items-center justify-center bg-opacity-70'>
          <div className='bg-white max-w-screen-lg w-full p-10'>
            <div className='flex justify-end'>
              <button onClick={handleClose} className='text-black'>
                <svg
                  className='w-6 h-6 text-gray-800'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 14 14'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='1.1'
                    d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                  />
                </svg>
              </button>
            </div>
            <div>
              <div className='mb-5'>
                <div>
                  <form onSubmit={handleSearch}>
                    <div className='w-fit flex flex-col p-1.5 overflow-hidden border rounded-lg dark:border-gray-600 lg:flex-row dark:focus-within:border-blue-300 focus-within:ring focus-within:ring-opacity-40 focus-within:border-blue-400 focus-within:ring-blue-300'>
                      <input
                        className='px-6 py-2 text-gray-700 placeholder-gray-500 bg-white outline-none focus:placeholder-transparent w-full'
                        type='text'
                        name='search'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder='Enter Truck Number'
                        aria-label='Enter Truck Number'
                      />

                      <button
                        type='submit'
                        disabled={searchMutation.isLoading}
                        className='px-4 py-3 text-sm font-medium tracking-wider text-gray-100 uppercase transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:bg-gray-600 focus:outline-none'
                      >
                        {searchMutation.isLoading ? "Searching..." : "Search"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div>
                {count === 0 ? (
                  "Please enter a Truck Number and Click on the Search Button"
                ) : (
                  <DefaultTable tableHeader={tableHeader} tableData={trucks} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
