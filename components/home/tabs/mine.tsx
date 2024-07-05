import axios from "axios";
import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import { Spinner } from "@nextui-org/react";
import { useDispatch } from "react-redux";

import NftCard from "@/components/common/nft-card";
import { MineDataType } from "@/interfaces";
import { useHoneycomb } from "@/hooks";
import Utils from "@/lib/utils";
import { API_URL } from "@/config/config";
import { AuthActionsWithoutThunk } from "@/store/auth";

const MineTab = () => {
  const dispatch = useDispatch();
  const { fetchMineResourcesData, userLevelInfo } = Utils();
  const { publicKey } = useWallet();
  const [mineData, setMineData] = useState([]);
  const { profile, faucetClaim } = useHoneycomb();
  const [dataLoader, setDataLoader] = useState(false);
  const [loading, setLoading] = useState({
    name: "",
    status: false,
  });

  useEffect(() => {
    if (!publicKey) return;
    const fetchData = async () => {
      const res = await fetchMineResourcesData(setDataLoader);
      setMineData(res);
    };
    fetchData();
  }, []);

  const mineResource = async (resourceId: string, name: string) => {
    try {
      setLoading({ name: name, status: true });
      await faucetClaim(resourceId);
      const data = await fetchMineResourcesData(setDataLoader, true);
      setMineData(data);
      setLoading({ name: "", status: false });
      dispatch(AuthActionsWithoutThunk.setRefreshInventory(true));
      toast.success(`${name} Resource mined successfully`);
    } catch (err: any) {
      setLoading({ name: "", status: false });
      toast.error(err.response?.data?.message || "Something went wrong");
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
              picture={data?.uri}
              level={data?.lvl_req}
              buttonText="Mine"
              width={150}
              imageWidth={80}
              imageHeight={100}
              nftNameStyle="text-[15px] pr-1"
              isCompressed={true}
              canUnwrapped={false}
              btnStyle="bg-gradient-to-b from-[#8E8B77] to-[#30302E] text-xs h-6 w-24 h-6 font-bold drop-shadow-lg"
              expIn={data?.expire}
              resourceInfo={
                userLevelInfo.level < data?.lvl_req
                  ? `User level ${data?.lvl_req} is required to mine this resource.`
                  : ""
              }
              btnDisabled={
                new Date(data?.expire).getTime() - Date.now() > 0 ||
                loading.name === data?.name ||
                userLevelInfo.level < data?.lvl_req
              }
              btnClick={async () =>
                userLevelInfo.level >= data?.lvl_req &&
                mineResource(data?.address, data?.name).then(() => {
                  dispatch(AuthActionsWithoutThunk.setRefreshInventory(true));
                })
              }
              loading={loading}
            />
          ))
      )}
    </div>
  );
};

export default MineTab;
