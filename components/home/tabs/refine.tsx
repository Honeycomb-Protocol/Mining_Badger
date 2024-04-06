import { Spinner } from "@nextui-org/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import NftCard from "@/components/common/nft-card";
import Utils from "@/lib/utils";
import { AuthActionsWithoutThunk } from "@/store/auth";

const RefineTab = () => {
  const { fetchRefinedResoucesData, createRecipe, userLevelInfo } = Utils();
  const { publicKey } = useWallet();
  const dispatch = useDispatch();
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
    };
    fetchData();
  }, []);

  return (
    <div className="py-10 grid grid-cols-4 gap-8">
      {dataLoading ? (
        <Spinner color="white" />
      ) : (
        refineData.map((refinement, index) => (
          <NftCard
            key={index}
            name={refinement?.metadata?.name}
            picture={refinement?.metadata?.uri}
            level={refinement?.level_req}
            buttonText="Refine"
            width={150}
            imageWidth={90}
            imageHeight={80}
            nftNameStyle="text-[15px] pr-1"
            btnStyle="bg-gradient-to-b from-[#8E8B77] to-[#30302E] text-xs h-6 w-24 h-6 font-bold drop-shadow-lg"
            materials={refinement?.material}
            resourceInfo={
              refinement?.level_req > userLevelInfo?.level
                ? `User level ${refinement?.level_req} is required to refine this resource.`
                : ""
            }
            btnClick={() =>
              userLevelInfo?.level >= refinement?.level_req &&
              createRecipe(
                refinement?.addresses?.recipe,
                refinement?.metadata?.name,
                setLoading
              ).then(() => {
                dispatch(AuthActionsWithoutThunk.setRefreshInventory(true));
              })
            }
            loading={loading}
            btnDisabled={
              (loading.status && loading.name === refinement?.metadata?.name) ||
              refinement?.level_req > userLevelInfo?.level
            }
          />
        ))
      )}
    </div>
  );
};

export default RefineTab;
