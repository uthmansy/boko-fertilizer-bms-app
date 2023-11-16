export default function ButtonPrimaryIcon({ onClick, icon, children }) {
	return (
		<button
			onClick={onClick}
			className="bg-primary inline-flex items-center justify-center py-3 px-6 text-center text-base font-medium text-white hover:bg-opacity-90">
			<span className="mr-[10px]">{icon}</span>
			{children}
		</button>
	);
}
