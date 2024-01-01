import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import InventoryProductionReception from "../../components/InventoryProductionReception";
import InventoryProductionPendingReception from "../../components/InventoryProductionPendingReception";
import TopNavBar from "../../components/TopNavBar";
import ViewRawMaterialsRequests from "../../components/ViewRawMaterialsRequests";
import ButtonPrimary from "../../components/buttons/ButtonPrimary";
import ProductSubmissionList from "../../components/ProductSubmissionList";

const InventoryProduction = () => {
  return (
    <div>
      <TopNavBar
        links={[
          {
            path: "",
            title: "All Requests",
          },
          {
            path: "reception",
            title: "All Reception",
          },
        ]}
      />
      <div className=''>
        <Routes>
          <Route path='/*' element={<Requests />} />
          <Route path='/reception/*' element={<ProductSubmissionList />} />
        </Routes>
      </div>
    </div>
  );
};

const Requests = () => {
  const [filter, setFilter] = useState(null);

  return (
    <div>
      <div className='mb-5 flex space-x-3'>
        <ButtonPrimary onClick={() => setFilter(null)}>All</ButtonPrimary>
        <ButtonPrimary onClick={() => setFilter("approved")}>
          Approved
        </ButtonPrimary>
        <ButtonPrimary onClick={() => setFilter("pending")}>
          Pending
        </ButtonPrimary>
        <ButtonPrimary onClick={() => setFilter("rejected")}>
          Rejected
        </ButtonPrimary>
      </div>
      <ViewRawMaterialsRequests filter={filter} />
    </div>
  );
};

export default InventoryProduction;
