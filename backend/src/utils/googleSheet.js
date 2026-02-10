import { google } from "googleapis";
import { formatDate } from "./formateDate.js";

export const addToGoogleSheet = async (lead) => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      project_id: process.env.GOOGLE_PROJECT_ID,
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const time = formatDate(lead.createdAt);

  await sheets.spreadsheets.values.append({
    spreadsheetId: "1i6slEs05hVlyO9uXgmlIhrgxqB5M7yyL69SJXbobGP4",
    range: "Sheet1!A1",
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          time,
          lead.name,
          lead.email,
          lead.phone,
          lead.industry,
          lead.message,
          lead.utm_source,
          lead.utm_medium,
          lead.utm_term,
          lead.utm_campaign,
          lead.utm_content,
          lead.adgroupid,
          lead.gclid,
          lead.lpurl,
          lead.formID,
        ],
      ],
    },
  });
};

export const addPartialToGoogleSheet = async (lead) => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      project_id: process.env.GOOGLE_PROJECT_ID,
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const time = formatDate(lead.createdAt);

  await sheets.spreadsheets.values.append({
    spreadsheetId: "1i6slEs05hVlyO9uXgmlIhrgxqB5M7yyL69SJXbobGP4",
    range: "Sheet2!A1",
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          time,
          lead.name,
          lead.email,
          lead.phone,
          lead.industry,
          lead.message,
          lead.utm_source,
          lead.utm_medium,
          lead.utm_term,
          lead.utm_campaign,
          lead.utm_content,
          lead.adgroupid,
          lead.gclid,
          lead.lpurl,
          lead.formID,
        ],
      ],
    },
  });
};
