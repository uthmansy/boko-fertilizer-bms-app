import { Route, Routes } from "react-router-dom";
import TopNavBar from "../../components/TopNavBar";
import { useState } from "react";
import { useEffect } from "react";
import { getItems } from "../../util/crud";
import Spinner from "../../components/Spinner";
import InfoAlert from "../../components/alerts/InfoAlert";

export default function Items() {
  return (
    <div>
      <TopNavBar
        links={[
          {
            path: "/items/",
            title: "Create New",
          },
          {
            path: "/items/all",
            title: "All Items",
          },
        ]}
      />
      <Routes>
        <Route exact path='/*' element={<CreateNew />} />
        <Route exact path='/all/*' element={<AllItems />} />
      </Routes>
    </div>
  );
}

const AllItems = () => {
  //loading, error, empty, succes states
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  //all items state
  const [allItems, setAllItems] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const result = await getItems();
        console.log(result);
        setIsLoading(false);
        if (result.length === 0) setIsEmpty(true);
        setAllItems(result);
      } catch (error) {
        setIsLoading(false);
        setIsError(true);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className='mx-auto bg-white shadow-lg rounded-lg w-full'>
      {isLoading ? (
        <div className='w-full h-48 flex items-center justify-center'>
          <Spinner /> Loading...
        </div>
      ) : isEmpty ? (
        <InfoAlert>No Items, Please Create New</InfoAlert>
      ) : isError ? (
        <div className='bg-red-500 p-5 text-white'>
          Error Loading Items, Please Try Again..
        </div>
      ) : (
        <div className='p-5 flex space-x-5'>
          <ItemsList items={allItems} type='raw' />
          <ItemsList items={allItems} type='product' />
        </div>
      )}
    </div>
  );
};

const ItemsList = ({ items, type }) => {
  return (
    <div className='mb-8 w-1/2'>
      <h2 className='text-2xl font-semibold mb-4 capitalize'>{type}</h2>
      <table className='min-w-full border border-slate-300'>
        <thead className='bg-slate-800 text-teal-500'>
          <tr>
            <th className='py-2 px-4 border-b w-5 border-r border-teal-500'>
              SN
            </th>
            <th className='py-2 px-4 border-b text-left'>Name</th>
            <th className='py-2 px-4 border-b text-left'>Code</th>
          </tr>
        </thead>
        <tbody>
          {items
            .filter((item) => item.type === type)
            .map((item, index) => (
              <tr
                key={index}
                className={(index + 1) % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className='py-2 px-4 border-b border-r'>{index + 1}</td>
                <td className='py-2 px-4 border-b'>{item.name}</td>
                <td className='py-2 px-4 border-b'>{item.code}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

const CreateNew = () => {
  return "lets create nwe heare";
};
