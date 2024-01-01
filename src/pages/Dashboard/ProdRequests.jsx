import { Route, Routes } from "react-router-dom";
import RawMaterialRequestForm from "../../components/RawMaterialsRequestForm";
import ViewRawMaterialsRequests from "../../components/ViewRawMaterialsRequests";
import TopNavBar from "../../components/TopNavBar";

export default function ProdRequests() {
  return (
    <div>
      <TopNavBar
        links={[
          {
            path: "/requests/",
            title: "Create New",
          },
          {
            path: "/requests/all",
            title: "All Requests",
          },
        ]}
      />
      <Routes>
        <Route path='/*' element={<RawMaterialRequestForm />} />
        <Route path='/all/*' element={<ViewRawMaterialsRequests />} />
      </Routes>
    </div>
  );
}
