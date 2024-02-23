import NftCard from "@/components/common/nft-card";

export const renderHomeTabComponents = (component: string) => {
  switch (component) {
    case "Shop":
      return (
        <NftCard
          name="Bronze Pickaxe"
          picture="/assets/images/bronze-Pickaxe.png"
          buttonText="Claim"
          level="1"
        />
      );
  }
};

export const renderInventoryTabComponents = (component: string) => {
  switch (component) {
    case "All":
      return (
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
      );
  }
};
