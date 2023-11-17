import Sidebar from "../../components/Sidebar";

export default function AdminSidebar() {
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

    {
      link: "/purchases",
      title: "Purchases",
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
            d='M12 9V4a3 3 0 0 0-6 0v5m9.92 10H2.08a1 1 0 0 1-1-1.077L2 6h14l.917 11.923A1 1 0 0 1 15.92 19Z'
          />
        </svg>
      ),
    },
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
      link: "/production-runs",
      title: "Production Runs",
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
      link: "/production-requests",
      title: "Requests",
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
            d='M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
          />
        </svg>
      ),
    },
  ];
  return <Sidebar menuItems={menuItems} />;
}
