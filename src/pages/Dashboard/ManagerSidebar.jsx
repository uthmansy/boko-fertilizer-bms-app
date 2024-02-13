import Sidebar from "../../components/Sidebar";

export default function ManagerSidebar() {
  const menuItems = [
    {
      link: "/",
      title: "Summary",
      icon: (
        <svg
          className='w-5 h-5'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 14 20'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.2'
            d='M4 6h6m-6 4h6m-6 4h6M1 1v18l2-2 2 2 2-2 2 2 2-2 2 2V1l-2 2-2-2-2 2-2-2-2 2-2-2Z'
          />
        </svg>
      ),
    },

    // {
    //   link: "/purchases",
    //   title: "Purchases",
    //   icon: (
    //     <svg
    //       className='w-6 h-6'
    //       aria-hidden='true'
    //       xmlns='http://www.w3.org/2000/svg'
    //       fill='none'
    //       viewBox='0 0 18 20'
    //     >
    //       <path
    //         strokeLinecap='round'
    //         strokeLinejoin='round'
    //         strokeWidth='1.1'
    //         d='M12 9V4a3 3 0 0 0-6 0v5m9.92 10H2.08a1 1 0 0 1-1-1.077L2 6h14l.917 11.923A1 1 0 0 1 15.92 19Z'
    //       />
    //     </svg>
    //   ),
    // },
    {
      link: "/sales",
      title: "Sales",
      icon: (
        <svg
          className='w-6 h-6'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 20 20'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.1'
            d='m7 13 6-6m-5-.5h.01m2.98 7H11m1.007-11.313a2.75 2.75 0 0 0 2.1.87 2.745 2.745 0 0 1 2.837 2.837 2.749 2.749 0 0 0 .87 2.1 2.747 2.747 0 0 1 0 4.014 2.748 2.748 0 0 0-.87 2.1 2.746 2.746 0 0 1-2.837 2.837 2.75 2.75 0 0 0-2.1.87 2.748 2.748 0 0 1-4.014 0 2.75 2.75 0 0 0-2.1-.87 2.744 2.744 0 0 1-2.837-2.837 2.749 2.749 0 0 0-.87-2.1 2.747 2.747 0 0 1 0-4.014 2.75 2.75 0 0 0 .87-2.1 2.745 2.745 0 0 1 2.838-2.837 2.749 2.749 0 0 0 2.1-.87 2.748 2.748 0 0 1 4.013 0Z'
          />
        </svg>
      ),
    },
    // {
    //   link: "/dispatch",
    //   title: "Dispatch",
    //   icon: (
    //     <svg
    //       className='w-6 h-6 text-gray-800 dark:text-white'
    //       aria-hidden='true'
    //       xmlns='http://www.w3.org/2000/svg'
    //       fill='none'
    //       viewBox='0 0 18 18'
    //     >
    //       <path
    //         stroke='currentColor'
    //         strokeLinecap='round'
    //         strokeLinejoin='round'
    //         strokeWidth='1.1'
    //         d='M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778'
    //       />
    //     </svg>
    //   ),
    // },
    // {
    //   link: "/items",
    //   title: "Items",
    //   icon: (
    //     <svg
    //       className='w-6 h-6 text-gray-800 dark:text-white'
    //       aria-hidden='true'
    //       xmlns='http://www.w3.org/2000/svg'
    //       fill='none'
    //       viewBox='0 0 18 20'
    //     >
    //       <path
    //         stroke='currentColor'
    //         strokeLinecap='round'
    //         strokeLinejoin='round'
    //         strokeWidth='1.1'
    //         d='M17 4c0 1.657-3.582 3-8 3S1 5.657 1 4m16 0c0-1.657-3.582-3-8-3S1 2.343 1 4m16 0v6M1 4v6m0 0c0 1.657 3.582 3 8 3s8-1.343 8-3M1 10v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6'
    //       />
    //     </svg>
    //   ),
    // },
    {
      link: "/transit",
      title: "Transit",
      icon: (
        <svg
          className='w-6 h-6'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 20 16'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.1'
            d='M15.5 10.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm0 0a2.225 2.225 0 0 0-1.666.75H12m3.5-.75a2.225 2.225 0 0 1 1.666.75H19V7m-7 4V3h5l2 4m-7 4H6.166a2.225 2.225 0 0 0-1.666-.75M12 11V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v9h1.834a2.225 2.225 0 0 1 1.666-.75M19 7h-6m-8.5 3.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z'
          />
        </svg>
      ),
    },
    {
      link: "/received-trucks",
      title: "Received Trucks",
      icon: (
        <svg
          className='w-6 h-6'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 18 20'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.1'
            d='M5 5h8m-1-3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1m6 0v3H6V2m6 0h4a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h4m0 9.464 2.025 1.965L12 9.571'
          />
        </svg>
      ),
    },
    {
      link: "/production",
      title: "Production",
      icon: (
        <svg
          className='w-6 h-6'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 20 16'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.1'
            d='M10 8v4m0 0-2-2m2 2 2-2M3 5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5H3ZM2 1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z'
          />
        </svg>
      ),
    },
    {
      link: "/delivered-trucks",
      title: "Delivered Trucks",
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
            d='M15.5 10.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm0 0a2.225 2.225 0 0 0-1.666.75H12m3.5-.75a2.225 2.225 0 0 1 1.666.75H19V7m-7 4V3h5l2 4m-7 4H6.166a2.225 2.225 0 0 0-1.666-.75M12 11V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v9h1.834a2.225 2.225 0 0 1 1.666-.75M19 7h-6m-8.5 3.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z'
          />
        </svg>
      ),
    },
    {
      link: "/staffs",
      title: "Staff List",
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
            d='M9 5h6M9 8h6m-6 3h6M4.996 5h.01m-.01 3h.01m-.01 3h.01M2 1h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z'
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
    // {
    //   link: "/expenses",
    //   title: "Expenses",
    //   icon: (
    //     <svg
    //       className='w-6 h-6 text-gray-800 dark:text-white'
    //       aria-hidden='true'
    //       xmlns='http://www.w3.org/2000/svg'
    //       fill='none'
    //       viewBox='0 0 18 20'
    //     >
    //       <path
    //         stroke='currentColor'
    //         strokeLinecap='round'
    //         strokeLinejoin='round'
    //         strokeWidth='1.1'
    //         d='M12 9V4a3 3 0 0 0-6 0v5m9.92 10H2.08a1 1 0 0 1-1-1.077L2 6h14l.917 11.923A1 1 0 0 1 15.92 19Z'
    //       />
    //     </svg>
    //   ),
    // },
    // {
    //   link: "/transport-fee",
    //   title: "Transport Fee",
    //   icon: (
    //     <svg
    //       className='w-6 h-6 text-gray-800 dark:text-white'
    //       aria-hidden='true'
    //       xmlns='http://www.w3.org/2000/svg'
    //       fill='none'
    //       viewBox='0 0 11 20'
    //     >
    //       <path
    //         stroke='currentColor'
    //         strokeLinecap='round'
    //         strokeLinejoin='round'
    //         strokeWidth='1.1'
    //         d='M1.75 15.363a4.954 4.954 0 0 0 2.638 1.574c2.345.572 4.653-.434 5.155-2.247.502-1.813-1.313-3.79-3.657-4.364-2.344-.574-4.16-2.551-3.658-4.364.502-1.813 2.81-2.818 5.155-2.246A4.97 4.97 0 0 1 10 5.264M6 17.097v1.82m0-17.5v2.138'
    //       />
    //     </svg>
    //   ),
    // },
  ];
  return <Sidebar menuItems={menuItems} />;
}
