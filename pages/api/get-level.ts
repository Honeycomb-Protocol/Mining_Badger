import { NextApiRequest, NextApiResponse } from "next";

const getLevelInfo = (exp: number) =>
  xpArray.find((e) => e.exp >= exp) || xpArray[xpArray.length - 1];

const xpArray = [
  { level: 1, exp: 0 },
  { level: 2, exp: 100 },
  { level: 3, exp: 300 },
  { level: 4, exp: 400 },
  { level: 5, exp: 500 },
  { level: 6, exp: 570 },
  { level: 7, exp: 650 },
  { level: 8, exp: 800 },
  { level: 9, exp: 900 },
  { level: 10, exp: 1000 },
  { level: 11, exp: 1300 },
  { level: 12, exp: 1500 },
  { level: 13, exp: 1800 },
  { level: 14, exp: 2100 },
  { level: 15, exp: 2400 },
  { level: 16, exp: 2700 },
  { level: 17, exp: 3100 },
  { level: 18, exp: 3500 },
  { level: 19, exp: 3900 },
  { level: 20, exp: 4400 },
  { level: 21, exp: 5000 },
  { level: 22, exp: 5600 },
  { level: 23, exp: 6200 },
  { level: 24, exp: 7000 },
  { level: 26, exp: 8000 },
  { level: 26, exp: 9000 },
  { level: 26, exp: 10000 },
  { level: 26, exp: 12000 },
  { level: 26, exp: 13000 },
  { level: 26, exp: 14000 },
  { level: 32, exp: 16000 },
  { level: 33, exp: 18000 },
  { level: 34, exp: 20000 },
  { level: 35, exp: 22000 },
  { level: 36, exp: 24000 },
  { level: 37, exp: 27000 },
  { level: 38, exp: 30000 },
  { level: 39, exp: 33000 },
  { level: 40, exp: 37000 },
  { level: 41, exp: 41000 },
  { level: 42, exp: 45000 },
  { level: 43, exp: 50000 },
  { level: 44, exp: 55000 },
  { level: 45, exp: 61000 },
  { level: 46, exp: 67000 },
  { level: 47, exp: 73000 },
  { level: 48, exp: 80000 },
  { level: 49, exp: 87000 },
  { level: 50, exp: 95000 },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { exp } = req.query;

    if (!exp) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const level = getLevelInfo(Number(exp));
    return res.status(200).json({
      result: {
        level: level.level,
        current_exp: exp,
        exp_req: xpArray.find((e) => e.level === level.level + 1)?.exp,
      },
    });
  } catch (e) {
    console.error(e, "error");
    return res
      .status(500)
      .json({ error: e.message || "Internal Server Error" });
  }
}
