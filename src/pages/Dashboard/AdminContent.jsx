import { Route, Routes } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import AccountingSales from "../../components/AccountingSales";
import AccountingPurchases from "../../components/AccountingPurchases";
import AdminTransit from "./AdminTransit";
import InventoryTotalInventory from "./InventoryTotalInventory";

export default function AdminContent() {
  const { user } = useAuth();

  return (
    <div>
      <Routes>
        <Route exact path='/*' element={<InventoryTotalInventory />} />
        <Route path='/sales/*' element={<AccountingSales />} />
        <Route path='/purchases/*' element={<AccountingPurchases />} />
        <Route path='/transit/*' element={<AdminTransit />} />
        <Route path='/about' element={<div>About Page</div>} />
        <Route path='/contact' element={<div>Contact Page</div>} />
      </Routes>
    </div>
  );
}
