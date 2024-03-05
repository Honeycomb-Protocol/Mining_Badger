import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";

import AllTab from "@/components/home/inventory/all";
import CraftTab from "@/components/home/tabs/craft";
import AdamantiteTab from "@/components/home/tabs/craft/tabs/adamantite";
import BronzeTab from "@/components/home/tabs/craft/tabs/bronze";
import IronTab from "@/components/home/tabs/craft/tabs/iron";
import MithrilTab from "@/components/home/tabs/craft/tabs/mithril";
import RuniteTab from "@/components/home/tabs/craft/tabs/runite";
import SteelTab from "@/components/home/tabs/craft/tabs/steel";
import MineTab from "@/components/home/tabs/mine";
import RefineTab from "@/components/home/tabs/refine";
import ShopTab from "@/components/home/tabs/shop";
import LevelsData from "../../data/level-data.json";
import { useHoneycomb } from "@/hooks";
import { LUT_ADDRESS } from "@/config/config";

const Utils = () => {
  const { publicKey } = useWallet();
  const { edgeClient, user, authToken } = useHoneycomb();

  const renderCraftTabComponents = async (component: string) => {
    switch (component) {
      case "Bronze":
        return <BronzeTab />;
      case "Iron":
        return <IronTab />;
      case "Steel":
        return <SteelTab />;
      case "Mithril":
        return <MithrilTab />;
      case "Adamantite":
        return <AdamantiteTab />;
      case "Runite":
        return <RuniteTab />;
    }
  };

  const renderHomeTabComponents = async (component: string) => {
    switch (component) {
      case "Shop":
        return <ShopTab />;

      case "Craft":
        return <CraftTab />;

      case "Mine":
        return <MineTab />;

      case "Refine":
        return <RefineTab />;
    }
  };

  const renderInventoryTabComponents = async (component: string) => {
    switch (component) {
      case "All":
        return <AllTab />;
    }
  };

  const formatTime = (timeLeft: number) => {
    // Convert milliseconds to seconds
    const seconds = Math.floor(timeLeft / 1000);
    // Calculate the number of days
    // const days = Math.floor(seconds / 86400);
    // Calculate the number of hours
    const hours = Math.floor((seconds % 86400) / 3600);
    // Calculate the remaining minutes
    const minutes = Math.floor((seconds % 3600) / 60);

    // Format the string to have two digits for hours and minutes
    return `${hours.toString().padStart(2, "0")} : ${minutes
      .toString()
      .padStart(2, "0")} : ${Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0")}`;
  };

  const getLevelsFromExp = (exp: number) => {
    for (let i = 0; i < LevelsData.length; i++) {
      if (exp < LevelsData[i].minExp) {
        return i === 0 ? 1 : LevelsData[i - 1].level;
      }
    }
    return LevelsData[LevelsData.length - 1].level;
  };

  const createRecipe = async (
    recipe: string,
    name: string,
    setLoading: ({ name, status }) => void
  ) => {
    try {
      setLoading({ name: name, status: true });

      const { createCraftRecipeTransaction: txResponse } =
        await edgeClient.CreateCraftRecipeTransaction({
          recipe: recipe,
          wallet: publicKey.toString(),
          authority: user.shadow.toString(),
          lutAddress: LUT_ADDRESS,
        });

      const {
        signWithShadowSignerAndSendBulkTransactions: sendBulkTransactions,
      } = await edgeClient.signWithShadowSignerAndSendBulkTransactions(
        {
          txs: [txResponse.transaction],
          blockhash: txResponse!.blockhash,
          lastValidBlockHeight: txResponse!.lastValidBlockHeight,
        },
        {
          fetchOptions: {
            headers: {
              authorization: `Bearer ${authToken}`,
            },
          },
        }
      );
      await sendBulkTransactions.forEach((txResponse) => {
        if (txResponse.status !== "Success") {
          // console.log(
          //   "createMintResourceTransaction",
          //   txResponse.status,
          //   txResponse.error
          // );
        }
      });
      toast.success("Resource crafted successfully");
      setLoading({ name: "", status: false });
    } catch (error) {
      console.log("error", error);
      toast.error(error.message || "Something went wrong");
      setLoading({ name: "", status: false });
    }
  };

  return {
    renderCraftTabComponents,
    renderHomeTabComponents,
    renderInventoryTabComponents,
    formatTime,
    getLevelsFromExp,
    createRecipe,
  };
};

export default Utils;
