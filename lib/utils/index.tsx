import AllTab from "@/components/home/inventory/all";
import CraftTab from "@/components/home/tabs/craft";
import AdamantiteTab from "@/components/home/tabs/craft/tabs/adamantite";
import BronzeTab from "@/components/home/tabs/craft/tabs/bronze";
import IronTab from "@/components/home/tabs/craft/tabs/iron";
import MithrilTab from "@/components/home/tabs/craft/tabs/mithril";
import RuniteTab from "@/components/home/tabs/craft/tabs/runite";
import SteelTab from "@/components/home/tabs/craft/tabs/steel";
import MineTab from "@/components/home/tabs/mine";
import RefineTab from "@/components/home/tabs/refine";
import ShopTab from "@/components/home/tabs/shop";

export const renderCraftTabComponents = async (component: string) => {
  switch (component) {
    case "Bronze":
      return (
        <>
          <BronzeTab />
        </>
      );
    case "Iron":
      return <IronTab />;

    case "Steel":
      return <SteelTab />;
    case "Mithril":
      return <MithrilTab />;

    case "Adamantite":
      return <AdamantiteTab />;
    case "Runite":
      return <RuniteTab />;
  }
};

export const renderHomeTabComponents = async (component: string) => {
  switch (component) {
    case "Shop":
      return <ShopTab />;

    case "Craft":
      return <CraftTab />;

    case "Mine":
      return <MineTab />;

    case "Refine":
      return <RefineTab />;
  }
};

export const renderInventoryTabComponents = async (component: string) => {
  switch (component) {
    case "All":
      return <AllTab />;
  }
};
