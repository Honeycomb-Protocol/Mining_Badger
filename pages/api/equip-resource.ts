import base58 from "bs58";
import { NextApiRequest, NextApiResponse } from "next";
import { Keypair, VersionedTransaction } from "@solana/web3.js";

import { characterModel, characterTree, lutAddresses } from "@/config/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  try {
    const { edgeClient, wallet, resource } = req.body;

    if (!wallet || !edgeClient || !resource) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const {
      character: [character],
    } = await edgeClient.findCharacters({
      wallets: [wallet],
      trees: [characterTree],
    });

    if (!character) {
      console.error("Character not found", character);
      return res.status(404).json({ error: "Character not found" });
    }

    const { createEquipResourceOnCharacterTransaction: txResponse } =
      await edgeClient.createEquipResourceOnCharacterTransaction({
        resource,
        amount: String(1 * 10 ** 6),
        characterModel,
        owner: wallet,
        lutAddresses,
        characterAddress: character!.address,
      });

    if (!txResponse) {
      console.error("Error equipping resource", txResponse);
      return res.status(500).json({ error: "Error equipping resource" });
    }
    const adminKeypairString = process.env.ADMIN_KEYPAIR;
    const adminKeypairArray = JSON.parse(adminKeypairString);
    const Admin_Keypair = Keypair.fromSecretKey(
      Uint8Array.from(adminKeypairArray)
    );
    const transaction = VersionedTransaction.deserialize(
      base58.decode(txResponse.transaction)
    );
    transaction.sign([Admin_Keypair]);
    return res.status(200).json({
      result: {
        tx: base58.encode(transaction.serialize()),
        blockhash: txResponse.blockhash,
        lastValidBlockHeight: txResponse.lastValidBlockHeight,
      },
    });
  } catch (e) {
    console.error(e, "error");
    return res.status(500).json({ error: e.message || "Internal server error" });
  }
}
