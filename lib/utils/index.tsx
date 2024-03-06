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
import { API_URL, LUT_ADDRESS } from "@/config/config";
import { craftSymbols, inventorySymbols } from "./constants";
import { Dataset, Resource } from "@/interfaces";
import axios from "axios";

import OresTab from "@/components/home/inventory/ores";
import BarTab from "@/components/home/inventory/bar";

let cache = {
  craftData: {},
  inventoryData: {},
};

const setCache = (name: string, data: any) => {
  cache[name] = data;
};

const getCache = (name: string) => {
  return cache[name] || [];
};
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

      case "Ores":
        return <OresTab />;
      case "Bar":
        return <BarTab />;
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

  const organizeDataByCategories = (
    resources: Dataset,
    symbols: Record<string, string[]>
  ): Record<string, Resource[]> => {
    const categorizedResources: Record<string, Resource[]> = {};

    Object.keys(symbols).forEach((categoryName) => {
      const categorySymbols = symbols[categoryName];

      const matchedResources = resources.result.filter((resource) =>
        categorySymbols.includes(resource.metadata.symbol)
      );

      categorizedResources[categoryName] = matchedResources;
    });

    return categorizedResources;
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
      toast.error(error.message || "Something went wrong");
      setLoading({ name: "", status: false });
    }
  };

  //fetchCraftData that takes name and refetch boolean
  const fetchCraftData = async (
    name: string,
    setDataLoading: (status: boolean) => void,
    refetch = false
  ) => {
    try {
      setDataLoading(true);

      let data = getCache("craftData");

      if (data?.result?.length > 0 && !refetch) {
        setDataLoading(false);
        return organizeDataByCategories(data, craftSymbols)?.[name];
      }

      data = (await axios.get(`${API_URL}resources/craft`)).data;
      setCache("craftData", data);
      setDataLoading(false);
      return organizeDataByCategories(data, craftSymbols)?.[name];
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
      setDataLoading(false);
    }
  };

  const fetchInventoryData = async (
    name: string,
    setDataLoading: (status: boolean) => void,
    refetch = false
  ) => {
    try {
      setDataLoading(true);

      let data = getCache("inventoryData");

      if (data?.result?.length > 0 && !refetch) {
        setDataLoading(false);
        if (name === "all") {
          return data?.result;
        }
        return organizeDataByCategories(data, inventorySymbols)?.[name];
      }

      data = (await axios.get(`${API_URL}resources/inventory/${publicKey}`))
        .data;
      setCache("inventoryData", data);
      setDataLoading(false);
      if (name === "all") {
        return data?.result;
      }
      return organizeDataByCategories(data, inventorySymbols)?.[name];
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
      setDataLoading(false);
    }
  };

  return {
    renderCraftTabComponents,
    renderHomeTabComponents,
    renderInventoryTabComponents,
    formatTime,
    getLevelsFromExp,
    createRecipe,
    fetchCraftData,
    fetchInventoryData,
  };
};

export default Utils;
