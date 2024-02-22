import Image from "next/image";
import React from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";

import CustomTabs from "../common/custom-tabs";
import NftCard from "../common/nft-card";

const tabData = [
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

const tabsData = [
  {
    name: "All",
    notifications: 0,
    tabComponent: (
      <div>
        <p className="py-2 font-thin "> Recently Added</p>
        <NftCard
          buttonText="Claimed"
          level="01"
          picture="/assets/images/bronze-Pickaxe.png"
          name="Bronze Pickaxe"
        />

        <div className="flex justify-start items-start  mt-4 ">
          <NftCard
            buttonText="Claimed"
            level="01"
            picture="/assets/images/bronze-Pickaxe.png"
            name="Bronze Pickaxe"
          />
          <NftCard
            buttonText="Claimed"
            level="01"
            picture="/assets/images/bronze-Pickaxe.png"
            name="Bronze Pickaxe"
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

const HomePage = () => {
  return (
    <main className="w-full flex justify-center items-start mt-12 gap-2">
      <div className="w-[22%]">
        <div className="w-full flex justify-between items-center bg-black rounded-lg  p-3 rounded-bl-none rounded-br-none">
          <div className="flex justify-center items-center">
            <Image
              className="m-4"
              src="/assets/images/nftprofile.png"
              alt="profile"
              width={50}
              height={0}
            />
            <div className="flex flex-col justify-center items-start">
              <p className="text-white font-bold  text-xl">Max</p>
              <p className="text-white ">{"Profile >"}</p>
            </div>
          </div>

          <div className="flex flex-col justify-center items-start pr-2">
            <div className="flex justify-center underline gap-2">
              <Image
                src="/assets/svgs/rubiks.svg"
                alt="rubiks"
                width={28}
                height={0}
              />
              Level : 01
            </div>

            <div className="flex justify-center gap-2">
              <Image
                src="/assets/svgs/lightning.svg"
                alt="rubiks"
                width={30}
                height={0}
              />
              Exp : 0
            </div>
          </div>
        </div>
        {/* dropdown show inventory */}

        <div className="w-full bg-gradient-to-b from-[#000000] to-[#30302E] rounded-lg rounded-tl-none rounded-tr-none">
          <Accordion className="w-full flex justify-center items-center ">
            <AccordionItem
              key="1"
              aria-label="Accordion 1"
              title="Show Inventory"
            >
              <CustomTabs
                styles="min-w-max "
                initialActiveTab="All"
                tabData={tabsData}
              />
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <div className="w-[50%]">
        <CustomTabs initialActiveTab="Shop" tabData={tabData} />
      </div>
    </main>
  );
};

export default HomePage;
