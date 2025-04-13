import type { NextApiRequest, NextApiResponse } from "next";

const API_URL = process.env.API_URL!;
const allowedOrigins = ["http://localhost:3000", "https://edit.onlinefreecv.com"];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

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
    return res.status(500).json({
      error: "Proxy failed",
      details: (error as any).message,
    });
  }
}
