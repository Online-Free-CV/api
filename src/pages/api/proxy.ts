import type { NextApiRequest, NextApiResponse } from "next";

const API_URL = process.env.API_URL!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();
    const json = JSON.parse(text);

    return res.status(200).json(json);
  } catch (error) {
    return res.status(500).json({ error: "Proxy failed", details: (error as any).message });
  }
}
