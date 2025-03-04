import { NextApiRequest, NextApiResponse } from "next";
import { CachedCraft, cachedResources, CachedTraits } from "@/config/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { tag } = req.query;

    if (!tag) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const data = [...CachedTraits, ...CachedCraft].map((e) => {
      if (tag && typeof tag === "string" && !e.tags.includes(tag)) return null;

      return {
        ...e,
        ingredients: Object.entries(e.ingredients).map(([key, value]) => {
          const resource = cachedResources[key];
          return {
            name: resource.name,
            symbol: resource.symbol,
            uri: resource.uri,
            amount: value,
          };
        }),
      };
    });

    return res.status(200).json({
      result: data.filter((e) => e !== null),
    });
  } catch (e) {
    console.error(e, "error");
    return res
      .status(500)
      .json({ error: e.message || "Internal Server Error" });
  }
}
