import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import ButtonPrimary from "../components/buttons/ButtonPrimary";
import { Link } from "react-router-dom";

export default function useMapProductions(serielData, handleDelete) {
  const [productionRuns, setProductionRuns] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    const mappedResult = serielData.map((run) => {
      const {
        date,
        finishedProduct,
        quantityProduced,
        rawMaterialsUsed,
        runnerName,
        id,
      } = run;
      const data = {
        date,
        finishedProduct,
        quantityProduced,
        rawMaterialsUsed: rawMaterialsUsed.map((materialUsed, index) => (
          <li key={index} className=''>
            {materialUsed.material}: {materialUsed.quantity}
          </li>
        )),
        runnerName,
        viewButton: (
          <ButtonPrimary>
            <Link to={id}>View</Link>
          </ButtonPrimary>
        ),
      };

      if (user.role === "admin")
        data.deleteButton = (
          <ButtonPrimary onClick={() => handleDelete(id)}>Delete</ButtonPrimary>
        );

      return data;
    });
    setProductionRuns(mappedResult);
  }, [serielData]);

  return productionRuns;
}
