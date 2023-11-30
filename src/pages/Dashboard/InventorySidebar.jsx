import Sidebar from "../../components/Sidebar";

export default function InventorySidebar() {
  const menuItems = [
    {
      link: "/",
      title: "Total Inventory",
      icon: (
        <svg
          className='w-5 h-5 text-gray-800 dark:text-white'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='14'
          fill='none'
          viewBox='0 0 20 14'
        >
          <path
            stroke='currentColor'
            strokeWidth='1.2'
            d='M1 5h18M1 9h18m-9-4v8m-8 0h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1Z'
          />
        </svg>
      ),
    },
    {
      link: "/dispatch",
      title: "Dispatch",
      icon: (
        <svg
          className='w-5 h-5 text-gray-800 dark:text-white'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 18 20'
        >
          <path
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.2'
            d='M3 8V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 7.828 1h8.239A.969.969 0 0 1 17 2v16a.969.969 0 0 1-.933 1H3.933A.97.97 0 0 1 3 18v-2M8 1v4a1 1 0 0 1-1 1H3m-2 6h10M9.061 9.232 11.828 12l-2.767 2.768'
          />
        </svg>
      ),
    },
    {
      link: "/production",
      title: "Production",
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
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.2'
            d='M6 1v4a1 1 0 0 1-1 1H1m8-2h3M9 7h3m-4 3v6m-4-3h8m3-11v16a.969.969 0 0 1-.932 1H1.934A.97.97 0 0 1 1 18V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.829 1h8.239A.969.969 0 0 1 15 2ZM4 10h8v6H4v-6Z'
          />
        </svg>
      ),
    },
    {
      link: "/transit",
      title: "Transit",
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
      link: "/received",
      title: "Received",
      icon: (
        <svg
          className='w-5 h-5 text-gray-800 dark:text-white'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 14 20'
        >
          <path
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.2'
            d='M4 6h6m-6 4h6m-6 4h6M1 1v18l2-2 2 2 2-2 2 2 2-2 2 2V1l-2 2-2-2-2 2-2-2-2 2-2-2Z'
          />
        </svg>
      ),
    },
    {
      link: "/release",
      title: "Release Orders",
      icon: (
        <svg
          className='w-5 h-5 text-gray-800 dark:text-white'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 14 20'
        >
          <path
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.2'
            d='M4 6h6m-6 4h6m-6 4h6M1 1v18l2-2 2 2 2-2 2 2 2-2 2 2V1l-2 2-2-2-2 2-2-2-2 2-2-2Z'
          />
        </svg>
      ),
    },
    {
      link: "/delivered",
      title: "Delivered Trucks",
      icon: (
        <svg
          className='w-5 h-5 text-gray-800 dark:text-white'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 14 20'
        >
          <path
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.2'
            d='M4 6h6m-6 4h6m-6 4h6M1 1v18l2-2 2 2 2-2 2 2 2-2 2 2V1l-2 2-2-2-2 2-2-2-2 2-2-2Z'
          />
        </svg>
      ),
    },
  ];
  return <Sidebar menuItems={menuItems} />;
}
