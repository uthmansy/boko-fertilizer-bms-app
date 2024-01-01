import { useEffect, useState } from "react";

export default function useSerielData(data, filter = null) {
  const [serielData, setSerielData] = useState([]);

  useEffect(() => {
    if (data) {
      let serielData = [];

      data.pages.forEach((page) => {
        page.data.forEach((data) => serielData.push(data));
      });

      let filteredData = serielData;

      if (filter)
        filteredData = serielData.filter((data) => data.status === filter);

      setSerielData(filteredData);
    }
  }, [data, filter]);

  return [serielData, setSerielData];
}
