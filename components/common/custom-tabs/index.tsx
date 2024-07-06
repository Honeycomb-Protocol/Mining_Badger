import React, { useEffect, useState } from "react";

import { CustomTabsProps } from "@/interfaces";
import Utils from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { Spinner } from "@nextui-org/react";

const CustomTabs = ({
  tabData,
  styles,
  initialActiveTab,
  isVertical,
}: CustomTabsProps) => {
  const { fetchInventoryData } = Utils();
  const { publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const currentData = tabData?.filter((tab) => tab?.name === activeTab)[0]
    ?.tabComponent;
  const [inventoryData, setInventoryData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (!publicKey) return;
    const fetchData = async () => {
      const inventoryData = await fetchInventoryData(
        "pickaxe",
        setDataLoading,
        true
      );
      setInventoryData(inventoryData);
    };
    fetchData();
  }, []);

  return dataLoading ? (
    <Spinner color="white" />
  ) : (
    <div
      className={`w-full flex rounded-xl ${
        isVertical ? "flex-row justify-center items-start" : "flex-col"
      }`}
    >
      <div
        className={` ${
          isVertical
            ? "flex-col w-48 overflow-x-hidden overflow-y-auto"
            : "flex w-full overflow-y-hidden overflow-x-auto"
        }   bg-black bg-opacity-100 rounded-xl`}
      >
        {tabData?.map((tab) => (
          <div
            className={`${
              activeTab === tab.name &&
              "bg-gradient-to-r from-[#E7CB5F] to-[#CD6448]"
            }  h-12  px-4 rounded-xl flex-1 flex items-center font-bold cursor-pointer
          transition-all hover:scale-105 hover:bg-opacity-10 hover:bg-black ${styles} whitespace-nowrap  ${
              isVertical ? "mb-2 m-4 justify-start " : "mr-2 justify-center"
            }`}
            key={tab.name}
            onClick={() => {
              if (
                inventoryData
                  ?.map((item) => item.name)
                  .includes("Bronze Pickaxe")
              ) {
                setActiveTab(tab.name);
              } else {
                const inventoryData = fetchInventoryData(
                  "pickaxe",
                  setDataLoading,
                  true,
                  true
                ).then((res: any) => {
                  if (res?.map((item) => item.name).includes("Bronze Pickaxe"))
                    setActiveTab(tab.name);
                });
              }
            }}
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
      <div className="w-full p-3 2xl:p-5">{currentData}</div>
    </div>
  );
};

export default CustomTabs;
