import { Spinner } from "@nextui-org/react";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import NftCard from "@/components/common/nft-card";
import Utils from "@/lib/utils";
import { AuthActionsWithoutThunk } from "@/store/auth";
import { useHoneycomb } from "@/hooks";

//import filterResourcesByMetadataSymbols

const IronTab = () => {
  const { publicKey } = useWallet();
  const { fetchCraftData, userLevelInfo } = Utils();
  const { createRecipe } = useHoneycomb();
  const dispatch = useDispatch();
  const [craftData, setCraftData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [loading, setLoading] = useState({
    name: "",
    status: false,
  });

  useEffect(() => {
    if (!publicKey) return;
    const fetchData = async () => {
      const res = await fetchCraftData("iron", setDataLoading);
      setCraftData(res);
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-x-24 gap-y-8">
      {dataLoading ? (
        <Spinner color="white" />
      ) : (
        craftData?.map((craftment, index) => (
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
              experience={craftment?.level_req}
              resourceInfo={
                craftment?.level_req > userLevelInfo?.level
                  ? `User level ${craftment?.level_req} is required to craft this resource.`
                  : ""
              }
              btnClick={async () => {
                userLevelInfo?.level >= craftment?.level_req &&
                  (await createRecipe(craftment?.address).then(() => {
                    dispatch(AuthActionsWithoutThunk.setRefreshInventory(true));
                    // fetchCraftData("adamantite", setDataLoading, true);
                  }));
              }}
              loading={loading}
              btnDisabled={
                (loading.status &&
                  loading.name === craftment?.metadata?.name) ||
                craftment?.level_req > userLevelInfo?.level
              }
            />
          </>
        ))
      )}
    </div>
  );
};

export default IronTab;
