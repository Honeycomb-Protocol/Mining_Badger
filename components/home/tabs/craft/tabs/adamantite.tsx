import axios from "axios";
import { toast } from "react-toastify";
import { Spinner } from "@nextui-org/react";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";

import NftCard from "@/components/common/nft-card";
import Utils from "@/lib/utils";

//import filterResourcesByMetadataSymbols

const BronzeTab = () => {
  const { publicKey } = useWallet();
  const { createRecipe, fetchCraftData } = Utils();
  const [craftData, setCraftData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [loading, setLoading] = useState({
    name: "",
    status: false,
  });

  useEffect(() => {
    if (!publicKey) return;
    const fetchData = async () => {
      const res = await fetchCraftData("adamantite", setDataLoading);
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
              name={craftment?.metadata?.name}
              picture={craftment?.metadata?.uri}
              buttonText="Craft"
              width={165}
              imageWidth={155}
              imageHeight={140}
              nftNameStyle="text-[15px]"
              btnStyle="bg-gradient-to-b from-[#8E8B77] to-[#30302E] text-xs h-6 w-24 h-6 font-bold drop-shadow-lg"
              materials={craftment?.material}
              experience={45}
              btnClick={async () => {
                await createRecipe(
                  craftment?.addresses?.recipe,
                  craftment?.metadata?.name,
                  setLoading
                );
                fetchCraftData("bronze", setDataLoading, true);
              }}
              loading={loading}
              btnDisabled={
                loading.status && loading.name === craftment?.metadata?.name
              }
            />
          </>
        ))
      )}
    </div>
  );
};

export default BronzeTab;
