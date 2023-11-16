import { useState } from "react";

export default function ButtonGroup({ onClick1, onClick2, child1, child2 }) {
	const [activeButton, setActiveButton] = useState("button1");

	return (
		<div className="inline-flex bg-white">
			<button
				onClick={() => {
					setActiveButton("button1");
					onClick1();
				}}
				className={`border-blue-400 border-none rounded-none uppercase text-sm  ${
					activeButton === "button1" && "bg-blue-400 text-white"
				} hover:bg-blue-400 hover:border-blue-400 inline-flex items-center justify-center border py-[10px] px-[12px] text-center text-base font-semibold hover:text-white sm:py-3 sm:px-6`}>
				{child1}
			</button>
			<button
				onClick={() => {
					setActiveButton("button2");
					onClick2();
				}}
				className={`border-blue-400 border-none rounded-none uppercase text-sm  ${
					activeButton === "button2" && "bg-blue-400 text-white"
				} hover:bg-blue-400 hover:border-blue-400 inline-flex items-center justify-center border py-[10px] px-[12px] text-center text-base font-semibold hover:text-white sm:py-3 sm:px-6`}>
				{child2}
			</button>
		</div>
	);
}
