import NftCard from "@/components/common/nft-card";

export const tabData = [
  {
    name: "Shop",
    notifications: 0,
    tabComponent: (
      <NftCard
        picture="/assets/images/bronze-Pickaxe.png"
        buttonText="Claimed"
        level="1"
        name="Bronze Pickaxe"
      />
    ),
  },
  { name: "Mine", notifications: 0, tabComponent: <div>General Store 2</div> },
  {
    name: "Refine",
    notifications: 0,
    tabComponent: <div>General Store 3</div>,
  },
  { name: "Craft", notifications: 0, tabComponent: <div>General Store 4</div> },
  {
    name: "General Store",
    notifications: 4,
    tabComponent: <div>General Store</div>,
  },
];

export const inventoryData = [
  {
    name: "All",
    notifications: 0,
    tabComponent: (
      <div className="my-5">
        <p className="py-2 font-thin "> Recently Added</p>
        <NftCard
          picture="/assets/images/bronze-Pickaxe.png"
          name="Bronze Pickaxe"
          width="w-32"
          imageHeight="h-32"
        />

        <div className="flex justify-start gap-10 items-start mt-10">
          <NftCard
            picture="/assets/images/bronze-alloy-cube.png"
            name="Bronze Bar"
            notification={34}
            width="w-16"
            imageHeight="h-16"
          />
          <NftCard
            picture="/assets/images/copper-stone-noline.png"
            name="Ore 1"
            notification={34}
            width="w-16"
            imageHeight="h-16"
          />
          <NftCard
            picture="/assets/images/Adamnite-stone-noline.png"
            name="Ore 1"
            notification={34}
            width="w-16"
            imageHeight="h-16"
          />
        </div>
      </div>
    ),
  },
  { name: "Ores", notifications: 0, tabComponent: <div>General Store 2</div> },
  {
    name: "Bar",
    notifications: 0,
    tabComponent: <div>General Store 3</div>,
  },
  {
    name: "Weapons",
    notifications: 0,
    tabComponent: <div>General Store 4</div>,
  },
  {
    name: "Armours",
    notifications: 0,
    tabComponent: <div>General Store</div>,
  },
];
