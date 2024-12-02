import { Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import NftCard from "@/components/common/nft-card";
import Utils from "@/lib/utils";
import { AuthActionsWithoutThunk } from "@/store/inventory";
import { RootState } from "@/store";

const PickaxeTab = () => {
  const dispatch = useDispatch();
  const miningAuthState = useSelector((state: RootState) => state.miningAuth);
  const { fetchInventoryData } = Utils();
  const [pickaxeData, setPickaxeData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchInventoryData(
        "pickaxe",
        setLoading,
        miningAuthState?.refreshInventory
      );
      setPickaxeData(res);
    };
    fetchData();
    dispatch(AuthActionsWithoutThunk.setRefreshInventory(false));
  }, [miningAuthState?.refreshInventory]);

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-8 p-3">
      {loading ? (
        <Spinner color="white" />
      ) : (
        pickaxeData?.map((item, index) => (
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
            // amount={item?.amount}
            isCompressed={item.isCompressed}
            canUnwrapped={item.canUnwrapped}
          />
        ))
      )}
    </div>
  );
};

export default PickaxeTab;
