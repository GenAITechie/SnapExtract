import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-extracted-data.ts';
import '@/ai/flows/extract-bill-data.ts';
import '@/ai/flows/export-to-sheets-flow.ts';
