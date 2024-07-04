import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import NftCard from "@/components/common/nft-card";
import Utils from "@/lib/utils";
import { API_URL } from "@/config/config";
import { useHoneycomb } from "@/hooks";
import { AuthActionsWithoutThunk } from "@/store/auth";

const ShopTab = () => {
  const { userLevelInfo, fetchShopResourcesData } = Utils();
  const { publicKey } = useWallet();
  const { user } = useHoneycomb();
  const dispatch = useDispatch();
  const [shopData, setShopData] = useState([]);
  const [dataLoader, setDataLoader] = useState(false);
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
      const result = await axios.post(`${API_URL}faucet/mine`, {
        user: {
          id: user.id,
          wallet: publicKey?.toString(),
        },
        resource: resourceId,
      });
      const data = await fetchShopResourcesData(setDataLoader, true);
      setShopData(data);
      setLoading({ name: "", status: false });
      dispatch(AuthActionsWithoutThunk.setRefreshInventory(true));
      toast.success(result.data.message || "Pickaxe claimed successfully");
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
          ?.sort((a, b) => a.level_req - b.level_req)
          .map((item, index) => (
            <NftCard
              key={index}
              name={item?.name}
              picture={item?.uri}
              level={item?.level_req}
              lock={userLevelInfo.level < item?.level_req}
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
              btnDisabled={loading.name === item?.name || item?.claimed}
              btnClick={async () =>
                !item.claimed &&
                (await claimResource(
                  item?.addresses?.resource,
                  item?.metadata?.name
                ))
              }
              loading={loading}
            />
          ))
      )}
    </div>
  );
};

export default ShopTab;
