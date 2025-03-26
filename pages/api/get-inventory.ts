import { PublicKey } from "@solana/web3.js";
import { NextApiRequest, NextApiResponse } from "next";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

import { getEdgeClient } from "@/lib/edge-client";
import { CachedResources, connection, project } from "@/config/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { wallet } = req.query;

    if (!wallet) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
    const edgeClient = getEdgeClient();
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mints = (
      await connection.getParsedTokenAccountsByOwner(new PublicKey(wallet), {
        programId: TOKEN_2022_PROGRAM_ID,
      })
    ).value
      .map((e) => {
        if (
          Object.keys({ ...CachedResources }).includes(
            e.account.data.parsed.info.mint
          )
        ) {
          return e.account.data.parsed.info.mint;
        }

        return null;
      })
      .filter((e) => e !== null);

    const inventory = [];

    if (mints.length > 0) {
      const { resourcesBalance } = await edgeClient.findResourcesBalance({
        wallets: [wallet],
        projects: [project],
        mints: mints,
      });

      for (const resource of resourcesBalance) {
        inventory.push({
          ...CachedResources[resource.mint],
          amount: Number(resource.amount) / 10 ** 6,
          claimed: Number(resource.amount) > 0,
        });
      }
    }

    return res.status(200).json({
      result: inventory.filter((e) => e.amount > 0),
    });
  } catch (e) {
    console.error(e, "error");
    return res
      .status(500)
      .json({ error: e.message || "Internal Server Error" });
  }
}
