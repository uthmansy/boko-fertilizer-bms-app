import React from "react";

const PrintTest = React.forwardRef(({ children }, ref) => {
	return <div ref={ref}>{children}</div>;
});

export default PrintTest;
