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

// stones
const copperStoneNoline = "/assets/images/copper-stone-noline.png";
const tinStoneNoline = "/assets/images/tin-stone-noline.png";
const ironStoneNoline = "/assets/images/iron-stone-noline.png";
const coalStoneNoline = "/assets/images/coal-stone-noline.png";
const mithrilAlloyNoline = "/assets/images/mithril-stone-noline.png";
const adamantiteAlloyNoline = "/assets/images/adamantite-stone-noline.png";
const runiteStoneNoline = "/assets/images/runite-stone-noline.png";
const goldStoneNoline = "/assets/images/gold-stone-noline.png";

// cubes
const bronzeAlloyCube = "/assets/images/bronze-alloy-cube.png";
const ironAlloyCube = "/assets/images/iron-alloy-cube.png";
const steelAlloyCube = "/assets/images/steel-alloy-cube.png";
const goldAlloyCube = "/assets/images/gold-alloy-cube.png";
const mithrilAlloyCube = "/assets/images/mithril-alloy-cube.png";
const adamantiteAlloyCube = "/assets/images/adamantite-alloy-cube.png";
const runiteAlloyCube = "/assets/images/runite-alloy-cube.png";

import LevelsData from "../../data/level-data.json";

export const renderCraftTabComponents = async (component: string) => {
  switch (component) {
    case "Bronze":
      return <BronzeTab />;
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

export const getStoneImage = (name: string) => {
  switch (name) {
    case "copper":
      return copperStoneNoline;
    case "tin":
      return tinStoneNoline;
    case "iron":
      return ironStoneNoline;
    case "coal":
      return coalStoneNoline;
    case "mithril":
      return mithrilAlloyNoline;
    case "adamantite":
      return adamantiteAlloyNoline;
    case "runite":
      return runiteStoneNoline;
    case "gold":
      return goldStoneNoline;
  }
};

export const getCubeImage = (name: string) => {
  switch (name) {
    case "bronze":
      return bronzeAlloyCube;
    case "iron":
      return ironAlloyCube;
    case "steel":
      return steelAlloyCube;
    case "gold":
      return goldAlloyCube;
    case "mithril":
      return mithrilAlloyCube;
    case "adamantite":
      return adamantiteAlloyCube;
    case "runite":
      return runiteAlloyCube;
  }
};

export const getLevelsFromExp = (exp: number) => {
  for (let i = 0; i < LevelsData.length; i++) {
    if (exp < LevelsData[i].minExp) {
      return i === 0 ? 1 : LevelsData[i - 1].level;
    }
  }
  return LevelsData[LevelsData.length - 1].level;
};
