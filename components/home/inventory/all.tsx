import NftCard from "@/components/common/nft-card";
import React from "react";

const AllTab = () => {
  return (
    <div className="grid-col-3 p-3">
      <NftCard
        name="Picaxe"
        picture="/assets/images/pickaxe.png"
        buttonText="Equip"
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
