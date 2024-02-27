import React from "react";

import CraftData from "@/data/craft-steel-data.json";
import NftCard from "@/components/common/nft-card";

const SteelTab = () => {
  return (
    <div className="flex justify-start items-start flex-wrap gap-10 px-3 2xl:px-5">
      {CraftData.map((craftment, index) => (
        <NftCard
          key={index}
          name={craftment.name}
          picture={craftment.picture}
          buttonText="Craft"
          width={165}
          imageWidth={165}
          imageHeight={140}
          nftNameStyle="text-[15px] pr-1"
          btnStyle="bg-gradient-to-b from-[#8E8B77] to-[#30302E] text-xs h-6 w-24 h-6 font-bold drop-shadow-lg"
          creationFrom="cube"
          materials={craftment.materials}
          experience={craftment.experience}
        />
      ))}
    </div>
  );
};

export default SteelTab;
