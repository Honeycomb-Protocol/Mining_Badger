import Image from "next/image";
import React from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";

import CustomTabs from "../common/custom-tabs";
import NftCard from "../common/nft-card";
import { inventoryData, tabData } from "@/lib/utils/constants";

const HomePage = () => {
  return (
    <main className="w-full flex justify-center items-start mt-12 gap-2">
      <div className="w-[27%]">
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

        <div className=" bg-gradient-to-b from-[#000000] to-[#30302E] rounded-lg rounded-tl-none rounded-tr-none">
          <Accordion className="w-full flex justify-center items-center  ">
            <AccordionItem
              className="w-full flex-col items-center justify-center"
              key="1"
              aria-label="Accordion 1"
              title="Show Inventory"
            >
              <CustomTabs
                styles="min-w-max "
                initialActiveTab="All"
                tabData={inventoryData}
              />
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <div className="w-[60%]">
        <CustomTabs initialActiveTab="Shop" tabData={tabData} />
      </div>
    </main>
  );
};

export default HomePage;
