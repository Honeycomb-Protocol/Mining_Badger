import { PrivyClient } from "@privy-io/server-auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { email } = req.body;
      if (!email) {
        throw new Error("Email address is missing.");
      }

      const privyAppId = "cm5f9koyu0crpehoh2f5cxu40";
      const privyAppSecret = process.env.PRIVY_APP_SECRET;

      if (!privyAppId || !privyAppSecret) {
        throw new Error(
          "Privy App ID or Secret is missing in environment variables."
        );
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

      res.status(200).json(response);
    } catch (error) {
      console.error("Error while creating user:", error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
