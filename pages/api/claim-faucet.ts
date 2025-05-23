import base58 from "bs58";
import { Redis } from "@upstash/redis";
import { NextApiRequest, NextApiResponse } from "next";
import { Keypair, VersionedTransaction } from "@solana/web3.js";

import { MineData } from "@/interfaces";
import { getEdgeClient } from "@/lib/edge-client";
import { CachedOres, CachedPickaxes, connection } from "@/config/config";

const redis = Redis.fromEnv();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { currentUser, resourceId, currentWallet } = req.body;
    if (!currentUser?.id || !currentWallet?.publicKey || !resourceId) {
      return res.status(400).json({
        error: "Invalid reqest, User or resource is missing.",
      });
    }
    const walletPublicKey = currentWallet?.publicKey || "";
    const edgeClient = getEdgeClient();

    const cachedResource = [...CachedOres, ...CachedPickaxes].find(
      (e) => e.address === resourceId
    );
    if (!cachedResource) {
      return res.status(400).json({ error: "Resource not found" });
    }

    const adminKeypairString = process.env.ADMIN_KEYPAIR;
    const adminKeypairArray = JSON.parse(adminKeypairString);
    const Admin_Keypair = Keypair.fromSecretKey(
      Uint8Array.from(adminKeypairArray)
    );

    const {
      createMintResourceTransaction: {
        transaction: txHash,
        blockhash,
        lastValidBlockHeight,
      },
    } = await edgeClient.createMintResourceTransaction({
      resource: resourceId,
      owner: walletPublicKey,
      authority: Admin_Keypair.publicKey.toBase58(),
      amount: String(1 * 10 ** 6),
    });

    // sign and send transaction
    const transaction = VersionedTransaction.deserialize(base58.decode(txHash));
    transaction.sign([Admin_Keypair]);

    // send transaction & confirm the transaction
    const signature = await edgeClient.sendBulkTransactions({
      txs: base58.encode(transaction.serialize()),
      blockhash,
      lastValidBlockHeight,
      options: {
        commitment: "processed",
        skipPreflight: true,
      },
    });

    if (!signature) {
      return res
        .status(500)
        .json({ error: "Minting reource: Error while sending transaction" });
    }

    // Wait for transaction confirmation
    await connection.confirmTransaction(
      signature?.sendBulkTransactions[0]?.signature,
      "finalized"
    );

    const secondsToIncrement =
      "mine_time" in cachedResource ? cachedResource.mine_time : 0; // convert seconds to milliseconds
    const currentTime = new Date();
    const incrementedTime = new Date(
      currentTime.getTime() + secondsToIncrement * 1000
    );

    const data: MineData = {
      user: currentUser?.id,
      wallet: walletPublicKey,
      resource: cachedResource.address,
      created_at: currentTime.getTime(),
      will_expire: incrementedTime.getTime(),
    };

    const expiryInSeconds = Math.floor(
      secondsToIncrement > 0
        ? (data.will_expire - currentTime.getTime()) / 1000
        : data.will_expire / 1000
    );
    await redis.set(
      `${walletPublicKey}-${cachedResource.address}`,
      JSON.stringify(data),
      { ex: expiryInSeconds }
    ); // Set key-value pair expiry in seconds
    return res.status(200).json({ result: data });
  } catch (error) {
    console.error("Error while claiming faucet:", error.message);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}
