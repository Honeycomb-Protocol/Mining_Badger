import base58 from "bs58";
import { NextApiRequest, NextApiResponse } from "next";
import { Keypair, VersionedTransaction } from "@solana/web3.js";

import kv from "@/lib/kv";
import { MineData } from "@/interfaces";
import { getEdgeClient } from "@/lib/edge-client";
import { CachedOres, CachedPickaxes } from "@/config/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { currentUser, resourceId, currentWallet } = req.body;
    if (!currentUser || !currentWallet?.publicKey || !resourceId) {
      return res.status(400).json({
        error: "Invalid reqest, User or resource is missing.",
      });
    }
    const walletPublicKey = currentWallet.publicKey?.toBase58() || "";
    const edgeClient = getEdgeClient();

    const cachedResource = [...CachedOres, ...CachedPickaxes].find(
      (e) => e.address === resourceId
    );
    if (!cachedResource) {
      res.status(400).json({ error: "Resource not found" });
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
      res
        .status(500)
        .json({ error: "Minting reource: Error while sending transaction" });
    }

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

    console.log(
      "Data to save in cache:",
      walletPublicKey,
      data,
      JSON.stringify(data)
    );

    // save the data to the redis cache
    const expiryInSeconds = Math.floor(data.will_expire / 1000);
    await kv.set(
      `${walletPublicKey}-${cachedResource.address}`,
      JSON.stringify(data),
      {
        ex: expiryInSeconds,
      }
    ); // Set key-value pair expiry in seconds

    return res.status(200).json({ result: data });
  } catch (error) {
    console.error("Error while creating user:", error.message);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}
