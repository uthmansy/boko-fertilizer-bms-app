import { useMenu } from "../contexts/menuContext";
import ButtonPrimary from "./buttons/ButtonPrimary";

export default function DashboardView({ Sidebar, MainContent }) {
  const { isMenuOpen, setIsMenuOpen } = useMenu();

  return (
    <>
      <div className='fixed top-5 right-5 z-50 lg:invisible'>
        <button
          className={`p-3 bg-black`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg
              className='w-6 h-6 text-gray-800 dark:text-white'
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
          ) : (
            <svg
              className='w-6 h-6 text-gray-800 dark:text-white'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 17 14'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='1.1'
                d='M1 1h15M1 7h15M1 13h15'
              />
            </svg>
          )}
        </button>
      </div>
      <div className='sm:flex pt-20 lg:pt-0'>
        <div
          className={`w-4/5 fixed ${
            isMenuOpen ? "left-0" : "-left-full"
          } lg:w-1/5 lg:left-0 top-0 bottom-0 z-20 transition-all`}
        >
          <Sidebar />
        </div>
        <div className='w-full lg:w-4/5 ml-auto p-5 lg:p-10 min-h-screen'>
          <MainContent />
        </div>
      </div>
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className='fixed top-0 right-0 left-0 bottom-0 bg-black bg-opacity-80 z-10'
        ></div>
      )}
    </>
  );
}
