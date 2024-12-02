import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useHoneycombInfo } from "@honeycomb-protocol/profile-hooks";

import CraftTab from "@/components/home/tabs/craft";
import BronzeTab from "@/components/home/tabs/craft/tabs/bronze";
import IronTab from "@/components/home/tabs/craft/tabs/iron";
import AdamantiteTab from "@/components/home/tabs/craft/tabs/adamantite";
import MithrilTab from "@/components/home/tabs/craft/tabs/mithril";
import RuniteTab from "@/components/home/tabs/craft/tabs/runite";
import SteelTab from "@/components/home/tabs/craft/tabs/steel";
import MineTab from "@/components/home/tabs/mine";
import RefineTab from "@/components/home/tabs/refine";
import ShopTab from "@/components/home/tabs/shop";
import OresTab from "@/components/home/inventory/ores";
import AllTab from "@/components/home/inventory/all";
import BarTab from "@/components/home/inventory/bar";
import PickaxeTab from "@/components/home/inventory/pickaxe";

import { Dataset, Resource } from "@/interfaces";
import LevelsData from "../../data/level-data.json";
import { API_URL } from "@/config/config";
import { craftSymbols, inventorySymbols } from "./constants";
import { RootState } from "@/store";
import { InventoryActionsWithoutThunk } from "@/store/inventory";

let cache = {
  craftData: {},
  inventoryData: {},
  refineData: {},
  mineData: {},
  shopData: {},
  userInfo: null,
};

const setCache = (name: string, data: any) => {
  cache[name] = data;
};

const getCache = (name: string) => {
  return cache[name];
};

const resetCache = () => {
  cache = {
    craftData: {},
    inventoryData: {},
    refineData: {},
    mineData: {},
    shopData: {},
    userInfo: null,
  };
};

const Utils = () => {
  const dispatch = useDispatch();

  const { currentUser, currentProfile, currentWallet } = useHoneycombInfo();

  // TODO: Do it later.

  // const { authLoader } = useSelector(
  //   (state: RootState) => state.auth
  // );
  const inventoryState = useSelector((state: RootState) => state.inventory);

  const [userLevelInfo, setUserLevelInfo] = useState<{
    level?: number;
    exp_req?: number;
    current_exp?: number;
  }>({});

  //To call the api in every 5 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      if (currentProfile?.platformData?.xp !== undefined) {
        dispatch(InventoryActionsWithoutThunk.setRefreshInventory(true));
      }
    }, 5 * 60 * 1000);

    return () => {
      console.log("Component unmounting, clearing interval");
      clearInterval(interval);
    };
  }, []);

  //To call the api only when the component mounts or refreshInventory/authLoader state changes
  useEffect(() => {
    if (
      (currentProfile?.platformData?.xp !== undefined &&
        inventoryState?.refreshInventory === true) ||
      (currentProfile?.platformData?.xp !== undefined &&
        // authLoader === false &&
        inventoryState?.refreshInventory === false)
    ) {
      getUserLevelInfo(currentProfile?.platformData?.xp);
      dispatch(InventoryActionsWithoutThunk.setRefreshInventory(false));
    }
    // }, [refreshInventory, authLoader]);
  }, [inventoryState?.refreshInventory]);

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
      case "Pickaxes":
        return <PickaxeTab />;
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

  const getUserLevelInfo = async (xp: number, refetch: boolean = false) => {
    try {
      let data = getCache("userInfo");

      if (data !== null && !inventoryState?.refreshInventory && !refetch) {
        setUserLevelInfo(data?.result);
        return data?.result;
      }
      data = (await axios.get(`${API_URL}resources/level/${xp}`)).data;
      setCache("userInfo", data);
      setUserLevelInfo(data?.result);
      return data?.result;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
      return null;
    }
  };

  const organizeDataByCategories = (
    resources: Dataset,
    symbols: Record<string, string[]>
  ): Record<string, Resource[]> => {
    const categorizedResources: Record<string, Resource[]> = {};

    Object.keys(symbols).forEach((categoryName) => {
      const categorySymbols = symbols[categoryName];

      const matchedResources = resources.result.filter((resource) =>
        categorySymbols.includes(resource?.symbol)
      );

      categorizedResources[categoryName] = matchedResources;
    });

    return categorizedResources;
  };

  // const getSymbol = (name) => {
  //   // console.log(cache.craftData);

  //   console.log("data.metadata.name", cache?.craftData);
  //   if (cache?.craftData?.result?.length > 0) {
  //     cache?.craftData?.result?.filter((data: any) => {
  //       if (data.metadata.name === name) {
  //         console.log("data.metadata.symbol", data.metadata.symbol);
  //         return data.metadata.symbol;
  //       }
  //     });
  //   }
  // };

  //fetchCraftData that takes name and refetch boolean
  const fetchCraftData = async (
    name: string,
    setDataLoading: (status: boolean) => void,
    refetch = false
  ) => {
    try {
      setDataLoading(true);

      let data = getCache("craftData");

      // await getSymbol("Katana");

      if (data?.result?.length > 0 && !refetch) {
        setDataLoading(false);
        // return data?.result;
        return organizeDataByCategories(data, craftSymbols)?.[name];
      }

      data = (await axios.get(`${API_URL}resources/craft`)).data;
      setCache("craftData", data);
      setDataLoading(false);
      // return data?.result;
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
    refetch = false,
    isLoaded: boolean = false
  ) => {
    if (
      !currentWallet?.publicKey ||
      currentWallet?.publicKey.toString().length !== 44
    )
      return;
    try {
      if (!isLoaded) {
        setDataLoading(true);
      }

      let data = getCache("inventoryData");

      if (data?.result?.length > 0 && !refetch) {
        setDataLoading(false);
        if (name === "all") {
          return data?.result;
        }
        return organizeDataByCategories(data, inventorySymbols)?.[name];
      }

      data = (
        await axios.get(
          `${API_URL}resources/inventory/${currentWallet?.publicKey}`
        )
      ).data;
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
      data = (
        await axios.get(`${API_URL}resources/ores/${currentWallet?.publicKey}`)
      ).data;
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

  const fetchShopResourcesData = async (
    setDataLoading: (status: boolean) => void,
    refetch = false
  ) => {
    try {
      setDataLoading(true);
      let data = getCache("shopData");
      if (data?.result?.length > 0 && !refetch) {
        setDataLoading(false);
        return data?.result;
      }
      data = (
        await axios.get(
          `${API_URL}resources/pickaxes/${currentWallet?.publicKey}`
        )
      ).data;
      setCache("shopData", data);
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

  const apiCallDelay = async (delay: number = 5000) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, delay);
    });
  };

  const claimFaucet = async (resourceId: string) => {
    try {
      const { data } = await axios.post(`${API_URL}faucet/mine`, {
        user: {
          wallet: currentWallet?.publicKey.toString(),
          id: currentUser?.id,
        },
        resource: resourceId,
      });

      return data;
    } catch (error) {
      console.error("Error while faucet claim", error);
      toast.error(
        error?.message ||
          error?.response?.data?.message ||
          error ||
          "Something went wrong"
      );
      throw new Error(error);
    }
  };

  return {
    renderCraftTabComponents,
    renderHomeTabComponents,
    renderInventoryTabComponents,
    formatTime,
    getLevelsFromExp,
    fetchCraftData,
    fetchInventoryData,
    fetchRefinedResoucesData,
    fetchMineResourcesData,
    fetchShopResourcesData,
    getUserLevelInfo,
    userLevelInfo,
    resetCache,
    apiCallDelay,
    claimFaucet,
  };
};

export default Utils;
