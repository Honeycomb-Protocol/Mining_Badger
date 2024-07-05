import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Spinner, user } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import NftCard from "@/components/common/nft-card";
import Utils from "@/lib/utils";
import { API_URL } from "@/config/config";
import { useHoneycomb } from "@/hooks";
import { AuthActionsWithoutThunk } from "@/store/auth";

const ShopTab = () => {
  const { userLevelInfo, fetchShopResourcesData, apiCallDelay } = Utils();
  const { publicKey } = useWallet();
  const [shopData, setShopData] = useState([]);
  const [dataLoader, setDataLoader] = useState(false);
  const dispatch = useDispatch();
  const { faucetClaim } = useHoneycomb();
  const [loading, setLoading] = useState({
    name: "",
    status: false,
  });

  useEffect(() => {
    if (!publicKey) return;
    const fetchData = async () => {
      const res = await fetchShopResourcesData(setDataLoader);
      setShopData(res);
    };
    fetchData();
  }, []);

  const claimResource = async (resourceId: string, name: string) => {
    try {
      setLoading({ name: name, status: true });
      console.log("Claiming resource", resourceId);
      const result = await faucetClaim(resourceId);
      await apiCallDelay();
      const data = await fetchShopResourcesData(setDataLoader, true);
      setShopData(data);
      setLoading({ name: "", status: false });
      dispatch(AuthActionsWithoutThunk.setRefreshInventory(true));
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
              // lock={true}
              buttonText={item?.claimed ? "Claimed" : "Claim Axe"}
              imageWidth={150}
              imageHeight={150}
              nftNameStyle="text-[15px] pr-1"
              isCompressed={true}
              canUnwrapped={false}
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
              btnClick={async () =>
                userLevelInfo.level >= item?.lvl_req &&
                !item.claimed &&
                claimResource(item?.address, item?.name).then(() => {
                  console.log("Claimed resource");
                  dispatch(AuthActionsWithoutThunk.setRefreshInventory(true));
                })
              }
              loading={loading}
              addStyles={"!absolute !bottom-[25%] !right-[25%]"}
            />
          ))
      )}
    </div>
  );
};

export default ShopTab;
