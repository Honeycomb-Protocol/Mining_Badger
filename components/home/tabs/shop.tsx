import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Spinner } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { useHoneycombInfo } from "@honeycomb-protocol/profile-hooks";

import Utils, { getCache } from "@/lib/utils";
import { ResourceType } from "@/interfaces";
import NftCard from "@/components/common/nft-card";
import { InventoryActionsWithoutThunk } from "@/store/inventory";

const ShopTab = () => {
  const dispatch = useDispatch();
  const {
    userLevelInfo,
    fetchShopResourcesData,
    claimFaucet,
    fetchInventoryData,
  } = Utils();
  const { currentWallet } = useHoneycombInfo();
  const [shopData, setShopData] = useState([]);
  const [dataLoader, setDataLoader] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState({
    name: "",
    status: false,
  });

  const prevLoadingRef = useRef(loading?.status);
  useEffect(() => {
    if (!currentWallet?.publicKey) return;
    (async () => {
      if (shopData?.length === 0) {
        const res = await fetchShopResourcesData(setDataLoader);
        setShopData(res);
      }
      if (
        inventory?.length === 0 ||
        (!loading?.status && prevLoadingRef.current)
      ) {
        const cacheInventory = (await getCache("inventoryData"))?.result;
        if (cacheInventory && cacheInventory?.length > 0) {
          setInventory(cacheInventory);
        } else if (!cacheInventory || cacheInventory?.length === 0) {
          const invent = await fetchInventoryData(
            ResourceType.ALL,
            setDataLoader
          );
          setInventory(invent);
        }
      }
      prevLoadingRef.current = loading?.status;
    })();
  }, [
    currentWallet?.publicKey,
    shopData?.length,
    inventory?.length,
    loading?.status,
  ]);

  const claimResource = async (resourceId: string, name: string) => {
    try {
      setLoading({ name: name, status: true });
      await claimFaucet(resourceId);
      const data = await fetchShopResourcesData(setDataLoader, true);
      setShopData(data);
      dispatch(InventoryActionsWithoutThunk.setRefreshInventory(true));
      await fetchInventoryData(
        ResourceType.ALL,
        setDataLoader,
        true,
        dataLoader
      );
      setLoading({ name: "", status: false });
      toast.success(`${name} claimed successfully`);
    } catch (err: any) {
      setLoading({ name: "", status: false });
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="py-10 grid grid-cols-3 gap-8 items-start">
      {dataLoader ? (
        <Spinner color="white" />
      ) : (
        shopData
          ?.sort((a, b) => a.lvl_req - b.lvl_req)
          .map((item, index) => (
            <NftCard
              key={index}
              name={item?.name}
              picture={item?.uri}
              level={item?.lvl_req}
              lock={userLevelInfo?.level < item?.lvl_req}
              buttonText={item?.claimed ? "Claimed" : "Claim Axe"}
              imageWidth={150}
              imageHeight={150}
              nftNameStyle="text-[15px] pr-1"
              miningTimeReduction={
                item?.name.split(" ")[0] === "Bronze"
                  ? null
                  : `-${String(item?.time_reduced ? item.time_reduced : "0")}%`
              }
              resourceInfo={
                item?.claimed
                  ? "This pickaxe is already in your inventory."
                  : `This pickaxe can be claimed for a ${
                      item?.time_reduced ? item.time_reduced : "0"
                    }% reduction in mining time.`
              }
              btnStyle={
                "bg-gradient-to-b from-[#81FD9C] to-[#30302E] text-xs h-6 w-24 h-6 font-bold drop-shadow-lg"
              }
              btnDisabled={
                loading.name === item?.name ||
                item?.claimed ||
                userLevelInfo?.level < item?.lvl_req
              }
              btnClick={async () => {
                await claimResource(item?.address, item?.name);
              }}
              loading={loading}
              addStyles={"!absolute !bottom-[25%] !right-[25%]"}
            />
          ))
      )}
    </div>
  );
};

export default ShopTab;
