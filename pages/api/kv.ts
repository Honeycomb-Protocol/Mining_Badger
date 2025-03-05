import { kv } from "@vercel/kv";
import { NextApiRequest, NextApiResponse } from "next";

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

      const value = await kv.get(key as string);
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

      const parsedValue = JSON.parse(value);
      const expiryInSeconds = Math.floor(parsedValue.will_expire / 1000);

      await kv.set(key, value, { ex: expiryInSeconds }); // Set key-value pair expiry in seconds
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
