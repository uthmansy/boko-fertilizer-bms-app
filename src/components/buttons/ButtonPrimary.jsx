export default function ButtonPrimary({ onClick, children }) {
	return (
		<button
			onClick={onClick}
			className="px-6 py-2 font-medium text-sm uppercase text-white transition-colors duration-300 transform bg-blue-600 rounded-sm hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
			{children}
		</button>
	);
}
