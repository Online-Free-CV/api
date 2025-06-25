import type { NextApiRequest, NextApiResponse } from 'next';
import { getSkylineResumeHtml, UserData } from '../../resume-templates/Skyline';
import puppeteer from 'puppeteer';

const allowedOrigins = ["http://localhost:3000"];

const isAllowedOrigin = (origin: string | undefined): boolean => {
  if (!origin) return false;
  const regex = /^https:\/\/([a-zA-Z0-9-]+\\.)?onlinefreecv\\.com$/;
  return regex.test(origin) || allowedOrigins.includes(origin);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin;

  if (isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin!);
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userData: UserData = req.body;
    if (!userData) return res.status(400).json({ error: 'Missing user data' });

    const html = getSkylineResumeHtml(userData);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${userData.first_name}_${userData.last_name}_resume.pdf"`
    );
    res.end(pdfBuffer); // important: use end() instead of send()

  } catch (err: any) {
    console.error('[PDF Generation Error]', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}
