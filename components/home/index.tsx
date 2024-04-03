import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";

import tabData from "@/data/home-page-tab-data.json";
import inventoryData from "@/data/inventory-data.json";
import CustomTabs from "../common/custom-tabs";
import { TabDataProps } from "@/interfaces";
import Utils from "@/lib/utils";
import LevelsRequiredModal from "../common/modal";

const HomePage = () => {
  const { renderHomeTabComponents, renderInventoryTabComponents } = Utils();
  const [homeTabData, setHomeTabData] = useState<TabDataProps[]>([]);
  const [inventoryTabData, setInventoryTabData] = useState<TabDataProps[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const addHomeTabComponents = async () => {
      setHomeTabData(
        await Promise.all(
          tabData.map(async (tab: TabDataProps) => {
            tab.tabComponent = await renderHomeTabComponents(tab.name);
            return tab;
          })
        )
      );
    };

    const addInventoryTabComponents = async () => {
      setInventoryTabData(
        await Promise.all(
          inventoryData.map(async (tab: TabDataProps) => {
            tab.tabComponent = await renderInventoryTabComponents(tab.name);
            return tab;
          })
        )
      );
    };

    addHomeTabComponents();
    addInventoryTabComponents();
  }, []);

  useEffect(() => {
    document.body.style.backgroundImage =
      "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/assets/images/main-bg.jpg')";
    document.body.style.backgroundSize = "100vw 100vh";
    document.body.style.backgroundRepeat = "no-repeat";
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
            <div
              onClick={() => setVisible(true)}
              className="flex justify-center underline gap-2 cursor-pointer"
            >
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

        <div className="bg-gradient-to-b from-[#000000] to-[#30302E] rounded-lg rounded-tl-none rounded-tr-none max-h-[63vh] overflow-y-scroll">
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
                tabData={inventoryTabData}
              />
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <div className="w-[50%]">
        <CustomTabs initialActiveTab="Shop" tabData={homeTabData} />
      </div>
      <LevelsRequiredModal visible={visible} setVisible={setVisible} />
    </main>
  );
};

export default HomePage;
