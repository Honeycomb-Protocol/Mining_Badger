import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useHoneycombInfo } from "@honeycomb-protocol/profile-hooks";
import { Accordion, AccordionItem, Progress } from "@nextui-org/react";

import Utils from "@/lib/utils";
import { Footer } from "@/pages/_app";
import CustomTabs from "../common/custom-tabs";
import LevelsRequiredModal from "../common/modal";

const HomePage = () => {
  const { currentProfile } = useHoneycombInfo();
  const { userLevelInfo } = Utils();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.body.style.backgroundImage =
      "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/assets/images/main-bg.jpg')";
    document.body.style.backgroundSize = "100vw 100vh";
    document.body.style.backgroundRepeat = "no-repeat";
  }, []);

  const itemClasses = {
    trigger: "bg-gradient-to-b from-[#2e2727,5%] to-[#1b1414] mb-2",
  };

  return (
    <main className="w-full flex justify-center items-start mt-12 gap-10">
      <div className="w-[27%]">
        <div className="w-full bg-black rounded-lg p-3 rounded-bl-none rounded-br-none">
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-center items-center">
              <Image
                className="m-4"
                src="/assets/images/nftprofile.png"
                alt="profile"
                width={60}
                height={0}
              />
              <div className="flex flex-col justify-center items-start">
                <p className="text-white font-semibold text-lg">
                  {currentProfile?.info?.name || "Max"}
                </p>
                <p className="text-gray-500">Bronze Pickaxe</p>
              </div>
            </div>
            <p className="text-gray-500 font-bold text-sm cursor-pointer bg-gray-900 px-2 py-1 rounded-md">
              EDIT
            </p>
          </div>
          <div className="flex justify-between px-2 mt-4">
            <p>Level</p>
            <p className="cursor-pointer" onClick={() => setVisible(true)}>
              <span>{userLevelInfo?.level || 1}</span>{" "}
              <span className="text-[#61BCEF] text-lg">Lv</span>
            </p>
          </div>

          <div className="px-2 mt-3 mb-2">
            <div className="flex justify-between items-center mb-1">
              <p>Experience</p>
              <p>
                {userLevelInfo?.current_exp || 0} /{" "}
                {userLevelInfo?.exp_req || 0}{" "}
                <span className="text-[#FCC85D] text-lg">XP</span>
              </p>
            </div>
            <Progress
              size="md"
              value={Number(userLevelInfo?.current_exp)}
              maxValue={userLevelInfo?.exp_req}
              color="warning"
              showValueLabel={false}
              classNames={{
                base: "max-w-md",
                indicator: "bg-gradient-to-r from-[#FCC85D,94%] to-[#FFEAC0]",
              }}
            />
          </div>
          <div className="px-2 mt-3 mb-2">
            <Footer />
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#140a04] to-[#120701] max-h-[60vh] overflow-y-scroll">
          <Accordion className="w-full" itemClasses={itemClasses}>
            <AccordionItem
              className="w-full"
              key="1"
              aria-label="Accordion 1"
              title="Show Inventory"
            >
              <CustomTabs
                styles="min-w-max !h-10"
                initialActiveTab="All"
                tabData={["All", "Ores", "Bars", "Pickaxes"]}
              />
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <div className="w-[50%]">
        <CustomTabs
          initialActiveTab="Body"
          tabData={["Body", "Shop", "Mine", "Refine", "Craft"]}
        />
      </div>
      <LevelsRequiredModal visible={visible} setVisible={setVisible} />
    </main>
  );
};

export default HomePage;
