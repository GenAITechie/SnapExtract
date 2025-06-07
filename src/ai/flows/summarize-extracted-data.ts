
'use server';
/**
 * @fileOverview Summarizes extracted data from a document.
 *
 * - summarizeExtractedData - A function that summarizes extracted data.
 * - SummarizeExtractedDataInput - The input type for the summarizeExtractedData function.
 * - SummarizeExtractedDataOutput - The return type for the summarizeExtractedData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeExtractedDataInputSchema = z.object({
  extractedData: z.string().describe('The extracted data from the document, typically in JSON format.'),
});
export type SummarizeExtractedDataInput = z.infer<typeof SummarizeExtractedDataInputSchema>;

const SummarizeExtractedDataOutputSchema = z.object({
  summary: z.string().describe('A brief summary of the extracted data.'),
});
export type SummarizeExtractedDataOutput = z.infer<typeof SummarizeExtractedDataOutputSchema>;

export async function summarizeExtractedData(input: SummarizeExtractedDataInput): Promise<SummarizeExtractedDataOutput> {
  return summarizeExtractedDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeExtractedDataPrompt',
  input: {schema: SummarizeExtractedDataInputSchema},
  output: {schema: SummarizeExtractedDataOutputSchema},
  prompt: `You are an expert data summarizer. You will be provided with extracted data from one or more bills, likely in JSON format. Your task is to provide a brief, human-readable summary of this data, highlighting key information such as the primary vendor, total amount, and perhaps the number of line items or any notable aspects. The goal is for the user to quickly verify the accuracy of the extraction.

Extracted Data: {{{extractedData}}}`,
});

const summarizeExtractedDataFlow = ai.defineFlow(
  {
    name: 'summarizeExtractedDataFlow',
    inputSchema: SummarizeExtractedDataInputSchema,
    outputSchema: SummarizeExtractedDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
