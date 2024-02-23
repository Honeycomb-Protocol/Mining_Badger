import NftCard from "@/components/common/nft-card";
import React from "react";

const BronzeTab = () => {
  return (
    <div>
      <NftCard
        name="Picaxe"
        picture="/assets/images/bronze-Pickaxe.png"
        buttonText="Equip"
        width={90}
        imageHeight={90}
        nftNameStyle="text-[10px]"
        btnStyle="bg-opacity-70 text-xs h-6"
        btnDisabled
      />
    </div>
  );
};

export default BronzeTab;
