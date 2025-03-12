import { Redis } from "@upstash/redis";
import { NextApiRequest, NextApiResponse } from "next";

const redis = Redis.fromEnv();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // GET a single key: /api/kv?key=mykey
    if (req.method === "GET") {
      const { key } = req.query;

      if (!key) {
        return res.status(400).json({ error: "Key is required" });
      }
      const value = await redis.get(key as string);
      return res.status(200).json({ key, value });
    }

    // If method is not allowed
    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error(
      "Upstash error:",
      error.response?.status,
      error.response?.data,
      error.message
    );
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
