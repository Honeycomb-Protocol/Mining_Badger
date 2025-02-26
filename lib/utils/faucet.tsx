import base58 from "bs58";
import axios from "axios";
import { VersionedTransaction } from "@solana/web3.js";
import { useHoneycombInfo } from "@honeycomb-protocol/profile-hooks";

import { MineData } from "@/interfaces";
import { Admin_Keypair, CachedOres, CachedPickaxes } from "@/config/config";

const Faucet = () => {
  const { currentUser, currentWallet, edgeClient } = useHoneycombInfo();

  const claimFaucet = async (resourceId: string) => {
    if (!edgeClient) {
      throw new Error("Invalid request, No client");
    }

    if (!currentUser || !resourceId || !currentWallet) {
      throw new Error("Invalid request, No user or resource");
    }

    const cachedResource = [...CachedOres, ...CachedPickaxes].find(
      (e) => e.address === resourceId
    );
    if (!cachedResource) {
      throw new Error("Invalid resource");
    }

    try {
      const {
        createMintResourceTransaction: {
          transaction: txHash,
          blockhash,
          lastValidBlockHeight,
        },
      } = await edgeClient.createMintResourceTransaction({
        resource: resourceId,
        owner: currentWallet?.publicKey.toString(),
        authority: Admin_Keypair.publicKey.toBase58(),
        amount: String(1 * 10 ** 6),
      });

      // sign and send transaction
      const transaction = VersionedTransaction.deserialize(
        base58.decode(txHash)
      );
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
        throw new Error("Error minting resource");
      }

      // save the resource to the cache
      const data = await axios.post<MineData>("/api/resource-entry", {
        user: {
          wallet: currentWallet.publicKey.toString(),
          id: currentUser?.id,
        },
        resource: cachedResource,
      });
      return data;
    } catch (error) {
      console.error("Error while faucet claim", error);
      throw new Error(
        error?.message ||
          error?.response?.data?.message ||
          error ||
          "Something went wrong"
      );
    }
  };

  return {
    claimFaucet,
  };
};

export default Faucet;
