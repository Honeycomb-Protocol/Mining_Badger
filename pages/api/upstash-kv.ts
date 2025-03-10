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
      console.log("Value with key", key, value);
      return res.status(200).json({ key, value });
    }

    // SET a key-value pair (POST request)
    if (req.method === "POST") {
      const { key, value } = req.body;

      if (!key || value === undefined) {
        return res
          .status(400)
          .json({ error: "Both key and value are required" });
      }

      const expiryInSeconds = Math.floor(value.will_expire / 1000);

      await redis.set(key, value, { ex: expiryInSeconds }); // Set key-value pair expiry in seconds
      console.log("Value stored with key", key, value);

      return res
        .status(200)
        .json({ message: "Value stored successfully", key, value });
    }

    // If method is not allowed
    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
