import { PrivyClient } from "@privy-io/server-auth";
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
        .json({ error: "Invalid request, email is missing." });
    }

    const privyAppId = "cm5f9koyu0crpehoh2f5cxu40";
    const privyAppSecret = process.env.PRIVY_APP_SECRET;

    if (!privyAppId || !privyAppSecret) {
      return res
        .status(500)
        .json({ error: "Privy app id or secret is missing." });
    }

    const privy = new PrivyClient(privyAppId, privyAppSecret);

    const response = await privy.importUser({
      linkedAccounts: [
        {
          type: "email",
          address: email,
        },
      ],
      createEthereumWallet: false,
      createSolanaWallet: true,
      createEthereumSmartWallet: false,
    });

    return res.status(200).json({ result: response });
  } catch (error) {
    console.error("Error while creating user:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
