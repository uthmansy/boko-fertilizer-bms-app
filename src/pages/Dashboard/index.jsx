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
import { useQueryClient } from "react-query";
import { useEffect } from "react";
import { fetchAllStaffs } from "../../util/functions";
import { getTrucksWithFilter } from "../../util/crud";

export default function Dashboard() {
  const { user } = useAuth();
  let sidebarToDisplay;
  let contentToDisplay;

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchQuery("getStaffs", fetchAllStaffs);
    queryClient.prefetchInfiniteQuery({
      queryKey: ["getAllTransitTrucks"],
      queryFn: ({ pageParam = null }) =>
        getTrucksWithFilter("status", "transit", "dateLoaded", pageParam),
      getNextPageParam: (lastPage) => lastPage.nextPageToken,
    });
    queryClient.prefetchInfiniteQuery({
      queryKey: ["getReceivedTrucks"],
      queryFn: ({ pageParam = null }) =>
        getTrucksWithFilter("status", "received", "dateReceived", pageParam),
      getNextPageParam: (lastPage) => lastPage.nextPageToken,
    });
  }, []);

  const mappings = {
    production: {
      sidebar: ProdSidebar,
      content: ProdContent,
    },
    logistics: {
      sidebar: LogisticsSidebar,
      content: LogisticsContent,
    },
    inventory: {
      sidebar: InventorySidebar,
      content: InventoryContent,
    },
    manager: {
      sidebar: ManagerSidebar,
      content: ManagerContent,
    },
    accounting: {
      sidebar: AccountingSidebar,
      content: AccountingContent,
    },
    admin: {
      sidebar: AdminSidebar,
      content: AdminContent,
    },
  };

  return (
    <DashboardView
      Sidebar={mappings[user.role]?.sidebar}
      MainContent={mappings[user.role]?.content}
    />
  );
}
