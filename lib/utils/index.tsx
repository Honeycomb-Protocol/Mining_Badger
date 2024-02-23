import CustomTabs from "@/components/common/custom-tabs";
import NftCard from "@/components/common/nft-card";
import AllTab from "@/components/home/inventory/all";
import CraftTab from "@/components/home/tabs/craft";
import BronzeTab from "@/components/home/tabs/craft/tabs/bronze";
import MineTab from "@/components/home/tabs/mine";
import craftData from "@/data/craft-data.json";
import { useEffect } from "react";

export const renderCraftTabComponents = (component: string) => {
  switch (component) {
    case "Bronze":
      return (
        <>
          <BronzeTab />
        </>
      );
  }
};

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

    case "Craft":
      return <CraftTab />;

    case "Mine":
      return <MineTab />;
  }
};

export const renderInventoryTabComponents = (component: string) => {
  switch (component) {
    case "All":
      return <AllTab />;
  }
};
