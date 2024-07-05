import { Spinner } from "@nextui-org/react";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import NftCard from "@/components/common/nft-card";
import Utils from "@/lib/utils";
import { AuthActionsWithoutThunk } from "@/store/auth";
import { useHoneycomb } from "@/hooks";
import { Ingredient } from "@/interfaces";

const BronzeTab = () => {
  const { publicKey } = useWallet();
  const { fetchCraftData, userLevelInfo, fetchInventoryData } = Utils();
  const { createRecipe } = useHoneycomb();
  const dispatch = useDispatch();
  const [craftData, setCraftData] = useState([]);
  const [inventoryData, setInventoryData] = useState<Map<string, number>>(
    new Map()
  );
  const [inventoryData, setInventoryData] = useState<Map<string, number>>(
    new Map()
  );
  const [dataLoading, setDataLoading] = useState(false);
  const [loading, setLoading] = useState({
    name: "",
    status: false,
  });

  useEffect(() => {
    if (!publicKey) return;
    const fetchData = async () => {
      const res = await fetchCraftData("bronze", setDataLoading);
      setCraftData(res);

      const inventoryData = await fetchInventoryData("bars", setDataLoading);
      const map = new Map();
      inventoryData.forEach((item) => {
        map.set(item.name, item.amount);
      });
      setInventoryData(map);
    };

    fetchData();
  }, []);

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
                (inventoryData?.get(ingredient?.name) || 0) >=
                  ingredient?.amount,
              true
            );
            return (
              <>
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
                    userLevelInfo?.level >= craftment?.lvl_req &&
                      canCraft &&
                      userLevelInfo?.level >= craftment?.level_req &&
                      (await createRecipe(craftment?.address).then(() => {
                        dispatch(
                          AuthActionsWithoutThunk.setRefreshInventory(true)
                        );
                        // fetchCraftData("adamantite", setDataLoading, true);
                      }));
                  }}
                  loading={loading}
                  btnDisabled={
                    (loading.status &&
                      loading.name === craftment?.metadata?.name) ||
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

export default BronzeTab;
