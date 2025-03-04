import base58 from "bs58";
import { NextApiRequest, NextApiResponse } from "next";
import { Keypair, VersionedTransaction } from "@solana/web3.js";

import {
  assemblerConfig,
  cachedResources,
  CachedTraits,
  cachedTraits,
  characterModel,
  characterTree,
  project,
} from "@/config/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { wallet } = req.query;
    const { edgeClient } = req.body;

    if (!wallet || !edgeClient) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    let {
      character: [character],
    } = await edgeClient.findCharacters({
      wallets: [wallet],
      trees: [characterTree],
    });

    if (!character) {
      const adminKeypairString = process.env.ADMIN_KEYPAIR;
      const adminKeypairArray = JSON.parse(adminKeypairString);
      const Admin_Keypair = Keypair.fromSecretKey(
        Uint8Array.from(adminKeypairArray)
      );
      const {
        createAssembleCharacterTransaction: {
          transaction: createAssembleCharacterTransactionHash,
          blockhash,
          lastValidBlockHeight,
        },
      } = await edgeClient.createAssembleCharacterTransaction({
        project,
        owner: wallet,
        characterModel,
        assemblerConfig,
        payer: Admin_Keypair.publicKey.toString(),
        authority: Admin_Keypair.publicKey.toString(),
        attributes: [
          ["Fur", "Black"],
          ["Eyes", "Blue Eyes"],
          ["Mouth", "Contented"],
        ],
      });

      // sign and send transaction
      const createAssembleCharacterTransaction =
        VersionedTransaction.deserialize(
          base58.decode(createAssembleCharacterTransactionHash)
        );
      createAssembleCharacterTransaction.sign([Admin_Keypair]);

      // send transaction & confirm the transaction
      const signature = await edgeClient.sendBulkTransactions({
        txs: base58.encode(createAssembleCharacterTransaction.serialize()),
        blockhash,
        lastValidBlockHeight,
        options: {
          commitment: "processed",
          skipPreflight: true,
        },
      });

      if (signature.sendBulkTransactions[0].error) {
        console.error("Error minting resource", signature);
        return res.status(500).json({ error: "Error minting resource" });
      }

      const {
        character: [characterRefetch],
      } = await edgeClient.findCharacters({
        wallets: [wallet],
        trees: [characterTree],
      });

      if (!characterRefetch) {
        console.error("Error fetching character", characterRefetch);
        return res.status(500).json({ error: "Error fetching character" });
      }

      character = characterRefetch;
    }

    const TraitByName = (name: string) => {
      return CachedTraits.find((e) => e.name === name);
    };

    const currAttributes = character.source.params.attributes;
    if (!currAttributes) {
      return res.status(400).json({ error: "Character attributes not found" });
    }
    character.source.params.attributes = Object.entries(currAttributes)?.reduce(
      (acc, [key, value]) => {
        acc[key] = TraitByName(value as string);
        return acc;
      },
      {} as Record<string, ReturnType<typeof TraitByName>>
    );

    character.equipments = Object.entries(character.equipments)
      .map(([key, value]) => {
        const resource = Object.values({
          ...cachedResources,
          ...cachedTraits,
        }).find((e) => e.address === key);
        if (!resource) return null;

        return {
          name: resource.name,
          symbol: resource.symbol,
          uri: resource.uri,
          address: resource.address,
          amount: value,
          tags: resource.tags,
          lvl_req: resource.lvl_req,
          mint: resource.mint,
        };
      })
      .filter(Boolean);
    return res.status(200).json({ result: character });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
}
