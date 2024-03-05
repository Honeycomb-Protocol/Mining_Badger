import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import { Spinner } from "@nextui-org/react";

import NftCard from "@/components/common/nft-card";
import { MineDataType } from "@/interfaces";
import { useHoneycomb } from "@/hooks";
import Utils from "@/lib/utils";
import { API_URL } from "@/config/config";

const MineTab = () => {
  const { getLevelsFromExp } = Utils();
  const { publicKey } = useWallet();
  const [mineData, setMineData] = useState([]);
  const { user } = useHoneycomb();
  const [dataLoader, setDataLoader] = useState(false);
  const [loading, setLoading] = useState({
    name: "",
    status: false,
  });

  const FetchResources = useCallback(async () => {
    setDataLoader(true);
    await axios
      .get(`${API_URL}resources/ores/${publicKey}`)
      .then((result) => {
        setDataLoader(false);
        setMineData(result?.data?.result);
      })
      .catch((err) => {
        setDataLoader(false);
        toast.error(err.data?.message || "Something went wrong");
      });
  }, [publicKey]);

  useEffect(() => {
    if (!publicKey) return;
    FetchResources();
  }, [FetchResources, publicKey]);

  const mineResource = async (resourceId: string, name: string) => {
    try {
      setLoading({ name: name, status: true });
      const result = await axios.post(
        `${API_URL}faucet/mine`,
        {
          user: {
            id: user.id,
            wallet: publicKey?.toString(),
          },
          resource: resourceId,
        }
      );

      await FetchResources();
      setLoading({ name: "", status: false });
      toast.success(result.data.message || "Resource mined successfully");
    } catch (err: any) {
      setLoading({ name: "", status: false });
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="py-10 grid grid-cols-4 gap-8">
      {dataLoader ? (
        <Spinner color="white" />
      ) : (
        mineData?.map((data: MineDataType, index: number) => (
          <NftCard
            key={index}
            name={data?.metadata?.name}
            picture={data?.metadata?.uri}
            level={getLevelsFromExp(data?.level_req)}
            buttonText="Mine"
            width={150}
            imageWidth={80}
            imageHeight={100}
            nftNameStyle="text-[15px] pr-1"
            btnStyle="bg-gradient-to-b from-[#8E8B77] to-[#30302E] text-xs h-6 w-24 h-6 font-bold drop-shadow-lg"
            expIn={data?.expire}
            btnDisabled={
              data?.expire - Date.now() > 0 ||
              loading.name === data.metadata?.name
            }
            btnClick={() =>
              mineResource(data?.addresses?.resource, data.metadata?.name)
            }
            loading={loading}
          />
        ))
      )}
    </div>
  );
};

export default MineTab;
