import { useState } from "react";
import ItemTotalInventory from "../../components/ItemTotalInventory";
import RefreshButton from "../../components/RefreshButton";
import TopNavBar from "../../components/TopNavBar";
import { Route, Routes } from "react-router-dom";
import { useItems } from "../../contexts/itemsContext";
import { useMenu } from "../../contexts/menuContext";
import { useEffect } from "react";
import ButtonPrimary from "../../components/buttons/ButtonPrimary";
import { useQueryClient } from "react-query";

export default function InventoryTotalInventory() {
  const queryClient = useQueryClient();

  const [refresh, setRefresh] = useState(0);

  const { setIsMenuOpen } = useMenu();

  useEffect(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <div>
      <TopNavBar
        links={[
          {
            title: "Raw Materials",
            path: "raw-materials",
          },
          {
            title: "Finished Products",
            path: "products",
          },
        ]}
      />
      <div className='mb-5'>
        <ButtonPrimary
          onClick={() => queryClient.invalidateQueries("getItemInventory")}
        >
          Refresh
        </ButtonPrimary>
      </div>
      <Routes>
        <Route exact path='/*' element={<RawMaterials refresh={refresh} />} />
        <Route exact path='/products' element={<Products />} />
      </Routes>
    </div>
  );
}

const RawMaterials = ({ refresh }) => {
  const { items } = useItems();

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
      {items
        ?.filter((item) => item.type === "raw")
        .map((item, index) => (
          <ItemTotalInventory key={index} item={item} refresh={refresh} />
        ))}
    </div>
  );
};

const Products = ({ refresh }) => {
  const { items } = useItems();

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
      {items
        ?.filter((item) => item.type === "product")
        .map((item, index) => (
          <ItemTotalInventory key={index} item={item} refresh={refresh} />
        ))}
    </div>
  );
};
