import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

import Utils from "@/lib/utils";
import { RootState } from "@/store";
import { ResourceType } from "@/interfaces";
import NftCard from "@/components/common/nft-card";
import { InventoryActionsWithoutThunk } from "@/store/inventory";

const InventoryTab = ({ name }: { name: ResourceType }) => {
  const dispatch = useDispatch();
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const inventoryState = useSelector((state: RootState) => state.inventory);
  const { fetchInventoryData } = Utils();

  const fetchData = async (refetch: boolean) => {
    setLoading(true);
    const res = await fetchInventoryData(name, setLoading, refetch, loading);
    setInventoryData(res);
    setLoading(false);
    dispatch(InventoryActionsWithoutThunk.setRefreshInventory(false));
  };

  useEffect(() => {
    fetchData(inventoryState?.refreshInventory);
  }, [inventoryState?.refreshInventory, name]);

  return loading ? (
    <Spinner color="white" />
  ) : inventoryData?.length === 0 ? (
    <p className="text-gray-400 text-sm text-center my-5">No data to show.</p>
  ) : (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-8 py-3">
      {inventoryData?.map((item, index) => (
        <NftCard
          key={index}
          name={item?.name}
          picture={item?.uri.includes("assets") ? `/${item?.uri}` : item?.uri}
          width={90}
          imageWidth={70}
          imageHeight={70}
          nftNameStyle="text-[13px]"
          btnStyle="bg-opacity-70 text-xs h-6"
          btnDisabled
          amount={item?.amount}
        />
      ))}
    </div>
  );
};

export default InventoryTab;
