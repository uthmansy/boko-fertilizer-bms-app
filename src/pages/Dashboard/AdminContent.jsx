import { Route, Routes } from "react-router-dom";
import AccountingSales from "../../components/AccountingSales";
import AccountingPurchases from "../../components/AccountingPurchases";
import InventoryTotalInventory from "./InventoryTotalInventory";
import Items from "./Items";
import CreateDispatch from "./CreateDispatch.jsx";
import DeliveredTrucks from "./DeliveredTrucks.jsx";
import Transit from "./Transit.jsx";
import ReceivedTrucks from "./ReceivedTrucks.jsx";
import ViewProductionRuns from "../../components/ViewProductionRuns.jsx";
import Salaries from "./Salaries.jsx";
import Staffs from "./Staffs.jsx";
import TransportFee from "./TransaportFee.jsx";

export default function AdminContent() {
  return (
    <div>
      <Routes>
        <Route exact path='/*' element={<InventoryTotalInventory />} />
        <Route path='/sales/*' element={<AccountingSales />} />
        <Route path='/purchases/*' element={<AccountingPurchases />} />
        <Route path='/dispatch/*' element={<CreateDispatch />} />
        <Route path='/items/*' element={<Items />} />
        <Route path='/transit/*' element={<Transit />} />
        <Route path='/delivered-trucks/*' element={<DeliveredTrucks />} />
        <Route path='/received-trucks/*' element={<ReceivedTrucks />} />
        <Route path='/production/*' element={<ViewProductionRuns />} />
        <Route path='/salaries/*' element={<Salaries />} />
        <Route path='/staffs/*' element={<Staffs />} />
        <Route path='/transport-fee/*' element={<TransportFee />} />
      </Routes>
    </div>
  );
}
