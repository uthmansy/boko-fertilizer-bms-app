import { Route, Routes } from "react-router-dom";
import InventoryTotalInventory from "./InventoryTotalInventory";
import InventoryProduction from "./InventoryProduction";
import CreateDispatch from "./CreateDispatch";
import DeliveredTrucks from "./DeliveredTrucks";
import Transit from "./Transit";
import ReceivedTrucks from "./ReceivedTrucks";

export default function InventoryContent() {
  return (
    <div>
      <Routes>
        <Route exact path='/*' element={<InventoryTotalInventory />} />
        <Route path='/dispatch/*' element={<CreateDispatch />} />
        <Route path='/production/*' element={<InventoryProduction />} />
        <Route path='/transit/*' element={<Transit />} />
        <Route path='/received/*' element={<ReceivedTrucks />} />
        <Route path='/delivered/*' element={<DeliveredTrucks />} />
      </Routes>
    </div>
  );
}
