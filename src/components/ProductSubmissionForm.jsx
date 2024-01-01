import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import { createProductSubmission } from "../util/crud";
import Modal from "./Modal";
import { useQueryClient } from "react-query";
import { useItems } from "../contexts/itemsContext";

function ProductSubmissionForm() {
  const { user } = useAuth(); // Access user data from your authentication context
  const { items } = useItems();

  const queryClient = useQueryClient();

  const [productType, setProductType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const [modalData, setModalData] = useState({
    isOpen: false,
    message: "",
    isError: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isFormValid) {
      const submissionData = {
        productType,
        quantity: parseInt(quantity), // Convert to a number
        date,
        submitterId: user.userId,
        submitterName: user.name,
        status: "pending",
      };

      setIsLoading(true);
      try {
        const result = await createProductSubmission(submissionData);
        setModalData({
          isOpen: true,
          message: `Production run with ID ${result.documentId} added.`,
          isError: false,
        });
        queryClient.invalidateQueries("getProductSubmissions");
      } catch (error) {
        console.error(error);
        setModalData({
          isOpen: true,
          message: error.message,
          isError: true,
        });
      }

      // Reset the form fields after submission
      setIsLoading(false);
      setProductType("NPK20:10:10");
      setQuantity("");
      setDate("");
      setIsFormValid(false);
    }
  };

  useEffect(() => {
    setIsFormValid(!!productType && !!quantity && !!date);
  }, [productType, quantity, date]);

  return (
    <div className='container mx-auto p-4'>
      <h2 className='text-xl font-semibold mb-4'>Product Submission Form</h2>
      <form onSubmit={handleSubmit} className='w-full max-w-md'>
        <div className='mb-4'>
          <label
            htmlFor='productType'
            className='block text-gray-600 font-medium'
          >
            Product Type:
          </label>
          <select
            id='productType'
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className='w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
          >
            {items.map((item, index) => {
              return (
                item.type === "product" && (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                )
              );
            })}
          </select>
        </div>
        <div className='mb-4'>
          <label htmlFor='quantity' className='block text-gray-600 font-medium'>
            Quantity:
          </label>
          <input
            type='number'
            id='quantity'
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className='w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='date' className='block text-gray-600 font-medium'>
            Date:
          </label>
          <input
            type='date'
            id='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className='w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
          />
        </div>
        <button
          type='submit'
          className={`${
            isFormValid ? "bg-blue-500" : "bg-gray-300 pointer-events-none"
          } text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none`}
          disabled={!isFormValid}
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
      {modalData.isOpen && (
        <Modal modalData={modalData} setModalData={setModalData} />
      )}
    </div>
  );
}

export default ProductSubmissionForm;
