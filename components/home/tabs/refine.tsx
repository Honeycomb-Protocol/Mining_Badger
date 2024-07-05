import { Spinner } from "@nextui-org/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import NftCard from "@/components/common/nft-card";
import Utils from "@/lib/utils";
import { AuthActionsWithoutThunk } from "@/store/auth";
import { useHoneycomb } from "@/hooks";
import { Ingredient } from "@/interfaces";

const RefineTab = () => {
  const { fetchRefinedResoucesData, userLevelInfo, fetchInventoryData } =
    Utils();
  const { createRecipe } = useHoneycomb();
  const { publicKey } = useWallet();
  const dispatch = useDispatch();
  const [inventoryData, setInventoryData] = useState<
    Map<string, { amount: number; usable: boolean }>
  >(new Map());
  const [refineData, setRefineData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [loading, setLoading] = useState({
    name: "",
    status: false,
  });

  useEffect(() => {
    if (!publicKey) return;
    const fetchData = async () => {
      const res = await fetchRefinedResoucesData(setDataLoading);
      setRefineData(res);

      const inventoryData = await fetchInventoryData("ores", setDataLoading);
      const map = new Map();
      inventoryData.forEach((item) => {
        map.set(item.name, {
          amount: item.amount,
          usable: !item.canUnwrapped && !item.isCompressed,
        });
      });
      setInventoryData(map);
    };
    fetchData();
  }, []);

  return (
    <div className="py-10 grid grid-cols-4 gap-8">
      {dataLoading ? (
        <Spinner color="white" />
      ) : (
        refineData
          ?.sort((a, b) => a.lvl_req - b.lvl_req)
          .map((refinement, index) => {
            const canRefine = refinement.ingredients.reduce(
              (cond, ingredient: Ingredient) =>
                cond &&
                (inventoryData?.get(ingredient?.name)?.amount || 0) >=
                  ingredient?.amount &&
                inventoryData?.get(ingredient?.name)?.usable,
              true
            );
            console.log("canrefine", canRefine);
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
                isCompressed={true}
                canUnwrapped={false}
                resourceInfo={
                  refinement?.lvl_req > userLevelInfo?.level
                    ? `User level ${
                        refinement?.lvl_req ? refinement.lvl_req : "1"
                      } is required to refine this resource.`
                    : ""
                }
                btnClick={async () =>
                  userLevelInfo?.level >= refinement?.lvl_req &&
                  canRefine &&
                  (await createRecipe(refinement.recipe).then(() => {
                    dispatch(AuthActionsWithoutThunk.setRefreshInventory(true));
                  }))
                }
                loading={loading}
                btnDisabled={
                  (loading.status && loading.name === refinement?.name) ||
                  refinement?.lvl_req > userLevelInfo?.level ||
                  !canRefine
                }
              />
            );
          })
      )}
    </div>
  );
};

export default RefineTab;
