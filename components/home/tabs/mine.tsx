import React from "react";
import MineData from "@/data/mine-data.json";
import NftCard from "@/components/common/nft-card";

const MineTab = () => {
  return (
    <div className="py-10 grid grid-cols-4 gap-8">
      {MineData.map((mine, index) => (
        <NftCard
          key={index}
          name={mine.name}
          picture={mine.picture}
          level={mine.level.toString()}
          buttonText="Mine"
          width={150}
          imageWidth={80}
          imageHeight={100}
          nftNameStyle="text-[15px] pr-1"
          btnStyle="bg-gradient-to-b from-[#8E8B77] to-[#30302E] text-xs h-6 w-24 h-6 font-bold drop-shadow-lg"
        />
      ))}
    </div>
  );
};

export default MineTab;
