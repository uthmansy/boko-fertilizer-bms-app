import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import Logout from "./Logout";

export default function Sidebar({ menuItems }) {
  const { user } = useAuth();

  return (
    <aside className=' flex flex-col w-full h-screen px-4 py-8 overflow-y-auto bg-slate-800 '>
      <div className='flex items-center space-x-4 border-b pb-5 border-slate-500'>
        <img
          className='w-14 h-14 rounded-full object-cover'
          src='https://crim.org/wp-content/uploads/2019/02/generic-headshot-placeholder.jpg'
          alt=''
        />
        <div className='font-medium'>
          <div className='font-bold uppercase text-teal-300'>{user.name}</div>
          <div className='text-sm text-teal-600'>Role: {user.role}</div>
        </div>
      </div>
      <div className='flex flex-col justify-between flex-1 mt-6'>
        <nav className='main-nav'>
          {menuItems?.map((menuItem, index) => (
            <NavLink
              className='flex items-center px-4 py-2 mt-5 text-teal-500 opacity-80 dark:text-teal-500 transition-colors duration-300 transform rounded-md hover:bg-teal-800  hover:text-teal-500'
              key={index}
              to={menuItem.link}
            >
              <span className='text-grey-600 dark:text-grey-600'>
                {menuItem.icon}
              </span>
              <span className='mx-4 font-medium'>{menuItem.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <Logout />
    </aside>
  );
}
