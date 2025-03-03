import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ error: "Invalid reqest, email is missing." });
    }

    let wallet_address;
    const apiOptions = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-api-key": process.env.METAKEEPAPIKEY!,
        "Idempotency-Key": "Idempotency-Key" + Math.random().toString(),
      },
      body: JSON.stringify({ users: [{ email }] }),
    };
    const batchUserWalletAddress = await fetch(
      "https://api.metakeep.xyz/v3/getWallet/multiple",
      apiOptions
    );
    const resp = await batchUserWalletAddress.json();

    if (!resp?.wallets || resp.wallets.length === 0) {
      const url = process.env.METAKEEPURL!;
      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "x-api-key": process.env.METAKEEPAPIKEY!,
          "Idempotency-Key": "Idempotency-Key" + Math.random().toString(),
        },
        body: JSON.stringify({ user: { email: email } }),
      };
      const metakeepWalletAddress = await fetch(url, options);
      const response = await metakeepWalletAddress.json();
      if (!response?.wallet) {
        return res
          .status(500)
          .json({ error: `Wallet not created. ${response}` });
      }
      wallet_address = response?.wallet?.solAddress;
    } else {
      wallet_address = resp?.wallets[0]?.wallet?.solAddress;
    }

    if (!wallet_address) {
      return res.status(500).json({ error: "Wallet not created" });
    }

    return res.status(200).json({ result: wallet_address });
  } catch (error) {
    console.error("Error while creating user:", error.message);
    return res
      .status(500)
      .json({ error: error?.message || "Internal Server Error" });
  }
}
