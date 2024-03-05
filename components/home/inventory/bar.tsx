import { Spinner } from "@nextui-org/react";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";

import NftCard from "@/components/common/nft-card";
import { API_URL } from "@/config/config";
import Utils from "@/lib/utils";

const BarTab = () => {
  const { publicKey } = useWallet();
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { fetchInventoryData } = Utils();

  // const FetchInventory = useCallback(async () => {
  //   setLoading(true);
  //   await axios
  //     .get(`${API_URL}resources/inventory/${publicKey}`)
  //     .then((result) => {
  //       setInventoryData(result?.data?.result);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setLoading(false);
  //       toast.error(err.data?.message || "Something went wrong");
  //     });
  // }, [publicKey]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchInventoryData("bar", setLoading);
      setInventoryData(res);
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-8 p-3">
      {loading ? (
        <Spinner color="white" />
      ) : (
        inventoryData.map((item, index) => (
          <NftCard
            key={index}
            name={item.metadata.name}
            picture={item.metadata.uri}
            width={90}
            imageWidth={70}
            imageHeight={70}
            nftNameStyle="text-[13px]"
            btnStyle="bg-opacity-70 text-xs h-6"
            btnDisabled
            amount={item?.balance}
          />
        ))
      )}
    </div>
  );
};

export default BarTab;