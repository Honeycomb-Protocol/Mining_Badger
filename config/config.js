import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
const RPC_URL = process.env.NEXT_PUBLIC_RPC_ENDPOINT;
const HPL_PROJECT = new PublicKey(
  process.env.NEXT_PUBLIC_HPL_PROJECT || PublicKey.default
);
const API_URL = process.env.NEXT_PUBLIC_APIURL || "";
const LUT_ADDRESSES = process.env.NEXT_PUBLIC_LUTADDRESSES?.split(",") || [];
const EDGE_CLIENT = process.env.NEXT_PUBLIC_EDGE_CLIENT || "";
const PAYER_DRIVER = process.env.NEXT_PUBLIC_PAYER_DRIVER || "";
const LUT_ADDRESS = process.env.NEXT_PUBLIC_LUT_ADDRESS || "";
const RESOURCE_DRIVER = Keypair.fromSecretKey(
  new Uint8Array(
    JSON.parse(process.env.NEXT_PUBLIC_MAIN_RESOURCE_PAYER_DRIVER || "")
  )
);

const connection = new Connection(RPC_URL);

export {
  RPC_URL,
  HPL_PROJECT,
  connection,
  API_URL,
  LUT_ADDRESSES,
  PAYER_DRIVER,
  EDGE_CLIENT,
  RESOURCE_DRIVER,
  LUT_ADDRESS
};
