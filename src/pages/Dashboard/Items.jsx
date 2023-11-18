import { Route, Routes } from "react-router-dom";
import TopNavBar from "../../components/TopNavBar";
import { useState } from "react";
import { useEffect } from "react";
import { createNewItem, getItems } from "../../util/crud";
import Spinner from "../../components/Spinner";
import InfoAlert from "../../components/alerts/InfoAlert";
import Modal from "../../components/Modal";

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
  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState({
    isOpen: false,
    message: "",
    isError: false,
  });
  const [formIsValid, setFormIsValid] = useState(false);

  const [itemName, setItemName] = useState("");
  const [type, setType] = useState("raw"); // Default to "raw"

  const checkFormValidity = () => {
    const isItemNameValid = itemName.trim() !== "";
    setFormIsValid(isItemNameValid && type); // Validate both item name and type
  };

  const handleInputChange = (e) => {
    const updatedName = e.target.value.replace(/\s/g, "-");
    setItemName(updatedName);
    checkFormValidity();
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    checkFormValidity();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await createNewItem(itemName, type); // Pass itemName and type to createNewItem
      setModalData({
        isOpen: true,
        message: "Successfully Created New Item",
        isError: false,
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false); // Set isLoading to false on error
      setModalData({
        isOpen: true,
        message: error.message,
        isError: true,
      });
    }
  };

  return (
    <div className='mx-auto bg-white shadow-lg rounded-lg w-full p-5'>
      <form onSubmit={handleSubmit} className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Item Name:
          <input
            type='text'
            value={itemName}
            onChange={handleInputChange}
            className='mt-1 p-2 border border-gray-300 rounded-md w-full'
            placeholder='Enter item name'
          />
        </label>
        <label className='block text-sm font-medium text-gray-700 mt-2'>
          Item Type:
          <select
            value={type}
            onChange={handleTypeChange}
            className='mt-1 p-2 border border-gray-300 rounded-md w-full'
          >
            <option value='raw'>Raw</option>
            <option value='product'>Product</option>
          </select>
        </label>
        <button
          type='submit'
          disabled={!formIsValid || isLoading}
          className='mt-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300'
        >
          {isLoading ? "Loading..." : "Add Item"}
        </button>
      </form>
      {modalData.isOpen && (
        <Modal
          modalData={modalData}
          setModalData={setModalData}
          onClose={() => setIsLoading(false)}
        />
      )}
    </div>
  );
};
