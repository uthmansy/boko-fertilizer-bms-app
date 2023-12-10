import { Route, Routes } from "react-router-dom";
import DispatchForm from "../../components/DispatchForm";
import ViewWaybill from "../../components/ViewWaybill";

function CreateDispatch() {
  return (
    <Routes>
      <Route exact path='/*' element={<DispatchForm />} />
      <Route path='/waybill/:truckId/*' element={<ViewWaybill />} />
    </Routes>
  );
}

export { CreateDispatch as default };
