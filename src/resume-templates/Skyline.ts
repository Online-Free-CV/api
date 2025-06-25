// templates/SkylineResume.ts

export type TimelineEntry = {
  title: string;
  company?: string;
  location?: string;
  startDate: string;
  endDate: string;
  description?: string;
  tags?: string[];
  isPresent?: boolean;
  logoUrl?: string;
  phone?: string;
  website?: string;
  subtitle?: string;
};

export type Skill = {
  name: string;
  level: number;
  years: number;
};

export type ThemeColor = {
  name: string;
  base: string;
  gradient: string;
  blob: string;
};

export type UserData = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  location: string;
  current_position: string;
  skills?: Skill[];
  references: TimelineEntry[];
  experiences: TimelineEntry[];
  educations: TimelineEntry[];
  picture?: string;
  about_me?: string;
  themeColor: ThemeColor;
};

export function getSkylineResumeHtml(user: UserData): string {
  const imgSrc = user.picture ||
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Ccircle cx='64' cy='64' r='64' fill='%23cccccc'/%3E%3Cpath d='M64 72c13.3 0 24-10.7 24-24S77.3 24 64 24 40 34.7 40 48s10.7 24 24 24zm0 8c-16 0-48 8-48 24v8h96v-8c0-16-32-24-48-24z' fill='%23ffffff'/%3E%3C/svg%3E";

  const list = (items: Skill[]) => items.slice(0, 5).map(i => `<li>${i.name}</li>`).join("");

  const timeline = (entries: TimelineEntry[]) => entries.map(e => `
    <div class="timeline-entry">
      <h4>${e.title}</h4>
      <span>${[e.subtitle || e.company, e.location].filter(Boolean).join(" | ")} | ${e.startDate} – ${e.isPresent ? "Present" : e.endDate}</span>
      ${e.description ? `<p>${e.description}</p>` : ""}
    </div>
  `).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${user.first_name} ${user.last_name} - Resume</title>
  <style>
     * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #9E9E9E;
      color: #333;
    }
    .resume {
      display: flex;
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      background: white;
      page-break-after: auto;
    }
    .sidebar {
      width: 35%;
      background: #1c2b39;
      color: white;
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100%;
    }
    .sidebar img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 20px;
    }
    .sidebar h2 {
      font-size: 18px;
      margin-top: 10px;
      color: white;
      text-align: center;
    }
    .sidebar .section {
      width: 100%;
      margin-top: 30px;
    }
    .sidebar .section h3 {
      background-image: ${user.themeColor.gradient};
      padding: 8px 10px;
      font-size: 14px;
    }
    .sidebar ul {
      list-style: none;
      padding: 10px 15px;
      font-size: 14px;
    }
    .sidebar ul li {
      margin-bottom: 8px;
    }
    .main {
      width: 65%;
      display: flex;
      flex-direction: column;
    }
    .main-header {
      background: #eeeeee;
      padding: 40px;
    }
    .main-header h1 {
      font-size: 26px;
      font-weight: 600;
    }
    .main-header h1 span {
      color: ${user.themeColor.base};
    }
    .main-header p {
      font-size: 14px;
      margin-top: 10px;
    }
    .main-body {
      padding: 30px 40px;
      flex-grow: 1;
    }
    .main-section {
      margin-top: 30px;
      page-break-inside: avoid;
    }
    .main-section h3 {
      background-image: ${user.themeColor.gradient};
      color: white;
      font-size: 14px;
      padding: 8px 10px;
      margin-bottom: 20px;
    }
    .timeline {
      border-left: 2px solid ${user.themeColor.base};
      padding-left: 20px;
      position: relative;
    }
    .timeline::before {
      content: "";
      position: absolute;
      left: -2px;
      top: 0;
      bottom: 0;
      border-left: 2px dotted ${user.themeColor.base};
    }
    .timeline-entry {
      position: relative;
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    .timeline-entry::before {
      content: "";
      position: absolute;
      left: -27px;
      top: 0px;
      width: 12px;
      height: 12px;
      background-image: ${user.themeColor.gradient};
      border-radius: 50%;
    }
    .timeline-entry h4 {
      font-size: 14px;
      font-weight: bold;
    }
    .timeline-entry span {
      font-size: 13px;
      color: #777;
    }
    .timeline-entry p {
      font-size: 13px;
      margin-top: 8px;
      line-height: 1.5;
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .resume {
        width: 210mm;
        min-height: 297mm;
        box-shadow: none;
        margin: 0;
        page-break-after: always;
        display: flex;
      }
      .main-section h3,
      .sidebar .section h3 {
        background-image: ${user.themeColor.gradient} !important;
        color: white !important;
      }
      .sidebar,
      .main {
        page-break-inside: avoid;
      }
      .main-header {
        background: #eeeeee !important;
      }
    }
  </style>
</head>
<body>
  <div class="resume">
    <div class="sidebar">
      <img src="${imgSrc}" alt="Profile" />
      <h2>${user.first_name} ${user.last_name}<br><small style="font-size: 13px; font-weight: normal; color: #ccc;">${user.current_position}</small></h2>
      <div class="section"><h3>CONTACT</h3><ul>
        <li><strong>Phone:</strong> ${user.phone_number}</li>
        <li><strong>Email:</strong> ${user.email}</li>
        <li><strong>Location:</strong> ${user.location}</li>
      </ul></div>
      ${user.skills?.length ? `<div class="section"><h3>SKILLS</h3><ul>${list(user.skills)}</ul></div>` : ""}
    </div>

    <div class="main">
      <div class="main-header">
        <h1>${user.first_name} <span>${user.last_name}</span></h1>
        <p>${user.about_me || ""}</p>
      </div>
      <div class="main-body">
        <div class="main-section"><h3>WORK EXPERIENCE</h3><div class="timeline">${timeline(user.experiences)}</div></div>
        <div class="main-section"><h3>EDUCATION</h3><div class="timeline">${timeline(user.educations)}</div></div>
      </div>
    </div>
  </div>
</body>
</html>`;
}
