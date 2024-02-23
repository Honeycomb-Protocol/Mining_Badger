import CustomTabs from "@/components/common/custom-tabs";
import React, { useEffect } from "react";

import craftData from "@/data/craft-data.json";
import { renderCraftTabComponents } from "@/lib/utils";
import { TabDataProps } from "@/interfaces";

const CraftTab = () => {
  useEffect(() => {
    craftData.forEach((tab: TabDataProps) => {
      tab.tabComponent = renderCraftTabComponents(tab.name);
    });
  }, []);

  return (
    <div className="mt-5">
      <CustomTabs
        isVertical={true}
        tabData={craftData}
        initialActiveTab="Bronze"
      />
    </div>
  );
};

export default CraftTab;
