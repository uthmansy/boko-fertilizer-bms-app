import Sidebar from "../../components/Sidebar";

export default function AdminSidebar() {
	const menuItems = [
		{ link: "/", title: "admin" },
		{ link: "/about", title: "About" },
		{ link: "/contact", title: "Contact" },
	];
	return <Sidebar menuItems={menuItems} />;
}
