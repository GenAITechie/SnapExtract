'use server';
/**
 * @fileOverview Simulates exporting extracted bill data to Google Sheets.
 *
 * - exportToSheets - A function that simulates sending data to a Google Sheet.
 * - ExportToSheetsInput - The input type for the exportToSheets function.
 * - ExportToSheetsOutput - The return type for the exportToSheets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
// For a real implementation, you would uncomment the following and configure authentication:
// import {google} from 'googleapis';
// To use service account authentication (recommended for server-side flows):
// 1. Create a Service Account in Google Cloud Console with "Google Sheets API" enabled & "Editor" role for target sheets.
// 2. Download the JSON key file for the service account.
// 3. Set an environment variable GOOGLE_APPLICATION_CREDENTIALS to the path of this JSON key file.
//    Or, load credentials explicitly in your code using `new GoogleAuth({ keyFilename: 'path/to/your/keyfile.json', scopes: ['https://www.googleapis.com/auth/spreadsheets'] });`
//    Ensure this key file is kept secure and not checked into version control.
//
// For OAuth2 (client-side or more complex server flows), you might use:
// import {authenticate} from '@google-cloud/local-auth'; // Or a similar OAuth2 library

const ExportToSheetsInputSchema = z.object({
  vendor: z.string().describe('The name of the vendor.'),
  date: z.string().describe('The date of the bill (YYYY-MM-DD).'),
  amount: z.number().describe('The total amount of the bill.'),
  summary: z.string().optional().describe('An AI-generated summary of the bill.'),
});
export type ExportToSheetsInput = z.infer<typeof ExportToSheetsInputSchema>;

const ExportToSheetsOutputSchema = z.object({
  sheetUrl: z.string().describe('The URL of the Google Sheet where data was (simulated) exported.'),
  message: z.string().describe('A message indicating the result of the operation.'),
});
export type ExportToSheetsOutput = z.infer<typeof ExportToSheetsOutputSchema>;

// THIS IS A PLACEHOLDER. Replace 'YOUR_SPREADSHEET_ID_HERE' with the actual ID of your Google Sheet.
// You can find the spreadsheet ID in its URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
const TARGET_SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; 
const SIMULATED_SHEET_URL = `https://docs.google.com/spreadsheets/d/${TARGET_SPREADSHEET_ID}`;

export async function exportToSheets(input: ExportToSheetsInput): Promise<ExportToSheetsOutput> {
  return exportToSheetsFlow(input);
}

const exportToSheetsFlow = ai.defineFlow(
  {
    name: 'exportToSheetsFlow',
    inputSchema: ExportToSheetsInputSchema,
    outputSchema: ExportToSheetsOutputSchema,
  },
  async (input) => {
    console.log('[SIMULATION] Exporting to Google Sheets with data:', input);
    console.log(`[SIMULATION] Target Spreadsheet ID: ${TARGET_SPREADSHEET_ID}`);

    // --- SIMULATED GOOGLE SHEETS API INTERACTION ---
    // In a real implementation, you would:
    // 1. Authenticate with Google APIs (Service Account recommended for Genkit flows).
    //    Example using googleapis with Application Default Credentials (ADC) or a service account key file:
    //    const auth = new google.auth.GoogleAuth({
    //      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    //      // keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // If not using ADC
    //    });
    //    const authClient = await auth.getClient();
    //    const sheets = google.sheets({version: 'v4', auth: authClient});

    // 2. Define the data to append (e.g., Date, Vendor, Amount, Export Timestamp, Summary):
    //    const values = [[
    //      input.date,
    //      input.vendor,
    //      input.amount,
    //      new Date().toISOString(), 
    //      input.summary || '',
    //    ]];
    //
    // 3. Define the request to append data to a specific sheet (e.g., 'Sheet1'):
    //    const request = {
    //      spreadsheetId: TARGET_SPREADSHEET_ID,
    //      range: 'Sheet1!A1', // Appends to the first empty row after existing data in Sheet1
    //      valueInputOption: 'USER_ENTERED', // How the input data should be interpreted
    //      insertDataOption: 'INSERT_ROWS', // Inserts new rows for the data
    //      resource: { values },
    //    };
    //
    // 4. Call the Sheets API:
    //    try {
    //      const response = await sheets.spreadsheets.values.append(request);
    //      console.log('Google Sheets API response:', response.data);
    //      // Attempt to construct a more precise URL if possible, linking to the sheet tab (gid)
    //      // const updatedSheetGid = response.data.updates?.updatedRange?.split('!')[0].replace(/'/g,''); // This parsing is speculative
    //      // const sheetUrl = updatedSheetGid ? `${SIMULATED_SHEET_URL}/edit#gid=${updatedSheetGid}` : SIMULATED_SHEET_URL;
    //      return {
    //        sheetUrl: SIMULATED_SHEET_URL, // Use the base URL for now
    //        message: 'Data successfully exported to Google Sheets.',
    //      };
    //    } catch (err) {
    //      console.error('Error exporting to Google Sheets:', err);
    //      // It's good to provide a more specific error message if possible
    //      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    //      throw new Error(`Failed to export data to Google Sheets: ${errorMessage}. Check server logs and ensure the service account has permissions for sheet ID: ${TARGET_SPREADSHEET_ID}.`);
    //    }
    // --- END OF SIMULATED INTERACTION ---

    // Simulate network delay for prototyping
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    if (TARGET_SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') {
       return {
        sheetUrl: '#',
        message: `SIMULATION: Data for "${input.vendor}" would be exported. PLEASE CONFIGURE 'TARGET_SPREADSHEET_ID' in src/ai/flows/export-to-sheets-flow.ts with your actual Google Sheet ID to enable the link.`,
      };
    }

    return {
      sheetUrl: SIMULATED_SHEET_URL,
      message: `Data for "${input.vendor}" (simulated) exported. Target sheet: ${TARGET_SPREADSHEET_ID}. For actual export, complete the API integration in the flow.`,
    };
  }
);
