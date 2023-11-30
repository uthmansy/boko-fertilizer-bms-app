import { Link, Route, Routes, useParams } from "react-router-dom";
import TopNavBar from "./TopNavBar";
import { useState } from "react";
import { useItems } from "../contexts/itemsContext";
import { useEffect } from "react";
import {
  disableArrowKeys,
  disableScroll,
  formatMoney,
  generateTransactionOrderNumber,
  moneyStringToNumber,
} from "../util/functions";
import Modal from "./Modal";
import {
  createTransaction,
  getLastTransactionSequence,
  getTransactionById,
  getTransactions,
} from "../util/crud";
import { useAuth } from "../contexts/authContext";
import Spinner from "./Spinner";
import RefreshButton from "./RefreshButton";
import BackButton from "./BackButton";
import InfoAlert from "./alerts/InfoAlert";
import AddPaymentForm from "./AddPaymentForm";
import ButtonPrimary from "./buttons/ButtonPrimary";
import PrintDoc from "./PrintDoc";
import IMAGES from "../assets/images/Images";
import { useMenu } from "../contexts/menuContext";

const AccountingSales = () => {
  const { setIsMenuOpen } = useMenu();

  useEffect(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <div>
      <TopNavBar
        links={[
          {
            path: "/sales",
            title: "Create New",
          },
          {
            path: "/sales/all",
            title: "All Sales",
          },
        ]}
      />
      <Routes>
        <Route exact path='/*' element={<CreateNew />} />
        <Route exact path='/all/*' element={<AllSales />} />
      </Routes>
    </div>
  );
};

