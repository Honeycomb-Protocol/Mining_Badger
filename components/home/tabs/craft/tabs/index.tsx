import { Spinner } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { useHoneycombInfo } from "@honeycomb-protocol/profile-hooks";

import { ResourceType } from "@/interfaces";
import Utils, { getCache } from "@/lib/utils";
import NftCard from "@/components/common/nft-card";

const CraftComponent = ({ tag }: { tag: string }) => {
  const { fetchCraftData, userInfo, fetchInventoryData, craftResource } =
    Utils();
  const { currentWallet, currentUser } = useHoneycombInfo();
  const [craftData, setCraftData] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [enrichedCraftData, setEnrichedCraftData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [loading, setLoading] = useState({
    name: "",
    status: false,
  });

  const prevLoadingRef = useRef(loading?.status);
  useEffect(() => {
    if (!currentWallet?.publicKey) return;
    const fetchData = async () => {
      setDataLoading(true);
      if (
        craftData?.length === 0 ||
        (tag && craftData && craftData[0]?.tag !== tag)
      ) {
        const res = await fetchCraftData(tag, setDataLoading);
        setCraftData(res);
      }
      if (
        inventory?.length === 0 ||
        (!loading?.status && prevLoadingRef.current)
      ) {
        const cacheInventory = (await getCache("inventoryData"))?.result;
        if (cacheInventory && cacheInventory?.length > 0) {
          setInventory(cacheInventory);
        } else if (!cacheInventory || cacheInventory?.length === 0) {
          const invent = await fetchInventoryData(ResourceType.ALL, () => true);
          setInventory(invent);
        }
      }
      prevLoadingRef.current = loading.status;
    };
    fetchData();
  }, [
    currentWallet?.publicKey,
    loading?.status,
    tag,
    inventory?.length,
    craftData?.length,
  ]);

  const enrichCraftData = async () => {
    const enrichedCraftData = await Promise.all(
      craftData?.map(async (craftment) => {
        const allIngredientsAvailable = await Promise.all(
          craftment.ingredients.map(async (ing) => {
            const accessory = inventory?.find((e) => e.symbol === ing.symbol);
            return accessory && accessory.amount >= ing.amount;
          })
        );

        const canCraft = allIngredientsAvailable.every(
          (isAvailable) => isAvailable
        );
        return { ...craftment, canCraft };
      }) || []
    );
    setDataLoading(false);

    return enrichedCraftData;
  };

  useEffect(() => {
    enrichCraftData().then(setEnrichedCraftData);
  }, [craftData, inventory]);

  return (
    <div className="grid grid-cols-3 gap-x-24 gap-y-8">
      {dataLoading ? (
        <Spinner color="white" />
      ) : (
        enrichedCraftData
          ?.sort((a, b) => a.lvl_req - b.lvl_req)
          ?.map((craftment, index) => {
            const hasCivicPass = currentUser?.socialInfo?.civic?.map((item) => {
              if (
                item?.gatekeeperNetwork.toString() ===
                  process.env.NEXT_PUBLIC_GATEKEEPER_NETWORK &&
                currentUser?.wallets?.wallets[item?.walletIndex]
              ) {
                return item;
              }
            });
            return (
              <NftCard
                divStyle="bg-black shadow-black shadow-xl rounded-xl p-2"
                key={index}
                name={craftment.name}
                picture={
                  craftment?.uri.includes("assets")
                    ? `/${craftment?.uri}`
                    : craftment?.uri
                }
                buttonText="Craft"
                width={165}
                imageWidth={155}
                imageHeight={140}
                nftNameStyle="text-[15px]"
                btnStyle="bg-gradient-to-b from-[#8E8B77] to-[#30302E] text-xs h-6 w-24 h-6 font-bold drop-shadow-lg"
                materials={craftment?.ingredients}
                experience={craftment?.lvl_req}
                resourceInfo={
                  craftment?.lvl_req > userInfo?.level
                    ? `User level ${craftment?.lvl_req} is required to craft this resource.`
                    : "You can craft this resource."
                }
                btnClick={async () => {
                  await craftResource(
                    craftment?.recipe,
                    craftment?.name,
                    tag,
                    craftment?.xp,
                    setLoading,
                    setDataLoading,
                    setCraftData
                  );
                }}
                loading={loading}
                btnInfo={
                  // currentUser?.socialInfo?.civic?.length === 0 ||
                  // hasCivicPass?.length === 0
                  //   ? "Prove your identity through civic to enable crafting."
                  //   :
                  !craftment?.canCraft
                    ? "You don't have enough resources to craft this item."
                    : ""
                }
                btnDisabled={
                  (loading.status && loading.name === craftment?.name) ||
                  craftment?.lvl_req > userInfo?.level ||
                  !craftment?.canCraft
                  // ||
                  // currentUser?.socialInfo?.civic?.length === 0 ||
                  // hasCivicPass?.length === 0
                }
              />
            );
          })
      )}
    </div>
  );
};

export default CraftComponent;
