import { Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import NftCard from "@/components/common/nft-card";
import Utils from "@/lib/utils";
import { AuthActionsWithoutThunk } from "@/store/auth";
import { RootState } from "@/store";

const PickaxeTab = () => {
  const dispatch = useDispatch();
  const { refreshInventory } = useSelector((state: RootState) => state.auth);
  const { fetchInventoryData } = Utils();
  const [pickaxeData, setPickaxeData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchInventoryData("pickaxe", setLoading, refreshInventory);
      setPickaxeData(res);
    };
    fetchData();
    dispatch(AuthActionsWithoutThunk.setRefreshInventory(false));
  }, [refreshInventory]);

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-8 p-3">
      {loading ? (
        <Spinner color="white" />
      ) : (
        pickaxeData?.map((item, index) => (
          <NftCard
            key={index}
            name={item.metadata.name}
            picture={item.metadata.uri}
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

export default PickaxeTab;
