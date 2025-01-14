//@ts-nocheck
import axios from "axios";
import base58 from "bs58";
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { VersionedTransaction } from "@solana/web3.js";
import { Character } from "@honeycomb-protocol/edge-client";
import { Select, SelectItem, Spinner } from "@nextui-org/react";
import { useHoneycombInfo } from "@honeycomb-protocol/profile-hooks";

import Utils from "@/lib/utils";
import { API_URL } from "@/config/config";
import { ResourceType } from "@/interfaces";
import NftCard from "@/components/common/nft-card";
import { InventoryActionsWithoutThunk } from "@/store/inventory";

const BodyTab = () => {
  const dispatch = useDispatch();
  const { fetchInventoryData, getCraftTags } = Utils();
  const { edgeClient, currentWallet } = useHoneycombInfo();
  const [loading, setLoading] = useState(false);
  const [equipmentLoading, setEquipmentLoading] = useState({
    name: "",
    status: false,
  });
  const [inventoryData, setInventoryData] = useState([]);
  const [currentTag, setCurrentTag] = useState("Fur");
  const [craftTags, setCraftTags] = useState([]);
  const [equippedItems, setEquippedItems] = useState({});
  const [enrichedBodyData, setEnrichedBodyData] = useState([]);
  const [InitialCharacter, setInitialCharacter] = useState<Character | null>(
    null
  );

  const fetchData = async (tags, refreshInventory = false) => {
    try {
      if (refreshInventory) {
        dispatch(InventoryActionsWithoutThunk.setRefreshInventory(true));
      }
      const res = await fetchInventoryData(
        ResourceType.ALL,
        refreshInventory ? () => true : setLoading,
        false,
        refreshInventory ? false : loading
      );
      const filteredData = await res?.filter((item) =>
        tags.includes(item?.tags[0])
      );
      setInventoryData(filteredData);
      await InitializeCharacter(filteredData);
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
        const tags = await getCraftTags(setLoading);
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
      const response = await axios.post(`${API_URL}resources/equip`, {
        wallet: currentWallet?.publicKey?.toString(),
        resource: item.address,
      });
      const transaction = VersionedTransaction.deserialize(
        base58.decode(response.data.result.tx)
      );
      const signedTransaction = await currentWallet.signTransaction(
        transaction
      );

      await edgeClient.sendBulkTransactions({
        txs: base58.encode(signedTransaction.serialize()),
        blockhash: response.data.result.blockhash,
        lastValidBlockHeight: response.data.result.lastValidBlockHeight,
        options: { commitment: "processed", skipPreflight: true },
      });
      await fetchData(craftTags, true);
      InitializeCharacter();
    } catch (error) {
      console.error("Error equipping item:", error);
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
        lutAddresses: [process.env.NEXT_PUBLIC_LUTADDRESSES!],
        amount: String(amount),
      });

      const transaction = VersionedTransaction.deserialize(base58.decode(tx));
      const signedTransaction = await currentWallet.signTransaction(
        transaction
      );

      await edgeClient.sendBulkTransactions({
        txs: base58.encode(signedTransaction.serialize()),
        blockhash,
        lastValidBlockHeight,
        options: { commitment: "processed", skipPreflight: true },
      });

      setEquippedItems((prev) => ({ ...prev, [item?.tags[0]]: null }));
      await fetchData(craftTags, true);
      setInventoryData((prev) => {
        const updatedInventory = [...prev];
        const existingItem = updatedInventory.find(
          (inventoryItem) => inventoryItem.address === item.address
        );
        if (existingItem) {
          existingItem.amount += amount;
        } else {
          updatedInventory.push({ ...item, amount });
        }
        return updatedInventory;
      });
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
        await axios.get(
          `${API_URL}resources/init/${currentWallet?.publicKey?.toString()}`
        )
      ).data?.result;

      if (character) {
        character.source.params.uri = character.source.params.uri.replace(
          /\/json|\.json|localhost/g,
          (match) =>
            ({
              "/json": "/images",
              ".json": ".png",
              localhost: "192.168.100.174",
            }[match])
        );
        setInitialCharacter(character);

        if (character.equipments.length > 0) {
          const updatedInventory = [
            ...currInventory,
            ...character.equipments,
          ].reduce((acc, current) => {
            if (!acc.find((item) => item.address === current.address)) {
              acc.push(current);
            }
            return acc;
          }, []);
          setInventoryData(updatedInventory);

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
            {InitialCharacter?.source?.params?.uri && (
              <img
                src={InitialCharacter.source.params.uri}
                alt="fur"
                className="absolute z-0"
              />
            )}
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
          <div className="flex justify-end w-full bg-black mt-5">
            <Select
              className="w-[150px] m-5 slelector"
              defaultSelectedKeys={["Fur"]}
            >
              {craftTags.map((tag) => (
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
          {enrichedBodyData.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-5 bg-black w-full">
              No data to show.
            </p>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-8 py-3 bg-black w-full p-4">
              {enrichedBodyData.map((item, index) => (
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
                      equipmentLoading.status)
                  }
                  loading={equipmentLoading}
                  buttonText={
                    equippedItems[item.tags[0]]?.address === item.address
                      ? "Unequip"
                      : "Equip"
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