const CreateNew = () => {
  const [formData, setFormData] = useState({
    buyerName: "",
    buyerPhone: "",
    pickUpLocation: "",
    itemsSold: [{ itemId: "", quantity: 0 }],
    totalCost: "",
    date: "",
  });
  const [formIsValid, setFormIsValid] = useState(false);
  const [modalData, setModalData] = useState({
    isOpen: false,
    message: "",
    isError: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { items } = useItems();

  const checkFormValidity = () => {
    const isBuyerName = formData.buyerName.trim() !== "";
    const isBuyerPhone = formData.buyerPhone.trim() !== "";
    const isPickUpLocationValid = formData.pickUpLocation.trim() !== "";
    const isTotalCostValid = formData.totalCost.trim() !== "";
    const isDateValid = formData.date !== "";
    const isItemsSoldValid = formData.itemsSold.every(
      (item) => item.itemId && item.quantity > 0 && isDateValid
    );

    setFormIsValid(
      isBuyerName &&
        isBuyerPhone &&
        isItemsSoldValid &&
        isTotalCostValid &&
        isPickUpLocationValid
    );
  };

  useEffect(() => {
    checkFormValidity();
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    checkFormValidity();
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    checkFormValidity();
  };

  const handleItemChange = (index, field, value) => {
    const itemsSold = [...formData.itemsSold];
    itemsSold[index][field] = value;
    // itemsSold[index][taken] = 0;
    setFormData({
      ...formData,
      itemsSold,
    });
    checkFormValidity();
  };

  const handleTotalCostChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatMoney(value);

    setFormData({
      ...formData,
      totalCost: formattedValue,
    });
    checkFormValidity();
  };

  const addItem = () => {
    setFormData({
      ...formData,
      itemsSold: [...formData.itemsSold, { itemId: "", quantity: 0 }],
    });
    checkFormValidity(); // Trigger form validation check
  };

  const removeItem = (index) => {
    const itemsSold = [...formData.itemsSold];
    itemsSold.splice(index, 1);
    setFormData({
      ...formData,
      itemsSold,
    });
    checkFormValidity(); // Trigger form validation check
  };

  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const {
      buyerName,
      buyerPhone,
      itemsSold: rawItemsSold,
      pickUpLocation,
      totalCost,
      date,
    } = formData;

    const itemsSold = rawItemsSold.map((item) => {
      return { itemId: item.itemId, quantity: item.quantity, taken: 0 };
    });

    try {
      const lastSequenceNumber = await getLastTransactionSequence("sale");

      const payload = {
        beneficiaryName: "Boko Fertilizer",
        beneficiaryPhone: "08169669906",
        buyerName,
        buyerPhone,
        pickUpLocation,
        itemsSold,
        totalCost: moneyStringToNumber(totalCost),
        date,
        createdBy: user.name,
        type: "sale",
        numericCost: moneyStringToNumber(formData.totalCost),
        payments: [],
        status: "unfulfilled",
        totalPaid: 0,
        sequenceNumber: lastSequenceNumber + 1,
        orderNumber: generateTransactionOrderNumber(
          lastSequenceNumber + 1,
          "sale"
        ),
      };
      await createTransaction(payload);
      setModalData({
        isOpen: true,
        message: `Sale Created Successfully`,
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
      buyerName: "",
      buyerPhone: "",
      pickUpLocation: "",
      itemsSold: [{ itemId: "", quantity: 0 }],
      totalCost: "",
      date: "",
    });
  };

  const renderSelect = (item, index) => (
    <div key={index} className='mb-4 p-4 border rounded-lg'>
      <select
        name='itemId'
        value={item.itemId}
        onChange={(e) => handleItemChange(index, "itemId", e.target.value)}
        className='w-full p-2 border rounded'
      >
        <option value=''>Select an item</option>
        {items.map((item, index) => (
          <option key={index} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
      <label className='mt-2 block'>Quantity (bags):</label>
      <input
        type='number'
        name='quantity'
        value={item.quantity}
        onKeyDown={disableArrowKeys}
        onWheel={disableScroll}
        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
        className='w-full p-2 border rounded'
      />
      <button
        type='button'
        onClick={() => removeItem(index)}
        className='mt-2 p-2 bg-red-500 text-white rounded hover:bg-red-600'
      >
        Remove
      </button>
    </div>
  );

  return (
    <div className='p-4 mx-auto bg-white shadow-lg rounded-lg w-full'>
      <h2 className='text-2xl mb-4 font-bold'>Create a Sale</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block mb-2'>Date:</label>
          <input
            type='date'
            name='date'
            value={formData.date}
            onChange={handleDateChange}
            className='w-full p-2 border rounded'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Buyer Name:</label>
          <input
            type='text'
            name='buyerName'
            value={formData.buyerName}
            onChange={handleInputChange}
            className='w-full p-2 border rounded'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Buyer Phone:</label>
          <input
            type='number'
            name='buyerPhone'
            onKeyDown={disableArrowKeys}
            onWheel={disableScroll}
            value={formData.buyerPhone}
            onChange={handleInputChange}
            className='w-full p-2 border rounded'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Pick Up Location:</label>
          <select
            name='pickUpLocation'
            value={formData.pickUpLocation}
            onChange={handleInputChange}
            className='w-full p-2 border rounded'
          >
            <option value=''>Select an item</option>
            <option value='boko'>Boko Fertilizer Warehouse</option>
            <option value='others'>Others</option>
          </select>
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Items Sold:</label>
          {formData.itemsSold.map((item, index) => renderSelect(item, index))}
          <button
            type='button'
            onClick={addItem}
            className='p-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Add Item
          </button>
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Total Cost (₦):</label>
          <input
            type='text'
            name='totalCost'
            value={formData.totalCost}
            onChange={handleTotalCostChange}
            className='w-full p-2 border rounded'
          />
        </div>
        <button
          type='submit'
          disabled={!formIsValid || isLoading}
          className=' px-4 p-2 bg-green-500 disabled:bg-gray-300 text-white rounded hover-bg-green-600'
        >
          {isLoading ? "Loading..." : "Create Sale"}
        </button>
      </form>
      {modalData.isOpen && (
        <Modal modalData={modalData} setModalData={setModalData} />
      )}
    </div>
  );
};

const AllSales = () => {
  const { items } = useItems();

  const [allSales, setAllSales] = useState([]);
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    try {
      const fetchAllSales = async () => {
        setIsLoading(true);
        const result = await getTransactions("sale");
        setSales(result);
        setAllSales(result);
        setIsLoading(false);
      };
      fetchAllSales();
    } catch (error) {}
  }, [refresh]);

  return isLoading ? (
    <div className='h-20 w-full flex items-center justify-center'>
      <Spinner />
    </div>
  ) : (
    <>
      <Routes>
        <Route
          exact
          path='/*'
          element={
            <div className='container mx-auto bg-white p-4 shadow-md rounded-md overflow-x-auto'>
              <RefreshButton refresh={refresh} setRefresh={setRefresh} />
              <h1 className='text-2xl font-bold mb-3 mt-3'>
                Sales Transaction List
              </h1>
              <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 mb-5'>
                <ButtonPrimary
                  classes='bg-red-500'
                  onClick={() => setSales(allSales)}
                >
                  ALL
                </ButtonPrimary>
                {items.map((item, index) => (
                  <ButtonPrimary
                    classes='bg-red-500'
                    key={index}
                    onClick={() =>
                      setSales(
                        allSales.filter(
                          (sale) => sale.itemsSold[0].itemId === item.name
                        )
                      )
                    }
                  >
                    {item.name}
                  </ButtonPrimary>
                ))}
              </div>
              <table className='w-full border-collapse border rounded-lg text-sm'>
                <thead>
                  <tr>
                    <th className='p-3 bg-gray-100 text-center'>SN</th>
                    <th className='p-3 text-left bg-gray-100'>Buyer</th>
                    <th className='p-3 text-left bg-gray-100'>Amount</th>
                    <th className='p-3 text-left bg-gray-100'>Status</th>
                    <th className='p-3 text-left bg-gray-100'>Items Sold</th>
                    <th className='p-3 text-left bg-gray-100'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale, index) => (
                    <tr key={sale.id} className='hover:bg-gray-100 border-b'>
                      <td className='p-3 border-r text-center'>{index + 1}</td>
                      <td className='p-3'>{sale.buyerName}</td>
                      <td className='p-3'>{formatMoney(sale.totalCost)}</td>
                      <td className='p-3'>{sale.status}</td>
                      <td className='p-3 border-r border-l'>
                        <ul className='list-style-none'>
                          {sale.itemsSold.map((item, index) => (
                            <li className='flex' key={index}>
                              <span className='font-bold'>{item.itemId}:</span>{" "}
                              <span className='text-green-500 flex-grow text-right mr-5'>
                                {item.quantity} Bags
                              </span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className='p-3'>
                        <Link
                          to={`/sales/all/${sale.id}`}
                          className='hover:underline bg-blue-500 p-2 px-3 text-white w-full inline-block text-center'
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        />
        <Route
          exact
          path='/:transactionId/*'
          element={<TransactionSummary />}
        />
      </Routes>
      {sales.length === 0 && (
        <InfoAlert>There are Currently no Sales</InfoAlert>
      )}
    </>
  );
};

function TransactionSummary() {
  const [transaction, setTransaction] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [modalData, setModalData] = useState({
    isOpen: false,
    message: "",
    isError: false,
  });

  const { transactionId } = useParams();

  useEffect(() => {
    try {
      const fetchTransaction = async () => {
        setIsLoading(true);
        const result = await getTransactionById(transactionId);
        setTransaction(result);
        setIsLoading(false);
      };
      fetchTransaction();
    } catch (error) {}
  }, [refresh]);
  return isLoading ? (
    <div className='h-20 w-full flex items-center justify-center'>
      <Spinner />
    </div>
  ) : (
    <Routes>
      <Route
        path='/*'
        element={
          <div className='border border-gray-200 sm:rounded-lg container mx-auto p-4 bg-white rounded-md shadow-md overflow-x-auto'>
            <div className='mb-5 flex space-x-2'>
              <RefreshButton refresh={refresh} setRefresh={setRefresh} />
              <BackButton />
              <Link to='print'>
                <ButtonPrimary>Print</ButtonPrimary>
              </Link>
            </div>
            <h1 className='text-xl font-bold mb-4'>Sale Transaction Summary</h1>
            <table className='min-w-full'>
              <tbody className='bg-white divide-y divide-gray-200'>
                <tr>
                  <td className='px-6 py-4'>
                    <p className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Date
                    </p>
                    <p>{transaction?.date}</p>
                  </td>
                </tr>
                <tr>
                  <td className='px-6 py-4'>
                    <p className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Created By
                    </p>
                    <p>{transaction?.createdBy}</p>
                  </td>
                </tr>
                <tr>
                  <td className='px-6 py-4'>
                    <p className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Order Number
                    </p>
                    <p>{transaction?.orderNumber}</p>
                  </td>
                </tr>
                <tr>
                  <td className='px-6 py-4'>
                    <p className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Buyer
                    </p>
                    <p>{transaction?.buyerName}</p>
                  </td>
                </tr>
                <tr>
                  <td className='px-6 py-4'>
                    <p className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Buyer Phone
                    </p>
                    <p>{transaction?.buyerPhone}</p>
                  </td>
                </tr>
                {transaction?.pickUpLocation !== "others" && (
                  <tr>
                    <td className='px-6 py-4'>
                      <p className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Pick Up Location
                      </p>
                      <p>{transaction?.pickUpLocation}</p>
                    </td>
                  </tr>
                )}

                <tr>
                  <td className='px-6 py-4'>
                    <p className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Items Sold
                    </p>
                    <ul>
                      {transaction?.itemsSold.map((item, index) => (
                        <li
                          className=' flex max-w-md justify-between'
                          key={index}
                        >
                          <span className='font-bold'>{item.itemId}</span>
                          <span className='font-bold text-green-500'>{`Quantity: ${item.quantity}`}</span>
                          <span className='font-bold text-blue-500'>{`Quantity Taken: ${item.taken}`}</span>
                          <span className='font-bold text-red-500'>{`Balance: ${
                            item.quantity - item.taken
                          }`}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>

                <tr>
                  <td className='px-6 py-4'>
                    <p className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Total Cost
                    </p>
                    <p>{formatMoney(transaction?.totalCost)}</p>
                  </td>
                </tr>
                <tr>
                  <td className='px-6 py-4'>
                    <p className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Total Paid
                    </p>
                    <p>{formatMoney(transaction?.totalPaid)}</p>
                  </td>
                </tr>
                <tr>
                  <td className='px-6 py-4'>
                    <p className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Balance
                    </p>
                    <p>
                      {formatMoney(
                        transaction?.totalCost - transaction?.totalPaid
                      )}
                    </p>
                  </td>
                </tr>
                {transaction?.payments.length != 0 && (
                  <tr>
                    <td className='px-6 py-4'>
                      <p className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Payments
                      </p>
                      <table className='w-full border-collapse border rounded-lg text-sm my-5 bg-green-50'>
                        <thead>
                          <tr>
                            <th className='p-3 bg-gray-500 text-white text-center'>
                              SN
                            </th>
                            <th className='p-3 bg-gray-500 text-white text-center'>
                              Date
                            </th>
                            <th className='p-3 text-left bg-gray-500 text-white'>
                              Beneficiary
                            </th>
                            <th className='p-3 text-left bg-gray-500 text-white'>
                              Account
                            </th>
                            <th className='p-3 text-left bg-gray-500 text-white'>
                              Bank
                            </th>
                            <th className='p-3 text-left bg-gray-500 text-white'>
                              Amount
                            </th>
                            <th className='p-3 text-left bg-gray-500 text-white'>
                              Payment Reference
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {transaction?.payments.map((payment, index) => (
                            <tr
                              key={payment.id}
                              className='hover:bg-gray-100 border-b'
                            >
                              <td className='p-3 border-r text-center'>
                                {index + 1}
                              </td>
                              <td className='p-3'>{payment.date}</td>
                              <td className='p-3'>{payment.beneficiaryName}</td>
                              <td className='p-3'>
                                {payment.beneficiaryAccount}
                              </td>
                              <td className='p-3'>{payment.beneficiaryBank}</td>
                              <td className='p-3'>
                                {formatMoney(payment.amount)}
                              </td>
                              <td className='p-3'>{payment.paymentRef}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {transaction?.status != "completed" && (
              <AddPaymentForm
                transactionId={transactionId}
                setModalData={setModalData}
              />
            )}
            {modalData.isOpen && (
              <Modal
                modalData={modalData}
                setModalData={setModalData}
                onClose={() => setRefresh(refresh + 1)}
              />
            )}
          </div>
        }
      />
      <Route path='/print' element={<PrintPage transaction={transaction} />} />
    </Routes>
  );
}

const PrintPage = ({ transaction }) => {
  return (
    <PrintDoc>
      <div className='max-w-full'>
        {/* A4 Paper Size */}
        <div
          className='bg-white p-8 relative'
          style={{ width: "8.3in", height: "11.7in" }}
        >
          <div className='absolute flex items-center justify-center top-0 left-0 right-0 bottom-0'>
            <div className='p-5 text-8xl font-bold  border-8 border-red-500 text-red-500 rotate-45 opacity-50 rounded-3xl'>
              CONFIDENTIAL
            </div>
          </div>
          <div className='mb-10 flex items-center flex-col'>
            <img className='w-24' src={IMAGES.logo} alt='logo' />

            <h1 className='font-black text-3xl uppercase text-center'>
              Boko Fertilizer Transaction Record
            </h1>
            <div className=''>
              No.60/61 UNGOGO ROAD KANO, KANO STATE UNGOGO, 700105, Kano
            </div>
          </div>
          <div className='mb-5'>
            <div className='w-1/2'></div>
            <div className='w-full mb-5'>
              <table class=' w-full border border-gray-500 text-xs text-left text-gray-500 '>
                <tbody>
                  <tr class=' border-b border-gray-500'>
                    <td
                      scope='row'
                      class='px-2 bg-gray-100 border-r border-gray-500 py-2 font-medium text-gray-900 whitespace-nowrap '
                    >
                      Transaction Type
                    </td>
                    <td class='px-2 py-2 capitalize'>{transaction?.type}</td>
                  </tr>
                  <tr class=' border-b border-gray-500'>
                    <td
                      scope='row'
                      class='bg-gray-100 border-r border-gray-500 px-2 py-2 font-medium text-gray-900 whitespace-nowrap '
                    >
                      Order Date
                    </td>
                    <td class='px-2 py-2'>{transaction?.date}</td>
                  </tr>
                  <tr class=' border-b border-gray-500'>
                    <td
                      scope='row'
                      class='bg-gray-100 border-r border-gray-500 px-2 py-2 font-medium text-gray-900 whitespace-nowrap '
                    >
                      Order Number
                    </td>
                    <td class='px-2 py-2'>{transaction?.orderNumber}</td>
                  </tr>
                  <tr class=' border-b border-gray-500'>
                    <td
                      scope='row'
                      class='bg-gray-100 border-r border-gray-500 px-2 py-2 font-medium text-gray-900 whitespace-nowrap '
                    >
                      Created By
                    </td>
                    <td class='px-2 py-2'>{transaction?.createdBy}</td>
                  </tr>
                  <tr class=' border-b border-gray-500'>
                    <td
                      scope='row'
                      class='bg-gray-100 border-r border-gray-500 px-2 py-2 font-medium text-gray-900 whitespace-nowrap '
                    >
                      Buyer
                    </td>
                    <td class='px-2 py-2'>{transaction?.buyerName}</td>
                  </tr>
                  <tr class=' border-b border-gray-500'>
                    <td
                      scope='row'
                      class='bg-gray-100 border-r border-gray-500 px-2 py-2 font-medium text-gray-900 whitespace-nowrap '
                    >
                      Buyer Phone
                    </td>
                    <td class='px-2 py-2'>{transaction?.buyerPhone}</td>
                  </tr>
                  <tr class=' border-b border-gray-500'>
                    <td
                      scope='row'
                      class='bg-gray-100 border-r border-gray-500 px-2 py-2 font-medium text-gray-900 whitespace-nowrap '
                    >
                      Total Cost
                    </td>
                    <td class='px-2 py-2'>
                      {formatMoney(transaction?.totalCost)}
                    </td>
                  </tr>
                  <tr class=' border-b border-gray-500'>
                    <td
                      scope='row'
                      class='bg-gray-100 border-r border-gray-500 px-2 py-2 font-medium text-gray-900 whitespace-nowrap '
                    >
                      Total Paid
                    </td>
                    <td class='px-2 py-2'>
                      {formatMoney(transaction?.totalPaid)}
                    </td>
                  </tr>
                  <tr class=' border-b border-gray-500'>
                    <td
                      scope='row'
                      class='bg-gray-100 border-r border-gray-500 px-2 py-2 font-medium text-gray-900 whitespace-nowrap '
                    >
                      Balance
                    </td>
                    <td class='px-2 py-2'>
                      {formatMoney(
                        transaction?.totalCost - transaction?.totalPaid
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='w-full mb-5'>
              <p className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-5'>
                Items
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
                      Quantity
                    </td>
                    <td class='px-2 py-2 capitalize border-r border-gray-500 text-white'>
                      Quantity Taken
                    </td>
                    <td class='px-2 py-2 capitalize border-r border-gray-500 text-white'>
                      Balance
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {transaction?.itemsSold.map((item, index) => (
                    <tr key={index} class=' border-b border-gray-500'>
                      <td
                        scope='row'
                        class='px-2 bg-gray-100 border-r border-gray-500 py-2 font-medium text-gray-900 whitespace-nowrap '
                      >
                        {item.itemId}
                      </td>
                      <td class='px-2 py-2 capitalize border-r border-gray-500'>
                        {item.quantity}
                      </td>
                      <td class='px-2 py-2 capitalize border-r border-gray-500'>
                        {item.taken}
                      </td>
                      <td class='px-2 py-2 capitalize border-r border-gray-500'>
                        {item.quantity - item.taken}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              {transaction?.payments.length != 0 && (
                <>
                  {" "}
                  <p className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Payments
                  </p>
                  <table className='w-full border-collapse border rounded-lg text-sm my-5 bg-green-50'>
                    <thead>
                      <tr>
                        <th className='p-3 bg-gray-500 text-white text-center'>
                          SN
                        </th>
                        <th className='p-3 bg-gray-500 text-white text-center'>
                          Date
                        </th>
                        <th className='p-3 text-left bg-gray-500 text-white'>
                          Beneficiary
                        </th>
                        <th className='p-3 text-left bg-gray-500 text-white'>
                          Account
                        </th>
                        <th className='p-3 text-left bg-gray-500 text-white'>
                          Bank
                        </th>
                        <th className='p-3 text-left bg-gray-500 text-white'>
                          Amount
                        </th>
                        <th className='p-3 text-left bg-gray-500 text-white'>
                          Payment Reference
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transaction?.payments.map((payment, index) => (
                        <tr
                          key={payment.id}
                          className='hover:bg-gray-100 border-b'
                        >
                          <td className='p-3 border-r text-center'>
                            {index + 1}
                          </td>
                          <td className='p-3'>{payment.date}</td>
                          <td className='p-3'>{payment.beneficiaryName}</td>
                          <td className='p-3'>{payment.beneficiaryAccount}</td>
                          <td className='p-3'>{payment.beneficiaryBank}</td>
                          <td className='p-3'>{formatMoney(payment.amount)}</td>
                          <td className='p-3'>{payment.paymentRef}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </PrintDoc>
  );
};

export default AccountingSales;
