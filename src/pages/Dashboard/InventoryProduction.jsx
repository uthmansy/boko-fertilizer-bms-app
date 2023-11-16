import React, { useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import InventoryProductionPendingRequests from "../../components/InventoryProductionPendingRequests";
import InventoryProductionRequests from "../../components/InventoryProductionRequests";
import InventoryProductionReception from "../../components/InventoryProductionReception";
import InventoryProductionPendingReception from "../../components/InventoryProductionPendingReception";

const InventoryProduction = () => {
	return (
		<div>
			<nav className="bg-blue-500 p-4">
				<nav className="flex space-x-6">
					<NavLink
						to="/production"
						className="text-white border px-3 py-2 rounded-xl hover:bg-white hover:bg-opacity-20 transition-all duration-200 uppercase text-sm">
						Pending Requests
					</NavLink>
					<NavLink
						to="/production/requests"
						className="text-white border px-3 py-2 rounded-xl hover:bg-white hover:bg-opacity-20 transition-all duration-200 uppercase text-sm">
						All Requests
					</NavLink>
					<NavLink
						to="/production/pending-reception"
						className="text-white border px-3 py-2 rounded-xl hover:bg-white hover:bg-opacity-20 transition-all duration-200 uppercase text-sm">
						Pending Reception
					</NavLink>
					<NavLink
						to="/production/received"
						className="text-white border px-3 py-2 rounded-xl hover:bg-white hover:bg-opacity-20 transition-all duration-200 uppercase text-sm">
						Received
					</NavLink>
				</nav>
			</nav>

			<div className="p-4 bg-white rounded-md shadow-lg">
				<Routes>
					<Route path="/" element={<InventoryProductionPendingRequests />} />
					<Route path="/requests" element={<InventoryProductionRequests />} />
					<Route
						path="/pending-reception"
						element={<InventoryProductionPendingReception />}
					/>
					<Route path="/received" element={<InventoryProductionReception />} />
				</Routes>
			</div>
		</div>
	);
};

export default InventoryProduction;
