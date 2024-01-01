import { Route, Routes } from "react-router-dom";
import InventoryTotalInventory from "./InventoryTotalInventory";
import AccountingSales from "../../components/AccountingSales";
import AccountingPurchases from "../../components/AccountingPurchases";
import Items from "./Items";
import Transit from "./Transit";
import DeliveredTrucks from "./DeliveredTrucks";
import ReceivedTrucks from "./ReceivedTrucks";
import ViewProductionRuns from "../../components/ViewProductionRuns";
import Salaries from "./Salaries";
import Staffs from "./Staffs";
import TransportFee from "./TransaportFee";

export default function ManagerContent() {
  return (
    <div>
      <Routes>
        <Route exact path='/*' element={<InventoryTotalInventory />} />
        <Route path='/sales/*' element={<AccountingSales />} />
        <Route path='/purchases/*' element={<AccountingPurchases />} />
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
