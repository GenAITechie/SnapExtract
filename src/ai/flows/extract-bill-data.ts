
'use server';

/**
 * @fileOverview Extracts and consolidates bill data from one or more images using Genkit and Gemini.
 *
 * - extractBillData - Extracts vendor, date, total amount (summed if multiple bills), and aggregated line items from bill image(s).
 * - ExtractBillDataInput - The input type for extractBillData function.
 * - ExtractBillDataOutput - The output type for extractBillData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractBillDataInputSchema = z.object({
  billImages: z.array(z
    .string()
    .describe(
      "A photo of a bill, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ))
    .min(1, "At least one bill image is required.")
    .describe('An array of one or more bill images as data URIs.'),
});
export type ExtractBillDataInput = z.infer<typeof ExtractBillDataInputSchema>;

const LineItemSchema = z.object({
  description: z.string().describe('The description of the line item.'),
  amount: z.number().describe('The amount/cost of the line item.'),
});
export type LineItem = z.infer<typeof LineItemSchema>;

const ExtractBillDataOutputSchema = z.object({
  vendor: z.string().describe('The primary vendor name. If multiple distinct vendors, state "Multiple Vendors" or choose the most prominent.'),
  date: z.string().describe('The most relevant date (YYYY-MM-DD). If multiple, choose earliest, latest, or most frequent.'),
  amount: z.number().describe('The SUM of all total amounts found across all provided images.'),
  lineItems: z.array(LineItemSchema).optional().describe('An aggregated array of all distinct line items from all images. Only include items with a cost.'),
});
export type ExtractBillDataOutput = z.infer<typeof ExtractBillDataOutputSchema>;

export async function extractBillData(input: ExtractBillDataInput): Promise<ExtractBillDataOutput> {
  return extractBillDataFlow(input);
}

const extractBillDataPrompt = ai.definePrompt({
  name: 'extractBillDataPrompt',
  input: {schema: ExtractBillDataInputSchema},
  output: {schema: ExtractBillDataOutputSchema},
  prompt: `You are an expert bill data extractor. You will be given one or more bill images. Your task is to extract and consolidate the information into a single JSON object.

- **Vendor**: Identify the primary vendor. If multiple distinct vendors are present and no single primary one is clear, you may state "Multiple Vendors" or choose the most prominent or frequently occurring one.
- **Date**: Determine the most relevant date from the bill(s). This could be the earliest, latest, or most frequent date if multiple bills are related. Format as YYYY-MM-DD.
- **Total Amount**: This is crucial. Calculate the SUM of all discernible total amounts found across all provided images. If an image does not contain a clear total, try to infer it if possible, or ignore that image for summation if it's too ambiguous.
- **Line Items**: Aggregate all individual line items that have an associated cost from all images. Ensure descriptions are clear and amounts are numeric. If no specific line items with costs are found, the 'lineItems' array can be omitted or empty.

Please process the following images:
{{#each billImages}}
--- Image {{@index}} Start ---
{{media url=this}}
--- Image {{@index}} End ---
{{/each}}

Return the consolidated data in JSON format. Example of lineItems structure: "lineItems": [{"description": "Product A", "amount": 10.99}, {"description": "Service B", "amount": 25.00}]
`,
});

const extractBillDataFlow = ai.defineFlow(
  {
    name: 'extractBillDataFlow',
    inputSchema: ExtractBillDataInputSchema,
    outputSchema: ExtractBillDataOutputSchema,
  },
  async input => {
    const {output} = await extractBillDataPrompt(input);
    return output!;
  }
);
