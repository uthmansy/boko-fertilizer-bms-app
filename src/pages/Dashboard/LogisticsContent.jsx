import { Route, Routes } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import LogisticsReceived from "./LogisticsReceived";
import CreateDispatch from "./CreateDispatch";
import Transit from "./Transit";

export default function LogisticsContent() {
  const { user } = useAuth();
  return (
    <div>
      <Routes>
        <Route exact path='/*' element={<CreateDispatch />} />
        <Route path='/transit/*' element={<Transit />} />
        <Route path='/received/*' element={<LogisticsReceived />} />
      </Routes>
    </div>
  );
}
