
'use server';

/**
 * @fileOverview Extracts bill data from an image using Genkit and Gemini, including line items.
 *
 * - extractBillData - Extracts vendor, date, total amount, and line items from a bill image.
 * - ExtractBillDataInput - The input type for extractBillData function.
 * - ExtractBillDataOutput - The output type for extractBillData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractBillDataInputSchema = z.object({
  billImage: z
    .string()
    .describe(
      "A photo of a bill, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractBillDataInput = z.infer<typeof ExtractBillDataInputSchema>;

const LineItemSchema = z.object({
  description: z.string().describe('The description of the line item.'),
  amount: z.number().describe('The amount/cost of the line item.'),
});
export type LineItem = z.infer<typeof LineItemSchema>;

const ExtractBillDataOutputSchema = z.object({
  vendor: z.string().describe('The name of the vendor on the bill.'),
  date: z.string().describe('The date on the bill (YYYY-MM-DD).'),
  amount: z.number().describe('The total amount due on the bill.'),
  lineItems: z.array(LineItemSchema).optional().describe('An array of line items from the bill, each with a description and amount. Only include items with a cost.'),
});
export type ExtractBillDataOutput = z.infer<typeof ExtractBillDataOutputSchema>;

export async function extractBillData(input: ExtractBillDataInput): Promise<ExtractBillDataOutput> {
  return extractBillDataFlow(input);
}

const extractBillDataPrompt = ai.definePrompt({
  name: 'extractBillDataPrompt',
  input: {schema: ExtractBillDataInputSchema},
  output: {schema: ExtractBillDataOutputSchema},
  prompt: `You are an expert bill data extractor.

  Extract the vendor, date, and total amount from the following bill image.
  Additionally, extract all individual line items that have an associated cost. For each line item, provide a description and its amount.
  If no specific line items with costs are found, the 'lineItems' array can be omitted or empty.

  Bill Image: {{media url=billImage}}

  Return the data in JSON format, ensuring the 'lineItems' field is an array of objects, each with 'description' (string) and 'amount' (number) keys.
  Example of lineItems structure: "lineItems": [{"description": "Product A", "amount": 10.99}, {"description": "Service B", "amount": 25.00}]
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

