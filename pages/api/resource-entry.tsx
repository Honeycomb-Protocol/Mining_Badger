import { NextApiRequest, NextApiResponse } from "next";

import { MineData } from "@/interfaces";
import { redis } from "@/lib/redis-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { user, resource } = req.body;
      if (!user || !resource) {
        throw new Error("Invalid reqest, User or resource is missing.");
      }

      const secondsToIncrement =
        "mine_time" in resource ? resource.mine_time : 0; // convert seconds to milliseconds
      const currentTime = new Date();
      const incrementedTime = new Date(
        currentTime.getTime() + secondsToIncrement * 1000
      );

      const data: MineData = {
        user: user.id,
        wallet: user.wallet,
        resource: resource.address,
        created_at: currentTime.getTime(),
        will_expire: incrementedTime.getTime(),
      };

      // save the data to the redis cache
      const response = await redis.set(
        `${user.wallet}-${resource.address}`,
        JSON.stringify(data)
      );

      if (response !== "OK") throw new Error("Error saving data to the cache");
      res.status(200).json(data);
    } catch (error) {
      console.error("Error while creating user:", error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
