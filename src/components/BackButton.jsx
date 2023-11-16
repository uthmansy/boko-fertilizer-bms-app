import { useNavigate } from "react-router-dom";
import ButtonPrimary from "./buttons/ButtonPrimary";

export default function BackButton() {
	const navigate = useNavigate();
	return (
		<ButtonPrimary onClick={() => navigate(-1)}>
			<svg
				className="w-6 h-6 text-gray-800 dark:text-white inline mr-2"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 14 10">
				<path
					stroke="white"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="0.9"
					d="M13 5H1m0 0 4 4M1 5l4-4"
				/>
			</svg>{" "}
			Back
		</ButtonPrimary>
	);
}
