export default function ButtonWidePrimary({ children, onClick, icon }) {
	return (
		<button
			onClick={onClick}
			className="bg-red-400 text-white hover:bg-red-600 flex items-center dark:text-gray-300 justify-center gap-x-3 text-sm sm:text-base  dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800 rounded-lg duration-300 transition-colors border px-8 py-2.5">
			{icon}
			<span>{children}</span>
		</button>
	);
}
