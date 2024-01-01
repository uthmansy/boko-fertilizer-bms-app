import { Route, Routes } from "react-router-dom";
import TopNavBar from "../../components/TopNavBar";
import StaffForm from "../../components/StaffForm";
import StaffList from "../../components/StaffList";
import { useMenu } from "../../contexts/menuContext";
import { useEffect } from "react";

export default function Staffs() {
  const { setIsMenuOpen } = useMenu();

  useEffect(() => {
    setIsMenuOpen(false);
  }, []);
  return (
    <div>
      <TopNavBar
        links={[
          {
            path: "",
            title: "All Staffs",
          },
          {
            path: "create-new",
            title: "Create New Staff",
          },
        ]}
      />
      <Routes>
        <Route exact path='/*' element={<StaffList />} />
        <Route
          exact
          path='/create-new/*'
          element={
            <div>
              <h2 className='text-3xl text-center'>Create a new Staff</h2>
              <StaffForm />
            </div>
          }
        />
      </Routes>
    </div>
  );
}
