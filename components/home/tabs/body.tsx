import { Select, SelectItem, Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

import Utils from "@/lib/utils";
import { ResourceType } from "@/interfaces";
import NftCard from "@/components/common/nft-card";
import { useHoneycombInfo } from "@honeycomb-protocol/profile-hooks";

const BodyTab = () => {
  const { fetchInventoryData, getCraftTags } = Utils();
  const { edgeClient, currentWallet } = useHoneycombInfo();
  const [loading, setLoading] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [currentTag, setCurrentTag] = useState("Fur");
  const [craftTags, setCraftTags] = useState([]);
  const [enrichedBodyData, setEnrichedBodyData] = useState([]);
  const [InitialCharacter, setInitialCharacter] = useState([]);
  const [isEquiped, setIsEquiped] = useState<string[]>(null);
  const [equippedItems, setEquippedItems] = useState({
    Clothes: null,
    Eyes: null,
    Fur: null,
    BackWeapons: null,
    Hats: null,
    Gauntlets: null,
    Weapons: null,
  });

  const fetchData = async (tags: string[]) => {
    let res = await fetchInventoryData(
      ResourceType.ALL,
      setLoading,
      false,
      loading
    );

    res = res?.filter((item) => {
      return tags?.includes(item?.tags[0]);
    });

    setInventoryData(res);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const tags = await getCraftTags(setLoading);
      setCraftTags(tags);
      await fetchData(tags);
    })();
  }, []);

  const enrichedData = async () => {
    return inventoryData?.filter((item) => item?.tags[0] === currentTag);
  };

  useEffect(() => {
    enrichedData().then(setEnrichedBodyData);
  }, [inventoryData, currentTag]);

  const equipItem = (part, item) => {
    const prevEquippedItem = isEquiped?.filter((y) =>
      enrichedBodyData?.find((e) => e.symbol === y)
    );
    if (prevEquippedItem?.length > 0) {
      setIsEquiped((prev) => {
        return [
          ...prev?.filter((e) => e !== prevEquippedItem[0]),
          item?.symbol,
        ];
      });
    } else {
      setIsEquiped((prev) => {
        if (prev) {
          return [...prev, item?.symbol];
        } else {
          return [item?.symbol];
        }
      });
    }
    setEquippedItems((prev) => ({ ...prev, [part]: item }));
  };

  const UnequipItem = (part, item) => {
    const filtered = isEquiped?.filter((e) => e !== item?.symbol);
    setIsEquiped(filtered);
    setEquippedItems((prev) => ({ ...prev, [part]: null }));
  };

  // const fetchCharacter = async () => {
  //   const character = await edgeClient
  //     ?.findCharacters({
  //       trees: "",
  //       wallets: [currentWallet?.publicKey.toString()],
  //     })
  //     .then((res) => res?.character);
  //   return character;
  // };
  // useEffect(() => {
  //   (async () => {
  //     const res = await fetchCharacter();
  //     setInitialCharacter(res);
  //   })();
  // }, []);

  // const InitializeCharacter = () => {
  //   setLoading(true);

  //   setLoading(false);
  // };

  return (
    <>
      {loading ? (
        <Spinner color="white" />
      ) : (
        // : InitialCharacter ? (
        //   <div className="flex flex-col items-center justify-center mt-10">
        //     <p>Character not found</p>
        //     <button className="w-52 m-4" onClick={InitializeCharacter()}>
        //       Start
        //     </button>
        //   </div>
        // )
        <div className="flex flex-col items-center justify-center">
          <div className="border-2 border-[#e7cb5f] rounded-lg w-[335px] h-[335px] bg-black my-5 relative">
            {Object.entries(equippedItems).map(([part, item], i) => {
              if (!item) return null;
              return (
                <img
                  key={part}
                  src={
                    item?.uri?.includes("assets") ? `/${item?.uri}` : item?.uri
                  }
                  alt={part}
                  className={`absolute ${part === "Fur" ? "z-0" : "z-10"}`}
                />
              );
            })}
          </div>
          <div className="flex justify-end w-full bg-black mt-5">
            <Select
              className="w-[150px] m-5 slelector"
              defaultSelectedKeys={["Fur"]}
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
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-8 py-3 bg-black w-full p-4">
              {enrichedBodyData?.map((item, index) => {
                const isItemEquiped =
                  isEquiped?.filter((e) => e === item?.symbol).length > 0
                    ? true
                    : false;
                return (
                  <NftCard
                    key={index}
                    name={item?.name}
                    picture={
                      item?.uri?.includes("assets")
                        ? `/${item?.uri}`
                        : item?.uri
                    }
                    width={90}
                    imageWidth={70}
                    imageHeight={70}
                    nftNameStyle="text-[13px]"
                    btnStyle="bg-opacity-70 text-xs h-6 !bg-[#8E8B77]"
                    btnDisabled={loading || item?.amount === 0}
                    // amount={item?.amount}
                    buttonText={isItemEquiped ? "Unequip" : "Equip"}
                    btnClick={() => {
                      if (isItemEquiped) {
                        UnequipItem(item?.tags[0], item);
                      } else {
                        equipItem(item?.tags[0], item);
                      }
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default BodyTab;
