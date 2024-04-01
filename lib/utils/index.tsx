import AllTab from "@/components/home/inventory/all";
import BarTab from "@/components/home/inventory/bar";
import OresTab from "@/components/home/inventory/ores";
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
import { API_URL, LUT_ADDRESSES } from "@/config/config";
import { useHoneycomb } from "@/hooks";
import { Dataset, Resource } from "@/interfaces";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { toast } from "react-toastify";
import LevelsData from "../../data/level-data.json";
import { craftSymbols, inventorySymbols } from "./constants";

let cache = {
  craftData: {},
  inventoryData: {},
  refineData: {},
  mindeData: {},
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
    // eslint-disable-next-line no-unused-vars
    setLoading: (_) => void
  ) => {
    try {
      if (!edgeClient || !user || !authToken)
        throw new Error("Unable to find edgeClient or user or authToken");

      console.log(
        "fund this wallet if it doesn't work or you're doing it for the first time",
        user.wallets.shadow
      );
      setLoading({ name: name, status: true });

      console.log("createCraftRecipeTransaction", recipe);

      const { createCraftRecipeTransaction: txResponse } =
        await edgeClient.CreateCraftRecipeTransaction({
          recipe: recipe,
          wallet: publicKey.toString(),
          authority: user.wallets.shadow,
          lutAddresses: LUT_ADDRESSES,
        });

      // for (const tx of txResponse.transactions) {
      const {
        signWithShadowSignerAndSendBulkTransactions: sendBulkTransactions,
        // eslint-disable-next-line no-await-in-loop
      } = await edgeClient.signWithShadowSignerAndSendBulkTransactions(
        {
          txs: txResponse.transactions[2],
          blockhash: txResponse!.blockhash,
          lastValidBlockHeight: txResponse!.lastValidBlockHeight,
          options: {
            commitment: "confirmed",
            skipPreflight: true,
          },
        },
        {
          fetchOptions: {
            headers: {
              authorization: `Bearer ${authToken}`,
            },
          },
        }
      );
      console.log("hey");

      console.log("createMintResourceTransaction", sendBulkTransactions);
      sendBulkTransactions.forEach((txResponse) => {
        if (txResponse.status !== "Success") {
          console.log(
            "createMintResourceTransaction",
            txResponse.status,
            txResponse.error
          );
        }

        console.log("createMintResourceTransaction", txResponse.signature);
      });
      // }
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

  const fetchRefinedResoucesData = async (
    setDataLoading: (status: boolean) => void,
    refetch = false
  ) => {
    try {
      setDataLoading(true);

      let data = getCache("refineData");

      if (data?.result?.length > 0 && !refetch) {
        setDataLoading(false);
        return data?.result;
      }
      data = (await axios.get(`${API_URL}resources/refine`)).data;
      setCache("refineData", data);
      setDataLoading(false);
      return data?.result;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
      setDataLoading(false);
    }
  };

  const fetchMineResourcesData = async (
    setDataLoading: (status: boolean) => void,
    refetch = false
  ) => {
    try {
      setDataLoading(true);

      let data = getCache("mineData");

      if (data?.result?.length > 0 && !refetch) {
        setDataLoading(false);
        return data?.result;
      }
      data = (await axios.get(`${API_URL}resources/ores/${publicKey}`)).data;
      setCache("mineData", data);
      setDataLoading(false);
      return data?.result;
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
    fetchRefinedResoucesData,
    fetchMineResourcesData,
  };
};

export default Utils;
