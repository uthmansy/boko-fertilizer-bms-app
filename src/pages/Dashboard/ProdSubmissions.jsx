import { Route, Routes } from "react-router-dom";
import ProductSubmissionForm from "../../components/ProductSubmissionForm";
import ProductSubmissionList from "../../components/ProductSubmissionList";
import TopNavBar from "../../components/TopNavBar";

export default function ProdSubmissions() {
  return (
    <div>
      <TopNavBar
        links={[
          {
            path: "",
            title: "Create New",
          },
          {
            path: "all",
            title: "All Submissions",
          },
        ]}
      />
      <Routes>
        <Route path='/*' element={<ProductSubmissionForm />} />
        <Route path='/all/*' element={<ProductSubmissionList />} />
      </Routes>
    </div>
  );
}
