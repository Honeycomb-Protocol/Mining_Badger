import React, { useEffect, useState } from "react";

import Utils from "@/lib/utils";
import InventoryTab from "@/components/home/inventory";
import { CustomTabsProps, ResourceType } from "@/interfaces";
import CraftComponent from "@/components/home/tabs/craft/tabs";

const CustomTabs = ({
  tabData,
  styles,
  initialActiveTab,
  isVertical,
}: CustomTabsProps) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [currentTabComponent, setCurrentTabComponent] = useState(null);
  const { renderHomeTabComponents } = Utils();

  const convertToRequestFormat = (tab: string) => {
    switch (tab) {
      case "All":
        return ResourceType.ALL;
      case "Ores":
        return ResourceType.ORE;
      case "Bars":
        return ResourceType.BAR;
      case "Pickaxes":
        return ResourceType.Pickaxe;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchTabComponent = async () => {
      try {
        let tabComponent;

        if (tabData?.includes("Shop")) {
          tabComponent = await renderHomeTabComponents(activeTab);
        } else if (tabData?.includes("All")) {
          tabComponent = (
            <InventoryTab name={convertToRequestFormat(activeTab)} />
          );
        } else {
          tabComponent = <CraftComponent tag={activeTab} />;
        }

        if (isMounted) {
          setCurrentTabComponent(tabComponent);
        }
      } catch (error) {
        console.error("Error fetching tab component:", error);
      }
    };

    fetchTabComponent();

    return () => {
      isMounted = false;
    };
  }, [activeTab, tabData]);

  return (
    <div
      className={`w-full flex rounded-xl ${
        isVertical ? "flex-row justify-center items-start" : "flex-col"
      }`}
    >
      <div
        className={` ${
          isVertical
            ? "flex-col w-52 overflow-x-hidden overflow-y-auto"
            : "flex w-full overflow-y-hidden overflow-x-auto"
        }   bg-black bg-opacity-100 rounded-xl`}
      >
        {tabData?.map((tab) => (
          <div
            className={`${
              activeTab === tab &&
              "bg-gradient-to-r from-[#E7CB5F] to-[#CD6448]"
            }  h-12  px-4 rounded-xl flex-1 flex items-center font-bold cursor-pointer
          transition-all hover:scale-105 hover:bg-opacity-10 hover:bg-black ${styles} whitespace-nowrap  ${
              isVertical
                ? "mb-2 my-4 mx-2 justify-start "
                : "mr-2 justify-center"
            }`}
            key={tab}
            onClick={() => {
              setActiveTab(tab);
            }}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="w-full p-3 2xl:p-5">{currentTabComponent}</div>
    </div>
  );
};

export default CustomTabs;
