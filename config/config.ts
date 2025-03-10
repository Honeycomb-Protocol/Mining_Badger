import axios from "axios";
import { Connection, PublicKey } from "@solana/web3.js";

import {
  PickAxes,
  Ores,
  File,
  Traits,
  Bars,
  Craft,
  MineData,
} from "@/interfaces";
import resources from "@/config/resource-addresses.json";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_ENDPOINT;
const HPL_PROJECT = new PublicKey(process.env.NEXT_PUBLIC_HPL_PROJECT);
const LUT_ADDRESSES = process.env.NEXT_PUBLIC_LUTADDRESSES.split(",");
const EDGE_CLIENT = process.env.NEXT_PUBLIC_EDGE_CLIENT;
const GATE_NETWORK = process.env.NEXT_PUBLIC_GATEKEEPER_NETWORK || "";
const connection = new Connection(RPC_URL);

const {
  assemblerConfig,
  characterModel,
  characterTree,
  lutAddresses,
  project,
  traits: cachedTraits,
  resources: cachedResources,
}: File = resources as unknown as File;

const CachedTraits: Traits[] = Object.entries(cachedTraits).map(
  ([_key, value]) => value
) as any;

const CachedPickaxes: PickAxes[] = Object.entries(cachedResources)
  .filter(([_key, value]) => "time_reduced" in value)
  .map(([_key, value]) => value) as any;

const CachedOres: Ores[] = Object.entries(cachedResources)
  .filter(([_key, value]) => "mine_time" in value)
  .map(([_key, value]) => value) as any;

const CachedBars: Bars[] = Object.entries(cachedResources)
  .filter(([_key, value]) => "refine_time" in value)
  .map(([_key, value]) => value) as any;

const CachedCraft: Craft[] = Object.entries(cachedResources)
  .filter(([_key, value]) => "craft_time" in value)
  .map(([_key, value]) => value) as any;

const CachedResources: Record<string, PickAxes | Ores | Bars | Craft> =
  Object.entries({ ...cachedResources, ...cachedTraits }).reduce(
    (acc, [_key, value]) => ({
      ...acc,
      [value.mint]: value,
    }),
    {}
  );

const getMinedResource = async (id: string): Promise<MineData | null> => {
  const res = (await axios.get(`/api/kv?key=${id}`)).data;
  if (!res?.value) return null;
  return res.value as MineData;
};

const TAGS = new Set<string>();
[...Object.values(cachedTraits), ...Object.values(CachedResources)].map((e) => {
  if (e.tags)
    e.tags.map((tag: string) => {
      if (["BARS", "ORES", "Pickaxe"].includes(tag)) return;

      TAGS.add(tag);
    });
});

export {
  RPC_URL,
  HPL_PROJECT,
  connection,
  LUT_ADDRESSES,
  EDGE_CLIENT,
  GATE_NETWORK,
  assemblerConfig,
  characterModel,
  characterTree,
  lutAddresses,
  project,
  cachedTraits,
  cachedResources,
  CachedTraits,
  CachedPickaxes,
  CachedOres,
  CachedBars,
  CachedCraft,
  CachedResources,
  getMinedResource,
  TAGS,
};
