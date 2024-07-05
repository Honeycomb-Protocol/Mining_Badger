import { Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import NftCard from "@/components/common/nft-card";
import Utils from "@/lib/utils";
import { AuthActionsWithoutThunk } from "@/store/auth";
import { RootState } from "@/store";
import { useHoneycomb } from "@/hooks";

const BarTab = () => {
  const dispatch = useDispatch();
  const { refreshInventory } = useSelector((state: RootState) => state.auth);
  const { fetchInventoryData } = Utils();
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { UnWrapResource } = useHoneycomb();

  const fetchData = async () => {
    const res = await fetchInventoryData("bars", setLoading, refreshInventory);
    setInventoryData(res);
  };

  const unWrappingItem = React.useCallback(
    async (resourceId: string, qty: number) => {
      await UnWrapResource(resourceId, qty);
      fetchData();
    },
    []
  );

  useEffect(() => {
    fetchData();
    dispatch(AuthActionsWithoutThunk.setRefreshInventory(false));
  }, [refreshInventory]);

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-8 p-3">
      {loading ? (
        <Spinner color="white" />
      ) : (
        inventoryData?.map((item, index) => (
          <NftCard
            key={index}
            name={item?.name}
            picture={item?.uri}
            width={90}
            imageWidth={70}
            imageHeight={70}
            nftNameStyle="text-[13px]"
            btnStyle="bg-opacity-70 text-xs h-6"
            btnDisabled
            amount={item?.amount}
            isCompressed={item.isCompressed}
            canUnwrapped={item.canUnwrapped}
            unWrappingItemFunc={() => unWrappingItem(item.address, item.amount)}
          />
        ))
      )}
    </div>
  );
};

export default BarTab;
