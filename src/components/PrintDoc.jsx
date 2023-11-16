import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import ButtonPrimary from "./buttons/ButtonPrimary";
import { useNavigate } from "react-router-dom";

const Print = React.forwardRef(({ children }, ref) => {
	return (
		<div className="mb-10" ref={ref}>
			{children}
		</div>
	);
});

function PrintDoc({ children }) {
	const componentRef = useRef();
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});
	const navigate = useNavigate();

	return (
		<div>
			<div className="max-w-4xl overflow-auto">
				<div className="ml-auto mb-3 flex space-x-2">
					<ButtonPrimary onClick={handlePrint}>Print this out!</ButtonPrimary>
					<ButtonPrimary onClick={() => navigate(-1)}>Back</ButtonPrimary>
				</div>
				<Print ref={componentRef}>{children}</Print>
			</div>
		</div>
	);
}

export default PrintDoc;
