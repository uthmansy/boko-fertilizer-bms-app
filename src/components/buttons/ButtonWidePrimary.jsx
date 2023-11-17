export default function ButtonWidePrimary({ children, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className='bg-teal-600 text-teal-300 hover:bg-teal-700 flex items-center  justify-center gap-x-3 text-sm sm:text-base rounded-lg duration-300 transition-colors  px-8 py-2.5'
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
