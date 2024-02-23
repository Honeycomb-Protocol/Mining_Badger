import React from "react";
import RefineData from "@/data/refine-data.json";
import NftCard from "@/components/common/nft-card";

const RefineTab = () => {
  return (
    <div className="py-10 flex justify-start items-start flex-wrap gap-8">
      {RefineData.map((refinement) => (
        <NftCard
          name={refinement.name}
          picture={refinement.picture}
          level={refinement.level.toString()}
          buttonText="Refine"
          width={150}
          imageWidth={90}
          imageHeight={80}
          nftNameStyle="text-[15px] pr-1"
          btnStyle="bg-gradient-to-b from-[#8E8B77] to-[#30302E] text-xs h-6 w-24 h-6 font-bold drop-shadow-lg"
        />
      ))}
    </div>
  );
};

export default RefineTab;