import { Route, Routes } from "react-router-dom";
import AccountingPurchases from "../../components/AccountingPurchases";
import AccountingSales from "../../components/AccountingSales";
import Salaries from "./Salaries";
import TransportFee from "./TransaportFee";

export default function AccountingContent() {
  return (
    <div>
      <Routes>
        <Route path='/*' element={<AccountingSales />} />
        <Route path='/purchases/*' element={<AccountingPurchases />} />
        <Route path='/salaries/*' element={<Salaries />} />
        <Route path='/transport-fee/*' element={<TransportFee />} />
      </Routes>
    </div>
  );
}
