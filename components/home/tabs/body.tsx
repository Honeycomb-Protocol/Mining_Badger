//@ts-nocheck
import axios from "axios";
import base58 from "bs58";
import Image from "next/image";
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { VersionedTransaction } from "@solana/web3.js";
import { Character } from "@honeycomb-protocol/edge-client";
import { Select, SelectItem, Spinner, Tooltip } from "@nextui-org/react";
import { useHoneycombInfo } from "@honeycomb-protocol/profile-hooks";

import Utils from "@/lib/utils";
import { connection, LUT_ADDRESSES } from "@/config/config";
import { ResourceType } from "@/interfaces";
import NftCard from "@/components/common/nft-card";
import { InventoryActionsWithoutThunk } from "@/store/inventory";

const BodyTab = () => {
  const dispatch = useDispatch();
  const { fetchInventoryData } = Utils();
  const { edgeClient, currentWallet } = useHoneycombInfo();
  const [loading, setLoading] = useState(false);
  const [equipmentLoading, setEquipmentLoading] = useState({
    name: "",
    status: false,
  });
  const [inventoryData, setInventoryData] = useState([]);
  const [currentTag, setCurrentTag] = useState("Fur");
  const [craftTags, setCraftTags] = useState([]);
  const [uri, setUri] = useState(null);
  const [equippedItems, setEquippedItems] = useState({});
  const [enrichedBodyData, setEnrichedBodyData] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [InitialCharacter, setInitialCharacter] = useState<Character | null>(
    null
  );

  useEffect(() => {
    if (!currentWallet?.publicKey || !InitialCharacter) return;
    setEquipments([
      ...InitialCharacter?.equipments,
      ...Object.values(InitialCharacter?.source?.params?.attributes),
    ]);
  }, [InitialCharacter]);

  const fetchData = async (tags, refreshInventory = false) => {
    try {
      if (refreshInventory) {
        dispatch(InventoryActionsWithoutThunk.setRefreshInventory(true));
      }
      const res = await fetchInventoryData(
        ResourceType.ALL,
        refreshInventory ? () => true : setLoading,
        refreshInventory ? true : false,
        refreshInventory ? false : loading
      );
      const filteredData = await res?.filter((item) =>
        tags.includes(item?.tags[0])
      );
      setInventoryData(filteredData);
      await InitializeCharacter(filteredData);
      return filteredData;
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentWallet?.publicKey) return;
    (async () => {
      try {
        setLoading(true);
        const tags = await Array.from(TAGS);
        setCraftTags(tags);
        await fetchData(tags);
      } catch (error) {
        console.error("Error initializing craft tags:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentWallet?.publicKey]);

  useEffect(() => {
    if (!currentWallet?.publicKey) return;
    InitializeCharacter();
  }, [currentWallet?.publicKey]);

  useEffect(() => {
    setEnrichedBodyData(
      inventoryData?.filter((item) => item?.tags[0] === currentTag)
    );
  }, [inventoryData, currentTag]);

  const equipItem = async (item) => {
    try {
      setEquipmentLoading({ name: item?.name, status: true });
      if (
        item.tags[0] === "Fur" ||
        item.tags[0] === "Eyes" ||
        item.tags[0] === "Mouth"
      ) {
        await axios.post(`/api/update-trait`, {
          edgeClient,
          wallet: currentWallet?.publicKey?.toString(),
          resource: item.address,
          tag: item.tags[0],
        });
      } else {
        const response = (
          await axios.post(`/api/equip-resource`, {
            edgeClient,
            wallet: currentWallet?.publicKey?.toString(),
            resource: item.address,
          })
        ).data;
        const transaction = VersionedTransaction.deserialize(
          base58.decode(response.result.tx)
        );
        const userBalance = await connection?.getBalance(
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
        const signedTransaction = await currentWallet.signTransaction(
          transaction
        );

        await edgeClient.sendBulkTransactions({
          txs: base58.encode(signedTransaction.serialize()),
          blockhash: response.result.blockhash,
          lastValidBlockHeight: response.result.lastValidBlockHeight,
          options: { commitment: "processed", skipPreflight: false },
        });
      }
      const data = await fetchData(craftTags, true);
      await InitializeCharacter(data);
    } catch (error) {
      console.error("Error equipping item:", error);
      toast.error(
        error?.response?.data?.error || error?.message || "Error equipping item"
      );
    } finally {
      setEquipmentLoading({ name: "", status: false });
    }
  };

  const UnequipItem = async (item) => {
    try {
      setEquipmentLoading({ name: item?.name, status: true });
      const amount = equippedItems[item?.tags[0]]?.amount;
      const {
        createDismountResourceOnCharacterTransaction: {
          blockhash,
          lastValidBlockHeight,
          transaction: tx,
        },
      } = await edgeClient.createDismountResourceOnCharacterTransaction({
        characterModel: process.env.NEXT_PUBLIC_HPL_CHARACTER_MODEL!,
        characterAddress: InitialCharacter?.address,
        resource: item?.address,
        owner: currentWallet.publicKey.toString(),
        lutAddresses: LUT_ADDRESSES,
        amount: String(amount),
      });
      const transaction = VersionedTransaction.deserialize(base58.decode(tx));
      const userBalance = await connection?.getBalance(currentWallet.publicKey);
      const TRANSACTION_COST = 2_331_600; // 2,331,600 lamports = ~0.00233 SOL
      const LOW_BALANCE_THRESHOLD = TRANSACTION_COST * 2; // Set threshold at twice the cost
      if (userBalance < LOW_BALANCE_THRESHOLD) {
        setDataLoading(false);
        throw new Error(
          "You don't have enough SOL in your wallet to perform this transaction."
        );
      }
      const signedTransaction = await currentWallet.signTransaction(
        transaction
      );

      await edgeClient.sendBulkTransactions({
        txs: base58.encode(signedTransaction.serialize()),
        blockhash,
        lastValidBlockHeight,
        options: { commitment: "processed", skipPreflight: false },
      });

      setEquippedItems((prev) => ({ ...prev, [item?.tags[0]]: null }));
      const data = await fetchData(craftTags, true);
      await InitializeCharacter(data);
    } catch (error) {
      console.error("Error unequipping item:", error);
    } finally {
      setEquipmentLoading({ name: "", status: false });
    }
  };

  const InitializeCharacter = async (inventory?: any) => {
    try {
      setLoading(true);
      if (!currentWallet?.publicKey) return;
      const currInventory = inventory || inventoryData;
      const character = (
        await axios.post(
          `/api/init-resource?wallet=${currentWallet?.publicKey?.toString()}`,
          {
            edgeClient,
          }
        )
      ).data?.result;

      if (character) {
        character.source.params.uri = character.source.params.uri.replace(
          /\/json|\.json|localhost/g,
          (match) =>
            ({
              "/json": "/images",
              ".json": ".png",
              localhost: process.env.NEXT_PUBLIC_APIURL?.includes("eboy")
                ? process.env.NEXT_PUBLIC_APIURL.split("//")[1].split("/")[0]
                : process.env.NEXT_PUBLIC_APIURL?.split("//")[1].split(":")[0],
            }[match])
        );
        setUri(`${character.source.params.uri}?t=${Date.now()}`);
        setInitialCharacter(character);

        const updatedInventory = [
          ...currInventory,
          ...(character?.equipments || []),
        ].reduce((acc, current) => {
          if (!acc.find((item) => item.address === current.address)) {
            acc.push(current);
          }
          return acc;
        }, []);
        setInventoryData(updatedInventory);

        if (character.equipments.length > 0) {
          const equipped = character.equipments.reduce((acc, item) => {
            const inventoryItem = updatedInventory.find(
              (invItem) => invItem.address === item.address
            );
            if (inventoryItem) {
              acc[inventoryItem.tags[0]] = {
                ...inventoryItem,
                amount: item.amount,
              };
            }
            return acc;
          }, {});
          setEquippedItems(equipped);
        }
      }
    } catch (error) {
      console.error("Error initializing character:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner color="white" />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="border-2 border-[#e7cb5f] rounded-lg w-[335px] h-[335px] bg-black my-5 relative">
            {uri && <img src={uri} alt="Character" className="absolute z-0" />}
            {Object.entries(equippedItems).map(([part, item]) =>
              item ? (
                <img
                  key={part}
                  src={item.uri.includes("assets") ? `/${item.uri}` : item.uri}
                  alt={part}
                  className={`absolute ${part === "Fur" ? "z-0" : "z-10"}`}
                />
              ) : null
            )}
          </div>
          <div className="flex flex-wrap justify-center items-start">
            {equipments?.map((item, index) => (
              <div
                key={index}
                className="my-3 mx-2 text-center w-[75px] relative"
              >
                {item.tags[0] !== "Fur" &&
                item.tags[0] !== "Eyes" &&
                item.tags[0] !== "Mouth" ? (
                  <Image
                    src="/assets/images/minus-icon.png"
                    alt="minus"
                    width={17}
                    height={17}
                    className={`absolute -top-1.5 -right-1.5 z-50 ${
                      equipmentLoading.name === item.name &&
                      equipmentLoading.status
                        ? `pointer-events-none`
                        : "cursor-pointer"
                    }`}
                    onClick={async () => {
                      if (
                        equipments.some(
                          (equip) =>
                            String(equip.address) === String(item.address)
                        )
                      ) {
                        await UnequipItem(item);
                      }
                    }}
                  />
                ) : (
                  <Tooltip
                    content={
                      "Fur, Mouth, and Eyes can't be unequipped—swap them instead."
                    }
                    className="bg-[#1D1D1D]"
                  >
                    <Image
                      src="/assets/svgs/info-icon.svg"
                      alt="info"
                      className="absolute -top-1.5 -right-1.5 z-50 cursor-pointer bg-black"
                      width={17}
                      height={17}
                    />
                  </Tooltip>
                )}
                <div className="border-1 border-[#e7cb5f] rounded-lg h-[69px] bg-gray-900 relative">
                  {item && (
                    <Image
                      src={
                        item.uri.includes("assets") ? `/${item.uri}` : item.uri
                      }
                      alt={item.tags[0]}
                      fill={true}
                    />
                  )}
                  {equipmentLoading.name === item.name &&
                    equipmentLoading.status && (
                      <div className=" w-full h-full flex justify-center items-center realtive">
                        <div className="bg-slate-300 opacity-20 w-full h-full absolute top-0 right-0 left-0 bottom-0" />
                        <Spinner color="white" />
                      </div>
                    )}
                </div>
                <p className="text-xs mt-1">{item.name}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end w-full bg-black mt-5">
            <Select
              className="w-[150px] m-5 slelector"
              defaultSelectedKeys={[currentTag]}
            >
              {craftTags?.map((tag) => (
                <SelectItem
                  key={tag}
                  style={{ color: "black" }}
                  onClick={() => setCurrentTag(tag)}
                >
                  {tag}
                </SelectItem>
              ))}
            </Select>
          </div>
          {enrichedBodyData?.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-5 bg-black w-full">
              No data to show.
            </p>
          ) : (
            <div className="flex justify-start items-center gap-12 py-3 bg-black w-full p-4 md:p-8">
              {enrichedBodyData?.map((item, index) => (
                <NftCard
                  key={index}
                  name={item.name}
                  picture={
                    item.uri.includes("assets") ? `/${item.uri}` : item.uri
                  }
                  width={90}
                  imageWidth={70}
                  imageHeight={70}
                  nftNameStyle="text-[13px]"
                  btnStyle="bg-opacity-70 text-xs h-6 !bg-[#8E8B77]"
                  btnDisabled={
                    loading ||
                    item.amount === 0 ||
                    (equipmentLoading.name === item.name &&
                      equipmentLoading.status) ||
                    (equippedItems[item.tags[0]]?.address &&
                      equippedItems[item.tags[0]]?.address !== item.address)
                  }
                  loading={equipmentLoading}
                  buttonText={
                    equippedItems[item.tags[0]]?.address === item.address
                      ? "Unequip"
                      : "Equip"
                  }
                  btnInfo={
                    equippedItems[item.tags[0]]?.address &&
                    equippedItems[item.tags[0]]?.address !== item.address
                      ? "Unequip the current item to equip this one"
                      : ""
                  }
                  btnClick={async () => {
                    if (equippedItems[item.tags[0]]?.address === item.address) {
                      await UnequipItem(item);
                    } else {
                      await equipItem(item);
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default BodyTab;
