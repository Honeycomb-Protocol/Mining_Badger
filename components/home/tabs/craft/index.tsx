import CustomTabs from "@/components/common/custom-tabs";
import React, { useEffect, useState } from "react";

import craftData from "@/data/craft-data.json";
import Utils from "@/lib/utils";
import { TabDataProps } from "@/interfaces";

const CraftTab = () => {
  const { renderCraftTabComponents } = Utils();
  const [craftTabData, setCraftTabData] = useState<TabDataProps[]>([]);

  useEffect(() => {
    const addCraftTabComponents = async () => {
      setCraftTabData(
        await Promise.all(
          craftData.map(async (tab: TabDataProps) => {
            tab.tabComponent = await renderCraftTabComponents(tab.name);
            return tab;
          })
        )
      );
    };

    addCraftTabComponents();
  }, []);

  return (
    <div className="mt-5">
      <CustomTabs
        isVertical={true}
        tabData={craftTabData}
        initialActiveTab="Bronze"
      />
    </div>
  );
};

export default CraftTab;
