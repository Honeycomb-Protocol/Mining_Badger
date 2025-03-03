import { Connection, Keypair, PublicKey } from "@solana/web3.js";

import { PickAxes, Ores, File } from "@/interfaces";
import resources from "@/config/resource-addresses.json";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_ENDPOINT;
const HPL_PROJECT = new PublicKey(process.env.NEXT_PUBLIC_HPL_PROJECT);
const LUT_ADDRESSES = process.env.NEXT_PUBLIC_LUTADDRESSES.split(",");
const EDGE_CLIENT = process.env.NEXT_PUBLIC_EDGE_CLIENT;
const GATE_NETWORK = process.env.NEXT_PUBLIC_GATEKEEPER_NETWORK || "";
const adminKeypairString = process.env.NEXT_PUBLIC_ADMIN_KEYPAIR;
const adminKeypairArray = JSON.parse(adminKeypairString);
const Admin_Keypair = Keypair.fromSecretKey(Uint8Array.from(adminKeypairArray));
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

const CachedPickaxes: PickAxes[] = Object.entries(cachedResources)
  .filter(([_key, value]) => "time_reduced" in value)
  .map(([_key, value]) => value) as any;

const CachedOres: Ores[] = Object.entries(cachedResources)
  .filter(([_key, value]) => "mine_time" in value)
  .map(([_key, value]) => value) as any;

export {
  RPC_URL,
  HPL_PROJECT,
  connection,
  LUT_ADDRESSES,
  EDGE_CLIENT,
  GATE_NETWORK,
  Admin_Keypair,
  assemblerConfig,
  characterModel,
  characterTree,
  lutAddresses,
  project,
  cachedTraits,
  cachedResources,
  CachedPickaxes,
  CachedOres,
};
