import DashboardView from "../../components/DashboardView";
import { useAuth } from "../../contexts/authContext";
import AdminContent from "./AdminContent";
import AdminSidebar from "./AdminSidebar";
import InventoryContent from "./InventoryContent";
import InventorySidebar from "./InventorySidebar";
import LogisticsContent from "./LogisticsContent";
import LogisticsSidebar from "./LogisticsSidebar";
import AccountingSidebar from "./AccountingSidebar";
import ManagerContent from "./ManagerContent";
import ManagerSidebar from "./ManagerSidebar";
import ProdContent from "./ProdContent";
import ProdSidebar from "./ProdSidebar";
import AccountingContent from "./AccountingContent";

export default function Dashboard() {
  const { user } = useAuth();
  let sidebarToDisplay;
  let contentToDisplay;

  switch (user.role) {
    case "production":
      sidebarToDisplay = ProdSidebar;
      contentToDisplay = ProdContent;
      break;
    case "logistics":
      sidebarToDisplay = LogisticsSidebar;
      contentToDisplay = LogisticsContent;
      break;
    case "inventory":
      sidebarToDisplay = InventorySidebar;
      contentToDisplay = InventoryContent;
      break;
    case "manager":
      sidebarToDisplay = ManagerSidebar;
      contentToDisplay = ManagerContent;
      break;
    case "accounting":
      sidebarToDisplay = AccountingSidebar;
      contentToDisplay = AccountingContent;
      break;
    case "admin":
      sidebarToDisplay = AdminSidebar;
      contentToDisplay = AdminContent;
      break;
    default:
      sidebarToDisplay = AdminSidebar;
      contentToDisplay = AdminContent;
  }

  return (
    <DashboardView Sidebar={sidebarToDisplay} MainContent={contentToDisplay} />
  );
}
