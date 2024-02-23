import React, { useState } from "react";

import { CustomTabsProps } from "@/interfaces";

const CustomTabs = ({ tabData, styles, initialActiveTab }: CustomTabsProps) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab);

  return (
    <div className="w-full">
      <div className="w-full  flex bg-gray-500 bg-opacity-20 rounded-xl">
        {tabData?.map((tab) => (
          <div
            className={`${
              activeTab === tab.name &&
              "bg-gradient-to-r from-[#E7CB5F] to-[#CD6448]"
            }  h-12 px-4 rounded-xl flex-1 flex justify-center items-center font-bold cursor-pointer
          transition-all hover:scale-105 hover:bg-opacity-10 hover:bg-black ${styles} whitespace-nowrap`}
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.name}
            {tab.notifications && tab.notifications !== 0 ? (
              <span className="rounded-full bg-red-700 text-xs w-5 h-5 flex justify-center items-center ml-3">
                {tab.notifications}
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <div className="w-full">
        {tabData?.filter((tab) => tab.name === activeTab)[0].tabComponent}
      </div>
    </div>
  );
};

export default CustomTabs;
