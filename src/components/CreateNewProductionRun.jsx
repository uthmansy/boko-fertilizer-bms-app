import React, { useState } from "react";
import { useAuth } from "../contexts/authContext";
import { createProductionRun } from "../util/crud";
import Modal from "./Modal";

const CreateNewProductionRun = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    date: "",
    finishedProduct: "NPK20:10:10",
    quantityProduced: "",
    rawMaterialsUsed: [{ material: "", quantity: "" }],
  });

  const [modalData, setModalData] = useState({
    isOpen: false,
    message: "",
    isError: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRawMaterialChange = (index, name, value) => {
    const updatedRawMaterials = [...formData.rawMaterialsUsed];
    updatedRawMaterials[index][name] = value;
    setFormData({
      ...formData,
      rawMaterialsUsed: updatedRawMaterials,
    });
  };

  const addRawMaterial = () => {
    setFormData({
      ...formData,
      rawMaterialsUsed: [
        ...formData.rawMaterialsUsed,
        { material: "", quantity: "" },
      ],
    });
  };

  const removeRawMaterial = (index) => {
    const updatedRawMaterials = [...formData.rawMaterialsUsed];
    updatedRawMaterials.splice(index, 1);
    setFormData({
      ...formData,
      rawMaterialsUsed: updatedRawMaterials,
    });
  };

  const isFormValid = () => {
    const { date, finishedProduct, quantityProduced, rawMaterialsUsed } =
      formData;

    return (
      date !== "" &&
      finishedProduct !== "" &&
      quantityProduced !== "" &&
      rawMaterialsUsed.every(
        (material) => material.material !== "" && material.quantity !== ""
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert("Please fill in all fields before submitting.");
      return;
    }
    setIsLoading(true);

    const dataToStore = {
      date: formData.date,
      finishedProduct: formData.finishedProduct,
      quantityProduced: formData.quantityProduced,
      rawMaterialsUsed: formData.rawMaterialsUsed,
      runnerId: user.userId,
      runnerName: user.name,
    };
    try {
      const result = await createProductionRun(dataToStore);
      setModalData({
        isOpen: true,
        message: `Production run with ID ${result} added to Firestore.`,
        isError: false,
      });
    } catch (error) {
      setModalData({
        isOpen: true,
        message: error.message,
        isError: true,
      });
    }
    setIsLoading(false);
    setFormData({
      date: "",
      finishedProduct: "NPK20:10:10",
      quantityProduced: "",
      rawMaterialsUsed: [{ material: "", quantity: "" }],
    });
  };

  return (
    <div className='max-w-screen-lg mx-auto p-4 bg-white rounded shadow-md'>
      <h2 className='text-2xl font-semibold mb-4'>Create New Production Run</h2>

      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label htmlFor='date' className='block font-medium text-sm mb-2'>
            Date:
          </label>
          <input
            type='date'
            id='date'
            name='date'
            value={formData.date}
            onChange={handleChange}
            className='w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500'
          />
        </div>

        <div className='mb-4'>
          <label
            htmlFor='finishedProduct'
            className='block font-medium text-sm mb-2'
          >
            Finished Product:
          </label>
          <select
            id='finishedProduct'
            name='finishedProduct'
            value={formData.finishedProduct}
            onChange={handleChange}
            className='w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500'
          >
            <option value='NPK20:10:10'>NPK20:10:10</option>
            <option value='NPK20:10:10+s'>NPK20:10:10+s</option>
            <option value='NPK15:15:15'>NPK15:15:15</option>
            <option value='NPK15:15:15'>NPK27:13:13</option>
          </select>
        </div>

        <div className='mb-4'>
          <label
            htmlFor='quantityProduced'
            className='block font-medium text-sm mb-2'
          >
            Quantity Produced:
          </label>
          <input
            type='number'
            id='quantityProduced'
            name='quantityProduced'
            value={formData.quantityProduced}
            onChange={handleChange}
            className='w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500'
          />
        </div>

        <div className='mb-4'>
          <label className='block font-medium text-sm mb-2'>
            Raw Materials Requested:
          </label>
          {formData.rawMaterialsUsed.map((rawMaterial, index) => (
            <div key={index} className='mb-2 flex items-center'>
              <select
                name='material'
                value={rawMaterial.material}
                onChange={(e) =>
                  handleRawMaterialChange(index, "material", e.target.value)
                }
                className='w-1/2 p-2 border rounded focus:ring-blue-500 focus:border-blue-500'
              >
                <option value=''>Select Material</option>
                <option value='MOP'>MOP</option>
                <option value='DAP'>DAP</option>
                <option value='UREA'>UREA</option>
                <option value='LSG'>LSG</option>
                <option value='GAS'>GAS</option>
              </select>
              <input
                type='number'
                name='quantity'
                value={rawMaterial.quantity}
                onChange={(e) =>
                  handleRawMaterialChange(index, "quantity", e.target.value)
                }
                className='w-1/2 p-2 border rounded focus:ring-blue-500 focus:border-blue-500'
                placeholder='Quantity'
              />
              <button
                type='button'
                className='bg-red-500 text-white ml-2 px-2 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300'
                onClick={() => removeRawMaterial(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type='button'
            className='bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300'
            onClick={addRawMaterial}
          >
            Add Raw Material
          </button>
        </div>

        <button
          type='submit'
          className={`${
            isFormValid() ? "bg-blue-500" : "bg-gray-400 pointer-events-none"
          } text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Loading..." : "Create Production Run"}
        </button>
      </form>

      {/* Custom Modal */}
      {modalData.isOpen && (
        <Modal modalData={modalData} setModalData={setModalData} />
      )}
    </div>
  );
};

export default CreateNewProductionRun;
