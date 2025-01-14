import { PrivyClient } from "@privy-io/server-auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      if (!req.body.email) {
        throw new Error("Email address is missing.");
      }

      const privy = new PrivyClient(
        "cm5f9koyu0crpehoh2f5cxu40",
        "4iMYquSnyvtai3jCztMx7Apjh3WL3kJN9XXCKccY5AvwvoTmtBqgBP8F1TTA5wWmkGmGuLkJNcRz58bZpBMczDCL"
      );

      const response = await privy.importUser({
        linkedAccounts: [
          {
            type: "email",
            address: req.body.email,
          },
        ],
        createEthereumWallet: false,
        createSolanaWallet: true,
        createEthereumSmartWallet: false,
      });

      res.status(200).json(response);
    } catch (e) {
      console.error(
        "Error while creating user:",
        e.response?.data || e.message
      );
      res.status(500).json({ error: e.response?.data || e.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
