import axios from "axios";
import base58 from "bs58";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { VersionedTransaction } from "@solana/web3.js";
import { useDispatch, useSelector } from "react-redux";
import { useHoneycombInfo } from "@honeycomb-protocol/profile-hooks";

import CraftTab from "@/components/home/tabs/craft";
import BronzeTab from "@/components/home/tabs/craft/tabs/bronze";
import IronTab from "@/components/home/tabs/craft/tabs/iron";
import MithrilTab from "@/components/home/tabs/craft/tabs/mithril";
import RuniteTab from "@/components/home/tabs/craft/tabs/runite";
import MineTab from "@/components/home/tabs/mine";
import RefineTab from "@/components/home/tabs/refine";
import ShopTab from "@/components/home/tabs/shop";
import OresTab from "@/components/home/inventory/ores";
import AllTab from "@/components/home/inventory/all";
import BarTab from "@/components/home/inventory/bar";
import PickaxeTab from "@/components/home/inventory/pickaxe";

import { RootState } from "@/store";
import { Dataset, Resource } from "@/interfaces";
import LevelsData from "../../data/level-data.json";
import { API_URL, LUT_ADDRESSES } from "@/config/config";
import { craftSymbols, inventorySymbols } from "./constants";
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

export const getCache = (name: string) => {
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
  const { currentUser, currentProfile, currentWallet, edgeClient } =
    useHoneycombInfo();
  const inventoryState = useSelector((state: RootState) => state.inventory);

  useEffect(() => {
    (async () => {
      let data = await getCache("userInfo");
      if (
        currentProfile?.platformData.xp &&
        (data?.result?.length === 0 || !data)
      ) {
        await getUserLevelInfo(currentProfile.platformData.xp, false, () => {});
      }
    })();
  }, [currentProfile?.platformData.xp]);

  useEffect(() => {
    (async () => {
      let data = await getCache("inventoryData");
      if (
        data?.result?.length === 0 ||
        !data ||
        Object.keys(data)?.length === 0 ||
        inventoryState?.refreshInventory
      ) {
        await fetchInventoryData(
          "all",
          () => true,
          inventoryState?.refreshInventory
        );
        dispatch(InventoryActionsWithoutThunk.setRefreshInventory(false));
      }
    })();
  }, [inventoryState?.refreshInventory, currentWallet?.publicKey]);

  // TODO: Do it later.

  // const { authLoader } = useSelector(
  //   (state: RootState) => state.auth
  // );

  const renderCraftTabComponents = async (component: string) => {
    switch (component) {
      case "Bronze":
        return <BronzeTab />;
      case "Iron":
        return <IronTab />;
      case "Mithril":
        return <MithrilTab />;
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

  const getUserLevelInfo = async (
    xp: number,
    refetch: boolean = false,
    setDataLoading: (status: boolean) => void
  ) => {
    try {
      let data = await getCache("userInfo");

      if (
        data?.result?.length > 0 &&
        !inventoryState?.refreshInventory &&
        !refetch
      ) {
        setDataLoading(false);
        return data?.result;
      } else {
        data = (await axios.get(`${API_URL}resources/level/${xp}`)).data;
        setCache("userInfo", data);
        return data?.result;
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
      setDataLoading(false);
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

  const fetchCraftData = async (
    name: string,
    setDataLoading: (status: boolean) => void,
    refetch = false,
    recipe?: string
  ) => {
    try {
      setDataLoading(true);

      let data = await getCache("craftData");

      if (recipe) {
        const {
          createInitCookingProcessTransactions: {
            blockhash,
            lastValidBlockHeight,
            transactions: txHash,
          },
        } = await edgeClient.createInitCookingProcessTransactions({
          recipe: recipe,
          lutAddresses: LUT_ADDRESSES,
          authority: currentWallet?.publicKey.toString(),
        });

        const transactions = txHash.map((tx) =>
          VersionedTransaction.deserialize(base58.decode(tx))
        );

        const signedTransactions = await currentWallet.signAllTransactions(
          transactions
        );

        const signatures = await Promise.all(
          signedTransactions.map(async (transaction) => {
            try {
              const serializedTx = base58.encode(transaction.serialize());

              const signature = await edgeClient.sendBulkTransactions({
                txs: serializedTx,
                blockhash,
                lastValidBlockHeight,
                options: {
                  commitment: "processed",
                  skipPreflight: true,
                },
              });
              return signature;
            } catch (error) {
              console.error("Failed to send transaction:", error);
              return null;
            }
          })
        );
        const successfulSignatures = signatures.filter((sig) => sig !== null);

        if (!successfulSignatures.length) {
          console.error("Error minting resource");
          return;
        }
      }

      if (data?.result?.length > 0 && !refetch) {
        setDataLoading(false);
        return organizeDataByCategories(data, craftSymbols)?.[name];
      } else {
        data = (await axios.get(`${API_URL}resources/craft`)).data;
        setCache("craftData", data);
        setDataLoading(false);
        return organizeDataByCategories(data, craftSymbols)?.[name];
      }
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

      let data = await getCache("inventoryData");

      if (data?.result?.length > 0 && !refetch) {
        setDataLoading(false);
        if (name === "all") {
          return data?.result;
        }
        return organizeDataByCategories(data, inventorySymbols)?.[name];
      } else {
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
      }
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
    refetch = false,
    recipe?: string
  ) => {
    try {
      setDataLoading(true);

      let data = await getCache("refineData");

      if (recipe) {
        const {
          createInitCookingProcessTransactions: {
            blockhash,
            lastValidBlockHeight,
            transactions: txHash,
          },
        } = await edgeClient.createInitCookingProcessTransactions({
          recipe: recipe,
          lutAddresses: LUT_ADDRESSES,
          authority: currentWallet?.publicKey.toString(),
        });

        const transactions = txHash.map((tx) =>
          VersionedTransaction.deserialize(base58.decode(tx))
        );

        const signedTransactions = await currentWallet.signAllTransactions(
          transactions
        );

        const signatures = await Promise.all(
          signedTransactions.map(async (transaction) => {
            try {
              const serializedTx = base58.encode(transaction.serialize());

              const signature = await edgeClient.sendBulkTransactions({
                txs: serializedTx,
                blockhash,
                lastValidBlockHeight,
                options: {
                  commitment: "processed",
                  skipPreflight: true,
                },
              });
              return signature;
            } catch (error) {
              console.error("Failed to send transaction:", error);
              return null;
            }
          })
        );
        const successfulSignatures = signatures.filter((sig) => sig !== null);

        if (!successfulSignatures.length) {
          console.error("Error minting resource");
          return;
        }
      }

      if (data?.result?.length > 0 && !refetch) {
        setDataLoading(false);
        return data?.result;
      } else {
        data = (await axios.get(`${API_URL}resources/refine`)).data;
        setCache("refineData", data);
        setDataLoading(false);
        return data?.result;
      }
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

      let data = await getCache("mineData");

      if (data?.result?.length > 0 && !refetch) {
        setDataLoading(false);
        return data?.result;
      } else {
        data = (
          await axios.get(
            `${API_URL}resources/ores/${currentWallet?.publicKey}`
          )
        ).data;
        setCache("mineData", data);
        setDataLoading(false);
        return data?.result;
      }
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
      let data = await getCache("shopData");
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

  const craftResource = async (
    recipe: string,
    name: string,
    craftCategory: string,
    setLoading: ({ name, status }) => void,
    setDataLoading: (status: boolean) => void,
    setCraftData: (data: Resource[]) => void
  ) => {
    try {
      setLoading({ name: name, status: true });
      const data = await fetchCraftData(
        craftCategory,
        setDataLoading,
        true,
        recipe
      );
      setCraftData(data);
      dispatch(InventoryActionsWithoutThunk.setRefreshInventory(true));
      await apiCallDelay(2000);
      await getUserLevelInfo(
        currentProfile.platformData.xp,
        true,
        setDataLoading
      );
      await apiCallDelay(3000);
      setLoading({ name: "", status: false });
      toast.success(`${name} Resource crafted successfully`);
    } catch (err: any) {
      setLoading({ name: "", status: false });
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const userLevelInfo = getCache("userInfo")?.result;

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
    craftResource,
  };
};

export default Utils;
