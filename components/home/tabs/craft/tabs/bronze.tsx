import { useDispatch } from "react-redux";
import { Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import Utils, { getCache } from "@/lib/utils";
import NftCard from "@/components/common/nft-card";
import { InventoryActionsWithoutThunk } from "@/store/inventory";

const BronzeTab = () => {
  const { publicKey } = useWallet();
  const dispatch = useDispatch();
  const { fetchCraftData, userLevelInfo, fetchInventoryData, craftResource } =
    Utils();
  const [craftData, setCraftData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState({
    name: "",
    status: false,
  });

  useEffect(() => {
    if (!publicKey) return;
    (async () => {
      if (craftData?.length === 0) {
        const res = await fetchCraftData("bronze", setDataLoading);
        setCraftData(res);
      }
      if (inventory.length === 0) {
        const cacheInventory = (await getCache("inventoryData"))?.result;
        if (cacheInventory.length > 0) {
          setInventory(cacheInventory);
        } else if (cacheInventory.length === 0) {
          setInventory(
            (await fetchInventoryData("refine", () => true))?.result
          );
        }
      }
    })();
  }, [publicKey, craftData.length, inventory.length]);

  const enrichedCraftData = craftData?.map((craftment) => {
    const canCraft = craftment.ingredients.every(async (ing) => {
      const accessory = await inventory?.find((e) => e.symbol === ing.symbol);
      return accessory?.amount >= ing.amount;
    });
    return { ...craftment, canCraft };
  });

  return (
    <div className="grid grid-cols-3 gap-x-24 gap-y-8">
      {dataLoading ? (
        <Spinner color="white" />
      ) : (
        enrichedCraftData
          ?.sort((a, b) => a.lvl_req - b.lvl_req)
          ?.map((craftment, index) => {
            return (
              <NftCard
                divStyle="bg-black shadow-black shadow-xl  rounded-xl p-2"
                key={index}
                name={craftment.name}
                picture={craftment.uri}
                buttonText="Craft"
                width={165}
                imageWidth={155}
                imageHeight={140}
                nftNameStyle="text-[15px]"
                btnStyle="bg-gradient-to-b from-[#8E8B77] to-[#30302E] text-xs h-6 w-24 h-6 font-bold drop-shadow-lg"
                materials={craftment?.ingredients}
                experience={craftment?.lvl_req}
                resourceInfo={
                  craftment?.lvl_req > userLevelInfo?.level
                    ? `User level ${craftment?.lvl_req} is required to craft this resource.`
                    : "You can craft this resource."
                }
                btnClick={async () => {
                  await craftResource(
                    craftment?.recipe,
                    craftment?.name,
                    "bronze",
                    setLoading,
                    setDataLoading,
                    setCraftData
                  );
                  dispatch(
                    InventoryActionsWithoutThunk.setRefreshInventory(true)
                  );
                }}
                loading={loading}
                btnDisabled={
                  (loading.status && loading.name === craftment?.name) ||
                  craftment?.lvl_req > userLevelInfo?.level ||
                  !craftment?.canCraft
                }
              />
            );
          })
      )}
    </div>
  );
};

export default BronzeTab;
