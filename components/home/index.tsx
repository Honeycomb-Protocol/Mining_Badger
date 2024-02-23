import Image from "next/image";
import React, { useEffect } from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";

import tabData from "@/data/home-page-tab-data.json";
import inventoryData from "@/data/inventory-data.json";
import CustomTabs from "../common/custom-tabs";
import { TabDataProps } from "@/interfaces";
import {
  renderHomeTabComponents,
  renderInventoryTabComponents,
} from "@/lib/utils";

const HomePage = () => {
  useEffect(() => {
    tabData.forEach((tab: TabDataProps) => {
      tab.tabComponent = renderHomeTabComponents(tab.name);
    });

    inventoryData.forEach((tab: TabDataProps) => {
      tab.tabComponent = renderInventoryTabComponents(tab.name);
    });
  }, []);

  return (
    <main className="w-full flex justify-center items-start mt-12 gap-10">
      <div className="w-[27%]">
        <div className="w-full flex justify-between items-center bg-black rounded-lg p-3 rounded-bl-none rounded-br-none">
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

        <div className="bg-gradient-to-b from-[#000000] to-[#30302E] rounded-lg rounded-tl-none rounded-tr-none">
          <Accordion className="w-full">
            <AccordionItem
              className="w-full"
              key="1"
              aria-label="Accordion 1"
              title="Show Inventory"
            >
              <CustomTabs
                styles="min-w-max !h-10"
                initialActiveTab="All"
                tabData={inventoryData}
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
