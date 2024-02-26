import React from "react";
import CraftData from "@/data/craft-runite-data.json";
import NftCard from "@/components/common/nft-card";

const RuniteTab = () => {
  return (
    <div className="py-10 flex justify-start items-start flex-wrap gap-8">
      {CraftData.map((craftment, index) => (
        <NftCard
          key={index}
          name={craftment.name}
          picture={craftment.picture}
          buttonText="Craft"
          width={150}
          imageWidth={100}
          imageHeight={100}
          nftNameStyle="text-[15px] pr-1"
          btnStyle="bg-gradient-to-b from-[#8E8B77] to-[#30302E] text-xs h-6 w-24 h-6 font-bold drop-shadow-lg"
        />
      ))}
    </div>
  );
};

export default RuniteTab;
