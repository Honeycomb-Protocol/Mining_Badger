import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Spinner } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { useHoneycombInfo } from "@honeycomb-protocol/profile-hooks";

import { ResourceType } from "@/interfaces";
import Utils, { getCache } from "@/lib/utils";
import NftCard from "@/components/common/nft-card";
import { InventoryActionsWithoutThunk } from "@/store/inventory";

const RefineTab = () => {
  const dispatch = useDispatch();
  const { fetchRefinedResoucesData, userLevelInfo, fetchInventoryData } =
    Utils();
  const { currentWallet } = useHoneycombInfo();
  const [inventory, setInventory] = useState([]);
  const [refineData, setRefineData] = useState([]);
  const [enrichedRefinetData, setEnrichedRefineData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [loading, setLoading] = useState({
    name: "",
    status: false,
  });

  const prevLoadingRef = useRef(loading?.status);
  useEffect(() => {
    if (!currentWallet?.publicKey) return;
    (async () => {
      setDataLoading(true);
      if (refineData?.length === 0) {
        const res = await fetchRefinedResoucesData(setDataLoading);
        setRefineData(res);
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
      prevLoadingRef.current = loading?.status;
      setDataLoading(false);
    })();
  }, [
    currentWallet?.publicKey,
    refineData?.length,
    inventory?.length,
    loading?.status,
  ]);

  const refineResource = async (recipe: string, name: string) => {
    try {
      setLoading({ name: name, status: true });
      const data = await fetchRefinedResoucesData(setDataLoading, true, recipe);
      setRefineData(data);
      dispatch(InventoryActionsWithoutThunk.setRefreshInventory(true));
      await fetchInventoryData(
        ResourceType.ALL,
        setDataLoading,
        true,
        dataLoading
      );
      // await apiCallDelay(2000);
      setLoading({ name: "", status: false });
      toast.success(`${name} Resource refined successfully`);
    } catch (err: any) {
      setLoading({ name: "", status: false });
      toast.error(
        err.response?.data?.message || err.toString() || "Something went wrong"
      );
    }
  };

  const enrichRefineData = async () => {
    const enrichedRefineData = await Promise.all(
      refineData?.map(async (refinement) => {
        const allIngredientsAvailable = await Promise.all(
          refinement.ingredients.map(async (ing) => {
            const accessory = inventory?.find((e) => e.symbol === ing.symbol);
            return accessory && accessory.amount >= ing.amount;
          })
        );

        const canRefine = allIngredientsAvailable.every(
          (isAvailable) => isAvailable
        );
        return { ...refinement, canRefine };
      }) || []
    );
    setDataLoading(false);

    return enrichedRefineData;
  };

  useEffect(() => {
    enrichRefineData().then(setEnrichedRefineData);
  }, [refineData, inventory]);

  return (
    <div className="py-10 grid grid-cols-4 gap-8">
      {dataLoading ? (
        <Spinner color="white" />
      ) : (
        enrichedRefinetData
          ?.sort((a, b) => a.lvl_req - b.lvl_req)
          .map((refinement, index) => {
            return (
              <NftCard
                key={index}
                name={refinement?.name}
                picture={refinement?.uri}
                level={refinement?.lvl_req}
                buttonText="Refine"
                width={150}
                imageWidth={90}
                imageHeight={80}
                nftNameStyle="text-[15px] pr-1"
                btnStyle="bg-gradient-to-b from-[#8E8B77] to-[#30302E] text-xs h-6 w-24 h-6 font-bold drop-shadow-lg"
                materials={refinement?.ingredients}
                resourceInfo={
                  refinement?.lvl_req > userLevelInfo?.level
                    ? `User level ${
                        refinement?.lvl_req ? refinement.lvl_req : "1"
                      } is required to refine this resource.`
                    : ""
                }
                btnClick={async () => {
                  await refineResource(refinement.recipe, refinement.name);
                }}
                loading={loading}
                btnDisabled={
                  (loading.status && loading.name === refinement?.name) ||
                  // refinement?.lvl_req > userLevelInfo?.level ||
                  !refinement?.canRefine
                }
              />
            );
          })
      )}
    </div>
  );
};

export default RefineTab;
