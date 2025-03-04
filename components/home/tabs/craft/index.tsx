import { Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

import { TAGS } from "@/config/config";
import CustomTabs from "@/components/common/custom-tabs";

const CraftTab = () => {
  const [loading, setLoading] = useState(false);
  const [craftTabs, setCraftTabs] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    if (craftTabs.length > 0) return;
    const tags = Array.from(TAGS);
    setCraftTabs(tags);
    setLoading(false);
  }, []);

  return (
    <div className="mt-5">
      {loading || craftTabs.length === 0 ? (
        <Spinner color="white" />
      ) : (
        <CustomTabs
          isVertical={true}
          tabData={craftTabs}
          initialActiveTab={craftTabs[0]}
        />
      )}
    </div>
  );
};

export default CraftTab;
