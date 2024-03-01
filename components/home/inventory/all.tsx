import NftCard from "@/components/common/nft-card";
import { getEdgeClient } from "@/components/wallet-context-provider";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect } from "react";

const AllTab = () => {
  const { publicKey } = useWallet();
  const GetUserWithHoldings = async () => {
    try {
      const holdings = await getEdgeClient().findHoldings({
        holder: publicKey?.toString()
      });
      console.log(holdings);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (publicKey) {
      GetUserWithHoldings();
    }
  }, [publicKey]);

  return (
    <div className="grid-col-3 p-3">
      <NftCard
        name="Picaxe"
        picture="/assets/images/bronze-Pickaxe.png"
        width={90}
        imageWidth={90}
        imageHeight={90}
        nftNameStyle="text-[10px]"
        btnStyle="bg-opacity-70 text-xs h-6"
        btnDisabled
      />
    </div>
  );
};

export default AllTab;
