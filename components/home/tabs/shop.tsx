import React from "react";

import ShopData from "@/data/shop-data.json";
import NftCard from "@/components/common/nft-card";

const ShopTab = () => {
  return (
    <div className="py-10 grid grid-cols-3 gap-8 items-start">
      {ShopData.map((item, index) => (
        <NftCard
          key={index}
          name={item.name}
          picture={item.picture}
          level={item.level.toString()}
          lock={item.lock}
          buttonText={item.name?.includes("Iron Pickaxe") ? "Buy" : "Claimed"}
          imageWidth={150}
          imageHeight={150}
          nftNameStyle="text-[15px] pr-1"
          btnStyle={
            item.name?.includes("Iron Pickaxe")
              ? "bg-gradient-to-b from-[#8E8B77] to-[#30302E] text-xs h-6 w-24 h-6 font-bold drop-shadow-lg"
              : "bg-gradient-to-b from-[#81FD9C] to-[#30302E] text-xs h-6 w-24 h-6 font-bold drop-shadow-lg"
          }
        />
      ))}
    </div>
  );
};

export default ShopTab;
