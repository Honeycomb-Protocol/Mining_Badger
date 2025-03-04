import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Spinner } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { useHoneycombInfo } from "@honeycomb-protocol/profile-hooks";

import Utils, { getCache } from "@/lib/utils";
import NftCard from "@/components/common/nft-card";
import { MineDataType, ResourceType } from "@/interfaces";
import { InventoryActionsWithoutThunk } from "@/store/inventory";
import Faucet from "@/lib/utils/faucet";

const MineTab = () => {
  const dispatch = useDispatch();
  const { fetchMineResourcesData, userInfo, fetchInventoryData } = Utils();
  const { claimFaucet } = Faucet();
  const { currentWallet } = useHoneycombInfo();
  const [mineData, setMineData] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [dataLoader, setDataLoader] = useState(false);
  const [loading, setLoading] = useState({
    name: "",
    status: false,
  });

  const prevLoadingRef = useRef(loading?.status);
  useEffect(() => {
    if (!currentWallet?.publicKey) return;
    (async () => {
      setDataLoader(true);
      if (
        mineData?.length === 0 ||
        (!loading?.status && prevLoadingRef.current)
      ) {
        const res = await fetchMineResourcesData(setDataLoader);
        setMineData(res);
      }
      if (inventory?.length === 0) {
        const cacheInventory = (await getCache("inventoryData"))?.result;
        if (cacheInventory && cacheInventory?.length > 0) {
          setInventory(cacheInventory);
        } else if (!cacheInventory || cacheInventory?.length === 0) {
          const invent = await fetchInventoryData(ResourceType.BAR, () => true);
          setInventory(invent);
        }
      }
      setDataLoader(false);
      prevLoadingRef.current = loading?.status;
    })();
  }, [
    currentWallet?.publicKey,
    mineData?.length,
    inventory?.length,
    loading?.status,
  ]);

  const mineResource = async (resourceId: string, name: string) => {
    try {
      setLoading({ name: name, status: true });
      await claimFaucet(resourceId);
      const data = await fetchMineResourcesData(setDataLoader);
      setMineData(data);
      dispatch(InventoryActionsWithoutThunk.setRefreshInventory(true));
      await fetchInventoryData(
        ResourceType.ALL,
        setDataLoader,
        true,
        dataLoader
      );
      setLoading({ name: "", status: false });
      toast.success(`${name} Resource mined successfully`);
    } catch (err: any) {
      setLoading({ name: "", status: false });
      const errorMessage =
        err.response?.data?.error || // Matches API's error format
        err.message || // Catches any thrown errors
        "Something went wrong"; // Fallback error message
      toast.error(errorMessage);
    }
  };

  return (
    <div className="py-10 grid grid-cols-4 gap-8">
      {dataLoader ? (
        <Spinner color="white" />
      ) : (
        mineData
          ?.sort((a, b) => a.lvl_req - b.lvl_req)
          ?.map((data: MineDataType, index: number) => (
            <NftCard
              key={index}
              name={data?.name}
              picture={
                data?.uri.includes("assets") ? `/${data?.uri}` : data?.uri
              }
              level={data?.lvl_req}
              buttonText="Mine"
              width={150}
              imageWidth={80}
              imageHeight={100}
              nftNameStyle="text-[15px] pr-1"
              btnStyle="bg-gradient-to-b from-[#8E8B77] to-[#30302E] text-xs h-6 w-24 h-6 font-bold drop-shadow-lg"
              expIn={data?.expire}
              resourceInfo={
                userInfo?.level < data?.lvl_req
                  ? `User level ${data?.lvl_req} is required to mine this resource.`
                  : ""
              }
              btnInfo={
                !inventory?.some((e) => e.symbol === "BRP")
                  ? "First claim Pickaxe from the shop to mine resources."
                  : ""
              }
              btnDisabled={
                loading.name === data?.name ||
                userInfo?.level < data?.lvl_req ||
                !inventory?.some((e) => e.symbol === "BRP")
              }
              btnClick={async () => {
                await mineResource(data?.address, data?.name);
              }}
              loading={loading}
            />
          ))
      )}
    </div>
  );
};

export default MineTab;
