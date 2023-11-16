import React from "react";
import { NavLink } from "react-router-dom";

const ProductionRunsNavBar = () => {
	return (
		<nav className="bg-blue-500 py-4">
			<div className="max-w-screen-xl mx-auto flex justify-between items-center px-4">
				<nav className="flex space-x-6">
					<NavLink
						to="/production-runs"
						className="text-white border px-3 py-2 rounded-xl hover:bg-white hover:bg-opacity-20 transition-all duration-200 uppercase text-sm">
						Create New
					</NavLink>
					<NavLink
						to="/production-runs/all-runs"
						className="text-white border px-3 py-2 rounded-xl hover:bg-white hover:bg-opacity-20 transition-all duration-200 uppercase text-sm">
						Production Runs
					</NavLink>
				</nav>
			</div>
		</nav>
	);
};

export default ProductionRunsNavBar;
