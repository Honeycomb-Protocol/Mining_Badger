import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";

import NftCard from "@/components/common/nft-card";
import MineData from "@/data/mine-data.json";

interface MineDataType {
  expire_at: number;
  id: string;
}

const MineTab = () => {
  const [mineData, setMineData] = useState([]);
  const { publicKey } = useWallet();

  const FetchResources = useCallback(async () => {
    await axios
      .get(
        `${process.env
          .NEXT_PUBLIC_APIURL!}faucet/resources/${publicKey?.toString()}`
      )
      .then((result) => {
        setMineData(result?.data?.result);
      })
      .catch((err) => {
        toast.error(err.data?.message || "Something went wrong");
      });
  }, [publicKey]);

  useEffect(() => {
    if (!publicKey) return;
    FetchResources();
  }, [FetchResources, publicKey]);

  const mineResource = async (resourceId: string) => {
    try {
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_APIURL!}faucet/mine`,
        {
          user: {
            wallet: publicKey?.toString(),
          },
          resource: resourceId,
          amount: 1,
        }
      );
      await FetchResources();
      toast.success(result.data.message);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="py-10 grid grid-cols-4 gap-8">
      {mineData?.map((data: MineDataType, index: number) => (
        <NftCard
          key={index}
          name={MineData[index].name}
          picture={MineData[index].picture}
          level={MineData[index].level.toString()}
          buttonText="Mine"
          width={150}
          imageWidth={80}
          imageHeight={100}
          nftNameStyle="text-[15px] pr-1"
          btnStyle="bg-gradient-to-b from-[#8E8B77] to-[#30302E] text-xs h-6 w-24 h-6 font-bold drop-shadow-lg"
          expIn={data?.expire_at}
          btnDisabled={data?.expire_at - Date.now() > 0}
          btnClick={() => mineResource(data?.id)}
        />
      ))}
    </div>
  );
};

export default MineTab;
