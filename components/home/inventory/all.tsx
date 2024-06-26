import { Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { AuthActionsWithoutThunk } from "@/store/auth";

import NftCard from "@/components/common/nft-card";
import Utils from "@/lib/utils";

const AllTab = () => {
  const dispatch = useDispatch();
  const { refreshInventory } = useSelector((state: RootState) => state.auth);
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { fetchInventoryData } = Utils();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchInventoryData("all", setLoading, refreshInventory);
      setInventoryData(res);
    };

    fetchData();
    dispatch(AuthActionsWithoutThunk.setRefreshInventory(false));
  }, [refreshInventory]);

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-8 py-3">
      {loading ? (
        <Spinner color="white" />
      ) : (
        inventoryData?.map((item, index) => (
          <NftCard
            key={index}
            name={item?.metadata?.name}
            picture={item?.metadata?.uri}
            width={90}
            imageWidth={70}
            imageHeight={70}
            nftNameStyle="text-[13px]"
            btnStyle="bg-opacity-70 text-xs h-6"
            btnDisabled
            amount={item?.balance}
          />
        ))
      )}
    </div>
  );
};

export default AllTab;
