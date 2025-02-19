import axios from "axios";
import base58 from "bs58";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { VersionedTransaction } from "@solana/web3.js";
import { useDispatch, useSelector } from "react-redux";
import { useHoneycombInfo } from "@honeycomb-protocol/profile-hooks";

import CraftTab from "@/components/home/tabs/craft";
import MineTab from "@/components/home/tabs/mine";
import RefineTab from "@/components/home/tabs/refine";
import ShopTab from "@/components/home/tabs/shop";
import BodyTab from "@/components/home/tabs/body";

import { RootState } from "@/store";
import LevelsData from "../../data/level-data.json";
import { Resource, ResourceType } from "@/interfaces";
import { API_URL, LUT_ADDRESSES, connection } from "@/config/config";
import { InventoryActionsWithoutThunk } from "@/store/inventory";

let cache = {
  craftTags: {},
  craftData: {},
  inventoryData: {},
  refineData: {},
  mineData: {},
  shopData: {},
  userInfo: null,
  mirroredXP: null,
};

const setCache = (name: string, data: any) => {
  cache[name] = data;
};

export const getCache = (name: string) => {
  return cache[name];
};

const resetCache = () => {
  cache = {
    craftTags: {},
    craftData: {},
    inventoryData: {},
    refineData: {},
    mineData: {},
    shopData: {},
    userInfo: null,
    mirroredXP: null,
  };
};

