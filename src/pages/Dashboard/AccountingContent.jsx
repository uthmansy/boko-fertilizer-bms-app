import { Route, Routes } from "react-router-dom";
import AccountingPurchases from "../../components/AccountingPurchases";
import AccountingSales from "../../components/AccountingSales";

export default function AccountingContent() {
  return (
    <div>
      <Routes>
        <Route exact path='/*' element={<AccountingPurchases />} />
        <Route path='/sales/*' element={<AccountingSales />} />
      </Routes>
    </div>
  );
}
