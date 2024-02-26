import AllTab from "@/components/home/inventory/all";
import CraftTab from "@/components/home/tabs/craft";
import BronzeTab from "@/components/home/tabs/craft/tabs/bronze";
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
