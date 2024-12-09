import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import Utils from "@/lib/utils";
import NftCard from "@/components/common/nft-card";
import { InventoryActionsWithoutThunk } from "@/store/inventory";

const ShopTab = () => {
  const { userLevelInfo, fetchShopResourcesData, claimFaucet } = Utils();
  const { publicKey } = useWallet();
  const [shopData, setShopData] = useState([]);
  const [dataLoader, setDataLoader] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState({
    name: "",
    status: false,
  });

  useEffect(() => {
    if (!publicKey) return;
    (async () => {
      if (shopData?.length === 0) {
        const res = await fetchShopResourcesData(setDataLoader);
        setShopData(res);
      }
    })();
  }, [publicKey, shopData.length]);

  const claimResource = async (resourceId: string, name: string) => {
    try {
      setLoading({ name: name, status: true });
      await claimFaucet(resourceId);
      const data = await fetchShopResourcesData(setDataLoader, true);
      setShopData(data);
      dispatch(InventoryActionsWithoutThunk.setRefreshInventory(true));
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
              lock={userLevelInfo.level < item?.lvl_req}
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
                userLevelInfo.level < item?.lvl_req
              }
              btnClick={async () => {
                await claimResource(item?.address, item?.name);
                dispatch(
                  InventoryActionsWithoutThunk.setRefreshInventory(true)
                );
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
