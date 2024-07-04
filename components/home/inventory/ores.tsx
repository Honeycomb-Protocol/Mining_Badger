import { Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import NftCard from "@/components/common/nft-card";

import Utils from "@/lib/utils";
import { AuthActionsWithoutThunk } from "@/store/auth";
import { RootState } from "@/store";

const OresTab = () => {
  const { fetchInventoryData } = Utils();
  const { refreshInventory } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchInventoryData(
        "ores",
        setLoading,
        refreshInventory
      );
      setInventoryData(res);
    };
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
          />
        ))
      )}
    </div>
  );
};

export default OresTab;
