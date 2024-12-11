import { useSelector } from "react-redux";
import { Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

import Utils from "@/lib/utils";
import { RootState } from "@/store";
import NftCard from "@/components/common/nft-card";

const AllTab = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const inventoryState = useSelector((state: RootState) => state.inventory);
  const { fetchInventoryData } = Utils();

  const fetchData = async () => {
    const res = await fetchInventoryData("all", setLoading, false, loading);
    setInventoryData(res);
  };

  useEffect(() => {
    fetchData();
  }, [inventoryState?.refreshInventory]);

  return inventoryData?.length === 0 ? (
    <p className="text-gray-400 text-sm text-center my-5">No data to show.</p>
  ) : (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-8 py-3">
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

export default AllTab;
