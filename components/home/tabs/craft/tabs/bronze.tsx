import axios from "axios";
import { toast } from "react-toastify";
import { Spinner } from "@nextui-org/react";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useCallback, useEffect, useState } from "react";

import NftCard from "@/components/common/nft-card";
import Utils from "@/lib/utils";
import { API_URL } from "@/config/config";

const BronzeTab = () => {
  const { publicKey } = useWallet();
  const { createRecipe } = Utils();
  const [craftData, setCraftData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [loading, setLoading] = useState({
    name: "",
    status: false,
  });


  const FetchCraft = useCallback(async () => {
    setDataLoading(true);
    await axios
      .get(`${API_URL}resources/craft`)
      .then((result) => {
        setCraftData(result?.data?.result);
        setDataLoading(false);
      })
      .catch((err) => {
        setDataLoading(false);
        toast.error(err.data?.message || "Something went wrong");
      });
  }, [publicKey]);

  useEffect(() => {
    if (!publicKey) return;
    FetchCraft();
  }, [FetchCraft, publicKey]);

  return (
    <div className="grid grid-cols-3 gap-x-24 gap-y-8">
      {dataLoading ? (
        <Spinner color="white" />
      ) : (
        craftData.map((craftment, index) => (
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
            btnClick={() =>
              createRecipe(
                craftment?.addresses?.recipe,
                craftment?.metadata?.name,
                setLoading
              )
            }
            loading={loading}
            btnDisabled={loading.status && loading.name === craftment?.metadata?.name}
          />
        ))
      )}
    </div>
  );
};

export default BronzeTab;
