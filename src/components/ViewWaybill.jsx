import { useEffect } from "react";
import PrintDoc from "./PrintDoc";
import DeliveryWaybill from "./DeliveryWaybill";

function ViewWaybill({ waybillData }) {
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
    });
  }, []);
  return (
    <div>
      <PrintDoc>
        <DeliveryWaybill payload={waybillData} />
      </PrintDoc>
    </div>
  );
}

export { ViewWaybill as default };