const Utils = () => {
  const dispatch = useDispatch();
  const { currentUser, currentProfile, currentWallet, edgeClient } =
    useHoneycombInfo();
  const inventoryState = useSelector((state: RootState) => state.inventory);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const info = cache?.userInfo?.result;
      if (info && info !== userInfo) {
        setUserInfo(info);
      }
    };
    fetchUserInfo();
    const interval = setInterval(() => {
      fetchUserInfo();
    }, 1000);
    return () => clearInterval(interval);
  }, [cache?.userInfo?.result, userInfo]);

  useEffect(() => {
    (async () => {
      let data = await getCache("userInfo");
      let mirroredXP = await getCache("mirroredXP");
      if (
        currentProfile?.platformData?.xp &&
        (!data?.result || data?.result?.length === 0 || !data)
      ) {
        await getUserLevelInfo(
          mirroredXP ? mirroredXP : Number(currentProfile?.platformData?.xp),
          false,
          () => {}
        );
      }
    })();
  }, [currentProfile?.platformData?.xp]);

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

      case "Body":
        return <BodyTab />;
    }
  };

  const organizeDataByCategories = (data: Resource[], name: ResourceType) => {
    const organizedData = data?.filter((item) => item.tags.includes(name));
    return organizedData;
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

  const getCraftTags = async (setLoading: (status: boolean) => void) => {
    try {
      setLoading(true);
      let data = await getCache("craftTags");
      if (data?.result?.length > 0) {
        setLoading(false);
        return data?.result;
      } else {
        data = (await axios.get(`${API_URL}resources/tags`)).data;
        setCache("craftTags", data);
        setLoading(false);
        return data?.result;
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
      setLoading(false);
    }
  };

  const fetchCraftData = async (
    tag: string,
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
        let signedTransactions; //@ts-ignore
        if (currentWallet?.address && currentWallet?.address !== "") {
          const userBalance = await connection.getBalance(
            currentWallet.publicKey
          );
          const TRANSACTION_COST = 2_331_600; // 2,331,600 lamports = ~0.00233 SOL
          const LOW_BALANCE_THRESHOLD = TRANSACTION_COST * 2; // Set threshold at twice the cost

          if (userBalance < LOW_BALANCE_THRESHOLD) {
            setDataLoading(false);
            throw new Error(
              "You don't have enough SOL in your wallet to perform this transaction."
            );
          }
          signedTransactions = await Promise.all(
            transactions.map((tx) => currentWallet?.signTransaction(tx))
          );
        } else {
          const userBalance = await connection.getBalance(
            currentWallet.publicKey
          );
          const TRANSACTION_COST = 2_331_600; // 2,331,600 lamports = ~0.00233 SOL
          const LOW_BALANCE_THRESHOLD = TRANSACTION_COST * 2; // Set threshold at twice the cost

          if (userBalance < LOW_BALANCE_THRESHOLD) {
            setDataLoading(false);
            throw new Error(
              "You don't have enough SOL in your wallet to perform this transaction."
            );
          }
          signedTransactions = await currentWallet.signAllTransactions(
            transactions
          );
        }
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
                  skipPreflight: false,
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

      if (data?.result && data?.result[tag]?.length > 0 && !refetch) {
        setDataLoading(false);
        return data?.result[tag];
      } else {
        const craftData = (await axios.get(`${API_URL}resources/craft/${tag}`))
          .data;
        data = {
          result: { ...data?.result, [tag]: craftData.result },
        };
        setCache("craftData", data);
        setDataLoading(false);
        return craftData?.result;
      }
    } catch (error) {
      setDataLoading(false);
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          error ||
          "Something went wrong"
      );
    }
  };

  const fetchInventoryData = async (
    name: ResourceType,
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
        if (name === ResourceType.ALL) {
          return data?.result;
        }
        return organizeDataByCategories(data?.result, name);
      } else {
        data = (
          await axios.get(
            `${API_URL}resources/inventory/${String(currentWallet?.publicKey)}`
          )
        ).data;
        setCache("inventoryData", data);
        setDataLoading(false);
        if (name === ResourceType.ALL) {
          return data?.result;
        }
        return organizeDataByCategories(data?.result, name);
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

      const sendTransactions = async (
        transactions,
        blockhash,
        lastValidBlockHeight
      ) => {
        const signedTransactions = await Promise.all(
          transactions.map((tx) => currentWallet?.signTransaction(tx))
        );

        const signatures = await Promise.all(
          signedTransactions?.map(async (transaction) => {
            try {
              const serializedTx = base58.encode(transaction.serialize());
              const signature = await edgeClient.sendBulkTransactions({
                txs: serializedTx,
                blockhash,
                lastValidBlockHeight,
                options: {
                  commitment: "processed",
                  skipPreflight: false,
                },
              });
              return signature;
            } catch (error) {
              console.error("Failed to send transaction:", error);
              return null;
            }
          })
        );
        return signatures.filter((sig) => sig !== null);
      };

      if (recipe) {
        const executeTransactionWithRetry = async (attempt = 3) => {
          if (attempt <= 0) return [];
          try {
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

            const userBalance = await connection.getBalance(
              currentWallet.publicKey
            );
            const TRANSACTION_COST = 2_331_600; // 2,331,600 lamports = ~0.00233 SOL
            const LOW_BALANCE_THRESHOLD = TRANSACTION_COST * 2; // Set threshold at twice the cost

            if (userBalance < LOW_BALANCE_THRESHOLD) {
              setDataLoading(false);
              throw new Error(
                "You don't have enough SOL in your wallet to perform this transaction."
              );
            }

            const successfulSignatures = await sendTransactions(
              transactions,
              blockhash,
              lastValidBlockHeight
            );

            if (successfulSignatures.length === 0) {
              console.warn(
                `Retrying transaction... Attempts left: ${attempt - 1}`
              );
              return executeTransactionWithRetry(attempt - 1);
            }

            return successfulSignatures;
          } catch (error) {
            console.error("Error during transaction:", error);
            return executeTransactionWithRetry(attempt - 1);
          }
        };

        await executeTransactionWithRetry(3);
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
      setDataLoading(false);
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          error ||
          "Something went wrong"
      );
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
            `${API_URL}resources/ores/${String(currentWallet?.publicKey)}`
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
          `${API_URL}resources/pickaxes/${String(currentWallet?.publicKey)}`
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
    tag: string,
    xp: number,
    setLoading: ({ name, status }) => void,
    setDataLoading: (status: boolean) => void,
    setCraftData: (data: Resource[]) => void
  ) => {
    try {
      setLoading({ name: name, status: true });
      const mirroredXP = getCache("mirroredXP");
      const data = await fetchCraftData(tag, setDataLoading, true, recipe);
      const calculatedXP = mirroredXP
        ? mirroredXP + xp
        : Number(currentProfile?.platformData?.xp) + xp;
      setCache("mirroredXP", calculatedXP);
      setCraftData(data);
      await fetchInventoryData(ResourceType.ALL, setDataLoading, true);
      dispatch(InventoryActionsWithoutThunk.setRefreshInventory(true));
      await getUserLevelInfo(calculatedXP, true, setDataLoading);
      // await apiCallDelay(2000);
      setLoading({ name: "", status: false });
      toast.success(`${name} Resource crafted successfully`);
    } catch (err: any) {
      setLoading({ name: "", status: false });
      toast.error(
        err.response?.data?.message || err.toString() || "Something went wrong"
      );
    }
  };

  return {
    renderHomeTabComponents,
    formatTime,
    getLevelsFromExp,
    fetchCraftData,
    fetchInventoryData,
    fetchRefinedResoucesData,
    fetchMineResourcesData,
    fetchShopResourcesData,
    getUserLevelInfo,
    userInfo,
    resetCache,
    apiCallDelay,
    claimFaucet,
    craftResource,
    getCraftTags,
  };
};

export default Utils;
