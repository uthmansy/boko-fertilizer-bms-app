import React from "react";
import { NavLink } from "react-router-dom";

const TopNavBar = ({ links }) => {
	return (
		<nav className="bg-blue-500 py-4 mb-5 top-nav rounded-md shadow-lg">
			<div className="max-w-screen-xl mx-auto flex justify-between items-center px-4">
				<nav className="flex space-x-4">
					{links.map((link, index) => (
						<NavLink
							key={index}
							to={link.path}
							className="text-white border px-3 py-2 rounded-sm hover:bg-white hover:bg-opacity-20 transition-all duration-100 uppercase text-sm">
							{link.title}
						</NavLink>
					))}
				</nav>
			</div>
		</nav>
	);
};

export default TopNavBar;
