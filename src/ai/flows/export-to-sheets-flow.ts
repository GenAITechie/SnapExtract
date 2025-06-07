
'use server';
/**
 * @fileOverview Simulates exporting extracted bill data, including line items, to Google Sheets.
 *
 * - exportToSheets - A function that simulates sending data to a Google Sheet.
 * - ExportToSheetsInput - The input type for the exportToSheets function.
 * - ExportToSheetsOutput - The return type for the exportToSheets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the LineItem schema, mirroring its definition in extract-bill-data.ts for consistency
const LineItemSchema = z.object({
  description: z.string().describe('The description of the line item.'),
  amount: z.number().describe('The amount/cost of the line item.'),
});
export type LineItem = z.infer<typeof LineItemSchema>;


const ExportToSheetsInputSchema = z.object({
  vendor: z.string().describe('The name of the vendor.'),
  date: z.string().describe('The date of the bill (YYYY-MM-DD).'),
  amount: z.number().describe('The total amount of the bill.'),
  lineItems: z.array(LineItemSchema).optional().describe('An array of line items from the bill.'),
  summary: z.string().optional().describe('An AI-generated summary of the bill.'),
});
export type ExportToSheetsInput = z.infer<typeof ExportToSheetsInputSchema>;

const ExportToSheetsOutputSchema = z.object({
  sheetUrl: z.string().describe('The URL of the Google Sheet where data was (simulated) exported.'),
  message: z.string().describe('A message indicating the result of the operation.'),
});
export type ExportToSheetsOutput = z.infer<typeof ExportToSheetsOutputSchema>;

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
    console.log('[SIMULATION] Exporting to Google Sheets with data:', JSON.stringify(input, null, 2));
    console.log(`[SIMULATION] Target Spreadsheet ID: ${TARGET_SPREADSHEET_ID}`);

    // --- SIMULATED GOOGLE SHEETS API INTERACTION ---
    // In a real implementation, you would:
    // 1. Authenticate with Google APIs.
    // 2. Prepare data:
    //    const mainBillRow = [
    //      input.date,
    //      input.vendor,
    //      input.amount,
    //      new Date().toISOString(), 
    //      input.summary || '',
    //    ];
    //    let rowsToAppend = [mainBillRow];
    //
    //    if (input.lineItems && input.lineItems.length > 0) {
    //      // Add a header for line items if desired, or just append them.
    //      // Example: rowsToAppend.push(['Item Description', 'Item Amount', '', '', '']); // Empty cells for main columns
    //      input.lineItems.forEach(item => {
    //        rowsToAppend.push([item.description, item.amount, '', '', '']); // Adjust columns as needed
    //      });
    //    }
    //
    // 3. Define the append request, potentially making multiple calls or a batch update
    //    if you want to format main bill data and line items distinctly.
    //    const request = {
    //      spreadsheetId: TARGET_SPREADSHEET_ID,
    //      range: 'Sheet1!A1', // Or a specific tab, e.g., 'BillsData!A1'
    //      valueInputOption: 'USER_ENTERED',
    //      insertDataOption: 'INSERT_ROWS',
    //      resource: { values: rowsToAppend },
    //    };
    //
    // 4. Call the Sheets API (e.g., sheets.spreadsheets.values.append(request)).
    //    Handle success and errors.
    // --- END OF SIMULATED INTERACTION ---

    await new Promise(resolve => setTimeout(resolve, 1500)); 

    if (TARGET_SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') {
       return {
        sheetUrl: '#',
        message: `SIMULATION: Data for "${input.vendor}" (including ${input.lineItems?.length || 0} line items) would be exported. PLEASE CONFIGURE 'TARGET_SPREADSHEET_ID' in src/ai/flows/export-to-sheets-flow.ts.`,
      };
    }

    return {
      sheetUrl: SIMULATED_SHEET_URL,
      message: `Data for "${input.vendor}" (including ${input.lineItems?.length || 0} line items) (simulated) exported. Target sheet: ${TARGET_SPREADSHEET_ID}. Complete API integration for actual export.`,
    };
  }
);

