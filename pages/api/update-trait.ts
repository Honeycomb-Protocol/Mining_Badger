import { Keypair } from "@solana/web3.js";
import { NextApiRequest, NextApiResponse } from "next";

import {
  assemblerConfig,
  CachedTraits,
  cachedTraits,
  characterModel,
  characterTree,
  lutAddresses,
  project,
} from "@/config/config";
import { Traits } from "@/interfaces";
import { sendTransaction } from "@/lib/scripts";
import { getEdgeClient } from "@/lib/edge-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { wallet, resource, tag } = req.body;

    if (!wallet || !resource || !tag) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
    const edgeClient = getEdgeClient();

    const {
      character: [character],
    } = await edgeClient.findCharacters({
      trees: [characterTree],
      wallets: [wallet],
    });
    if (!character) {
      return res.status(404).json({ error: "Character not found" });
    }
    const { attributes } = character.source.params;

    if (!attributes[tag]) {
      return res.status(400).json({ error: "Invalid request, No tag" });
    }

    const traitsByAddress: Record<string, Traits> = Object.entries(
      cachedTraits
    ).reduce(
      (acc, [_key, value]) => ({
        ...acc,
        [value.address]: value,
      }),
      {}
    );
    const newTrait = traitsByAddress[resource];
    const currentTrait = CachedTraits.find((e) => e.name === attributes[tag]);

    if (!newTrait || !currentTrait) {
      return res.status(400).json({ error: "Invalid request, No trait" });
    }

    attributes[tag] = newTrait.name;

    const adminKeypairString = process.env.ADMIN_KEYPAIR;
    const adminKeypairArray = JSON.parse(adminKeypairString);
    const Admin_Keypair = Keypair.fromSecretKey(
      Uint8Array.from(adminKeypairArray)
    );

    // update the character trait
    const { createUpdateCharacterTraitsTransaction } =
      await edgeClient.createUpdateCharacterTraitsTransaction({
        project,
        characterModel,
        assemblerConfig,
        lutAddresses,
        characterAddress: character.address,
        payer: Admin_Keypair.publicKey.toString(),
        authority: Admin_Keypair.publicKey.toString(),
        attributes: Object.entries(attributes).map(([key, value]) => [
          key,
          value,
        ]),
      });

    const updateCharacterTraitsTransactionResponse = await sendTransaction(
      "updating character trait",
      createUpdateCharacterTraitsTransaction,
      Admin_Keypair
    );

    // check for errors
    for (const resp of updateCharacterTraitsTransactionResponse) {
      if (resp.error) {
        console.error("Error updating character trait", resp);
        return res
          .status(500)
          .json({ error: "Error updating character trait" });
      }
    }

    // burn the current trait
    const { createBurnResourceTransaction } =
      await edgeClient.createBurnResourceTransaction({
        resource: newTrait!.address,
        amount: String(1 * 10 ** 6),
        owner: wallet,
        lutAddresses,
        authority: Admin_Keypair.publicKey.toString(),
      });

    const burnTransactionResponse = await sendTransaction(
      "burning current trait",
      createBurnResourceTransaction,
      Admin_Keypair
    );

    // check for errors
    for (const resp of burnTransactionResponse) {
      if (resp.error) {
        console.error("Error burning current trait", resp);
        return res.status(500).json({ error: "Error burning current trait" });
      }
    }

    // mint the upcoming trait
    const { createMintResourceTransaction } =
      await edgeClient.createMintResourceTransaction({
        resource: currentTrait!.address,
        amount: String(1 * 10 ** 6),
        owner: wallet,
        lutAddresses,
        authority: Admin_Keypair.publicKey.toString(),
      });

    const mintTransactionResponse = await sendTransaction(
      "minting upcoming trait",
      createMintResourceTransaction,
      Admin_Keypair
    );

    return res.status(200).json({
      result: {
        burn: burnTransactionResponse,
        mint: mintTransactionResponse,
        update: updateCharacterTraitsTransactionResponse,
      },
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
}
