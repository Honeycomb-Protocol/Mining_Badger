import { Spinner } from "@nextui-org/react";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import NftCard from "@/components/common/nft-card";
import Utils from "@/lib/utils";
import { AuthActionsWithoutThunk } from "@/store/auth";
import { useHoneycomb } from "@/hooks";
import { Ingredient } from "@/interfaces";

//import filterResourcesByMetadataSymbols

const MithrilTab = () => {
  const { publicKey } = useWallet();
  const {
    fetchCraftData,
    userLevelInfo,
    fetchInventoryData,
    getUserLevelInfo,
    apiCallDelay,
  } = Utils();
  const { profile, createRecipe } = useHoneycomb();
  const dispatch = useDispatch();
  const [craftData, setCraftData] = useState([]);
  const [inventoryData, setInventoryData] = useState<
    Map<string, { amount: number; usable: boolean }>
  >(new Map());
  const [dataLoading, setDataLoading] = useState(false);
  const [loading, setLoading] = useState({
    name: "",
    status: false,
  });

  useEffect(() => {
    if (!publicKey) return;
    (async () => {
      const res = await fetchCraftData("mithril", setDataLoading);
      setCraftData(res);
    })();
    const fetchData = setInterval(async () => {
      const res = await fetchCraftData("mithril", setDataLoading);
      setCraftData(res);

      const inventoryData = await fetchInventoryData("all", () => true);
      const map = new Map();
      inventoryData.forEach((item) => {
        map.set(item.name, {
          amount: item.amount,
          usable: !item.canUnwrapped && !item.isCompressed,
        });
      });
      setInventoryData(map);
    }, 5000);

    return () => clearInterval(fetchData);
  }, []);

  const mineResource = async (recipe: any, name: string) => {
    try {
      setLoading({ name: name, status: true });
      await createRecipe(recipe);
      await apiCallDelay();
      const data = await fetchCraftData("mithril", setDataLoading);
      setCraftData(data);
      setLoading({ name: "", status: false });
      dispatch(AuthActionsWithoutThunk.setRefreshInventory(true));
      await getUserLevelInfo(profile?.platformData?.xp);
      // toast.success(`${name} Resource crafted successfully`);
    } catch (err: any) {
      setLoading({ name: "", status: false });
      // toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="grid grid-cols-3 gap-x-24 gap-y-8">
      {dataLoading ? (
        <Spinner color="white" />
      ) : (
        craftData
          ?.sort((a, b) => a.lvl_req - b.lvl_req)
          ?.map((craftment, index) => {
            const canCraft = craftment.ingredients.reduce(
              (cond, ingredient: Ingredient) =>
                cond &&
                (inventoryData?.get(ingredient?.name)?.amount || 0) >=
                  ingredient?.amount &&
                inventoryData?.get(ingredient?.name)?.usable,
              true
            );
            return (
              <>
                <NftCard
                  divStyle="bg-black shadow-black shadow-xl  rounded-xl p-2"
                  key={index}
                  name={craftment?.name}
                  picture={craftment?.uri}
                  buttonText="Craft"
                  width={165}
                  imageWidth={155}
                  imageHeight={140}
                  nftNameStyle="text-[15px]"
                  btnStyle="bg-gradient-to-b from-[#8E8B77] to-[#30302E] text-xs h-6 w-24 h-6 font-bold drop-shadow-lg"
                  materials={craftment?.ingredients}
                  experience={craftment?.lvl_req}
                  isCompressed={true}
                  canUnwrapped={false}
                  resourceInfo={
                    craftment?.lvl_req > userLevelInfo?.level
                      ? `User level ${craftment?.lvl_req} is required to craft this resource.`
                      : "You can craft this resource."
                  }
                  btnClick={async () => {
                    userLevelInfo?.level >= craftment?.lvl_req &&
                      canCraft &&
                      mineResource(craftment?.recipe, craftment?.name).then(
                        () => {
                          dispatch(
                            AuthActionsWithoutThunk.setRefreshInventory(true)
                          );
                          // fetchCraftData("adamantite", setDataLoading, true);
                        }
                      );
                  }}
                  loading={loading}
                  btnDisabled={
                    (loading.status && loading.name === craftment?.name) ||
                    craftment?.lvl_req > userLevelInfo?.level ||
                    !canCraft
                  }
                />
              </>
            );
          })
      )}
    </div>
  );
};

export default MithrilTab;
