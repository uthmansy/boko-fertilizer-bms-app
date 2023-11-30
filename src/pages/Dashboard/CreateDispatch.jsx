import { Route, Routes } from "react-router-dom";
import DispatchForm from "../../components/DispatchForm";
import { useState } from "react";
import ViewWaybill from "../../components/ViewWaybill";

function CreateDispatch() {
  const [dispatchData, setDispatchData] = useState(null);

  return (
    <Routes>
      <Route
        exact
        path='/*'
        element={<DispatchForm setDispatchData={setDispatchData} />}
      />
      <Route
        path='/waybill/*'
        element={<ViewWaybill waybillData={dispatchData} />}
      />
    </Routes>
  );
}

export { CreateDispatch as default };
