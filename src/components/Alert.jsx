import ButtonPrimary from "./buttons/ButtonPrimary";

export default function Alert({ alertData, setAlertData, onOk }) {
  const handleCloseAlert = () => {
    setAlertData({
      isOpen: false,
      message: "",
      disableButtons: false,
    });
  };

  const handleOk = () => {
    onOk && onOk();
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
      <div className='modal-container '>
        <div className='bg-white rounded shadow-lg modal-content max-w-lg'>
          <div
            className={`modal-header bg-blue-500  text-white p-2 rounded-t flex justify-end`}
          >
            <button
              disabled={alertData.disableButtons}
              onClick={handleCloseAlert}
              className='text-white text-xl hover:text-gray-300 transition duration-200 focus:outline-none'
            >
              <svg
                className='w-6 h-6 text-gray-800 dark:text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 20 20'
              >
                <path
                  stroke='white'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='1.1'
                  d='m13 7-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                />
              </svg>
            </button>
          </div>
          <div className='modal-body px-5 py-10'>{alertData.message}</div>
          <div className='flex space-x-2 p-5 justify-center'>
            <ButtonPrimary
              disabled={alertData.disableButtons}
              classes='bg-green-500'
              onClick={handleOk}
            >
              Ok
            </ButtonPrimary>
            <ButtonPrimary
              disabled={alertData.disableButtons}
              classes='bg-red-500'
              onClick={handleCloseAlert}
            >
              Cancel
            </ButtonPrimary>
          </div>
        </div>
      </div>
    </div>
  );
}
