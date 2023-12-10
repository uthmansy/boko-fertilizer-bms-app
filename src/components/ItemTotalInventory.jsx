import { useEffect, useState } from "react";
import { getItemTotalInventory } from "../util/crud";
import TotalInventoryTable from "./tables/TotalInventoryTabel";
import ContentLoader from "./ContentLoader";
import { useQuery } from "react-query";

const fetchItem = async (item) => {
  try {
    const data = await getItemTotalInventory(item.name);
    console.log(data);
    const mappedData = [
      {
        totalReceived: "Total Received",
        bags: data.received || 0,
        mts: ((data.received || 0) * 50) / 1000,
      },
      {
        totalDispatched: "Dispatched to Production",
        bags: data.dispatchedToProduction || 0,
        mts: ((data.dispatchedToProduction || 0) * 50) / 1000,
      },
      {
        regularDispatch: "Regular Dispatch",
        bags: (data.dispatched || 0) - (data.dispatchedToProduction || 0),
        mts:
          (((data.dispatched || 0) - (data.dispatchedToProduction || 0)) * 50) /
          1000,
      },
      {
        totalDispatched: "Total Dispatched",
        bags: data.dispatched || 0,
        mts: ((data.dispatched || 0) * 50) / 1000,
      },
    ];

    if (item.type === "product") {
      mappedData.push({
        TotalProducted: "Total Produced",
        bags: data.received || 0,
        mts: ((data.received || 0) * 50) / 1000,
      });

      mappedData.push({
        deliveredToStore: "Delivered to Store",
        bags: data.deliveredToStore || 0,
        mts: ((data.deliveredToStore || 0) * 50) / 1000,
      });
    }
    if (item.type === "raw") {
      mappedData.push({
        totalUtilization: "Total Utilization",
        bags: data.totalUtilization || 0,
        mts: ((data.totalUtilization || 0) * 50) / 1000,
      });
    }
    mappedData.push({
      balance: "Balance in Store",
      bags: data.balance || 0,
      mts: ((data.balance || 0) * 50) / 1000,
    });
    mappedData.push({
      availableInProduction: "Available In Production",
      bags: data.availableInProduction || 0,
      mts: ((data.availableInProduction || 0) * 50) / 1000,
    });
    mappedData.push({
      totalBalance: "Total Balance",
      bags: (data.balance || 0) + (data.availableInProduction || 0),
      mts:
        (((data.balance || 0) + (data.availableInProduction || 0)) * 50) / 1000,
    });
    return mappedData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default function ItemTotalInventory({ item }) {
  const { isLoading, error, data, isFetching } = useQuery(
    ["getItemInventory", item],
    () => fetchItem(item)
  );
  const tableHeader = ["BAGS", "Tons"];

  return isLoading || isFetching ? (
    <div className='h-48 bg-gray-200 border border-gray-300'>
      <ContentLoader />
    </div>
  ) : error ? (
    <div className='h-48 bg-gray-200 border border-gray-300'>
      Error Loading Item...
    </div>
  ) : (
    <div>
      <TotalInventoryTable
        item={item.name}
        tableHeader={tableHeader}
        tableData={data}
      />
    </div>
  );
}
