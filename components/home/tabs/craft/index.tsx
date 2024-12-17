import { Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

import Utils from "@/lib/utils";
import CustomTabs from "@/components/common/custom-tabs";

const CraftTab = () => {
  const { getCraftTags } = Utils();
  const [loading, setLoading] = useState(false);
  const [craftTabs, setCraftTabs] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      if (craftTabs.length > 0) return;
      const tags = await getCraftTags(setLoading);
      setCraftTabs(tags);
    })();
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
