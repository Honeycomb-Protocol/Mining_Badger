import { Connection, PublicKey } from "@solana/web3.js";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_ENDPOINT;
const HPL_PROJECT = new PublicKey(
  process.env.NEXT_PUBLIC_HPL_PROJECT || PublicKey.default
);
const API_URL = process.env.NEXT_PUBLIC_APIURL || "";
const LUT_ADDRESS = process.env.NEXT_PUBLIC_LUTADDRESS || "";
const EDGE_CLIENT = process.env.NEXT_PUBLIC_EDGE_CLIENT || "";

const connection = new Connection(RPC_URL);

export { RPC_URL, HPL_PROJECT, connection, API_URL, LUT_ADDRESS, EDGE_CLIENT };
