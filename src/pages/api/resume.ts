import type { NextApiRequest, NextApiResponse } from "next";
import { getSkylineResumeHtml } from "../../resume-templates/Skyline";

const allowedOrigins = ["http://localhost:3000"];

const isAllowedOrigin = (origin: string | undefined): boolean => {
  if (!origin) return false;
  const regex = /^https:\/\/([a-zA-Z0-9-]+\.)?onlinefreecv\.com$/;
  return regex.test(origin) || allowedOrigins.includes(origin);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const origin = req.headers.origin;

  if (isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin!);
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { resume_template: template, ...userData } = req.body;
    if (typeof userData !== "object" || !userData) {
      return res.status(400).json({ error: "Invalid user data" });
    }
    if (!template || !userData) {
      return res.status(400).json({ error: "Missing template or userData" });
    }

    let html = "";
    if (template === "skyline") {
      html = getSkylineResumeHtml(userData);
    } else {
      return res.status(400).json({ error: "Unsupported template" });
    }

    res.setHeader("Content-Type", "text/html");
    return res.status(200).send(html);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
}
