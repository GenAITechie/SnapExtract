'use server';

/**
 * @fileOverview Extracts bill data from an image using Genkit and Gemini.
 *
 * - extractBillData - Extracts vendor, date, and amount from a bill image.
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

const ExtractBillDataOutputSchema = z.object({
  vendor: z.string().describe('The name of the vendor on the bill.'),
  date: z.string().describe('The date on the bill (YYYY-MM-DD).'),
  amount: z.number().describe('The total amount due on the bill.'),
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

  Extract the vendor, date, and amount from the following bill image.

  Bill Image: {{media url=billImage}}

  Return the data in JSON format.
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
