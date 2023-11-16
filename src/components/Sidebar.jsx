import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import Logout from "./Logout";

export default function Sidebar({ menuItems }) {
	const { user } = useAuth();

	return (
		<aside className="fixed z-20 flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
			<div className="flex items-center space-x-4">
				<img
					className="w-10 h-10 rounded-full"
					src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
					alt=""
				/>
				<div className="font-medium dark:text-white">
					<div>{user.name}</div>
					<div className="text-sm text-gray-500 dark:text-gray-400">
						Role: {user.role}
					</div>
				</div>
			</div>
			<div className="flex flex-col justify-between flex-1 mt-6">
				<nav className="main-nav">
					{menuItems?.map((menuItem, index) => (
						<NavLink
							className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
							key={index}
							to={menuItem.link}>
							{menuItem.icon}
							<span className="mx-4 font-medium">{menuItem.title}</span>
						</NavLink>
					))}
				</nav>
			</div>
			<Logout />
		</aside>
	);
}
