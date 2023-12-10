import Sidebar from "../../components/Sidebar";

export default function AcountingSidebar() {
  const menuItems = [
    {
      link: "/",
      title: "Sales",
      icon: (
        <svg
          className='w-5 h-5 text-gray-800 dark:text-white'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 20 16'
        >
          <path
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.2'
            d='M15.5 10.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm0 0a2.225 2.225 0 0 0-1.666.75H12m3.5-.75a2.225 2.225 0 0 1 1.666.75H19V7m-7 4V3h5l2 4m-7 4H6.166a2.225 2.225 0 0 0-1.666-.75M12 11V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v9h1.834a2.225 2.225 0 0 1 1.666-.75M19 7h-6m-8.5 3.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z'
          />
        </svg>
      ),
    },
    {
      link: "/purchases",
      title: "Purchases",
      icon: (
        <svg
          className='w-5 h-5 text-gray-800 dark:text-white'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 16 20'
        >
          <path
            stroke='currentColor'
            strokeLinejoin='round'
            strokeWidth='1.2'
            d='M6 1v4a1 1 0 0 1-1 1H1m14-4v16a.97.97 0 0 1-.933 1H1.933A.97.97 0 0 1 1 18V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 1h8.239A.97.97 0 0 1 15 2Z'
          />
        </svg>
      ),
    },

    {
      link: "/salaries",
      title: "Salaries",
      icon: (
        <svg
          className='w-6 h-6 text-gray-800 dark:text-white'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 20 16'
        >
          <path
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.1'
            d='M5 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1M2 5h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm8 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z'
          />
        </svg>
      ),
    },
    {
      link: "/transport-fee",
      title: "Transport Fee",
      icon: (
        <svg
          className='w-6 h-6 text-gray-800 dark:text-white'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 11 20'
        >
          <path
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.1'
            d='M1.75 15.363a4.954 4.954 0 0 0 2.638 1.574c2.345.572 4.653-.434 5.155-2.247.502-1.813-1.313-3.79-3.657-4.364-2.344-.574-4.16-2.551-3.658-4.364.502-1.813 2.81-2.818 5.155-2.246A4.97 4.97 0 0 1 10 5.264M6 17.097v1.82m0-17.5v2.138'
          />
        </svg>
      ),
    },
    // {
    // 	link: "/salaries",
    // 	title: "Salaries",
    // 	icon: (
    // 		<svg
    // 			className="w-5 h-5 text-gray-800 dark:text-white"
    // 			aria-hidden="true"
    // 			xmlns="http://www.w3.org/2000/svg"
    // 			fill="none"
    // 			viewBox="0 0 14 20">
    // 			<path
    // 				stroke="currentColor"
    // 				strokeLinecap="round"
    // 				strokeLinejoin="round"
    // 				strokeWidth="1.2"
    // 				d="M4 6h6m-6 4h6m-6 4h6M1 1v18l2-2 2 2 2-2 2 2 2-2 2 2V1l-2 2-2-2-2 2-2-2-2 2-2-2Z"
    // 			/>
    // 		</svg>
    // 	),
    // },
    // {
    // 	link: "/expenses",
    // 	title: "Expenses",
    // 	icon: (
    // 		<svg
    // 			className="w-5 h-5 text-gray-800 dark:text-white"
    // 			aria-hidden="true"
    // 			xmlns="http://www.w3.org/2000/svg"
    // 			fill="none"
    // 			viewBox="0 0 14 20">
    // 			<path
    // 				stroke="currentColor"
    // 				strokeLinecap="round"
    // 				strokeLinejoin="round"
    // 				strokeWidth="1.2"
    // 				d="M4 6h6m-6 4h6m-6 4h6M1 1v18l2-2 2 2 2-2 2 2 2-2 2 2V1l-2 2-2-2-2 2-2-2-2 2-2-2Z"
    // 			/>
    // 		</svg>
    // 	),
    // },
  ];
  return <Sidebar menuItems={menuItems} />;
}
