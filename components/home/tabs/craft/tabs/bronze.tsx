import React from "react";

import CraftData from "@/data/craft-bronze-data.json";
import NftCard from "@/components/common/nft-card";

const BronzeTab = () => {
  return (
    <div className="grid grid-cols-3 gap-x-24 gap-y-8">
      {CraftData.map((craftment, index) => (
        <NftCard
          divStyle="bg-black shadow-black shadow-xl  rounded-xl p-2"
          key={index}
          name={craftment.name}
          picture={craftment.picture}
          buttonText="Craft"
          width={165}
          imageWidth={155}
          imageHeight={140}
          nftNameStyle="text-[15px]"
          btnStyle="bg-gradient-to-b from-[#8E8B77] to-[#30302E] text-xs h-6 w-24 h-6 font-bold drop-shadow-lg"
          creationFrom="cube"
          materials={craftment.materials}
          experience={craftment.experience}
        />
      ))}
    </div>
  );
};

export default BronzeTab;
