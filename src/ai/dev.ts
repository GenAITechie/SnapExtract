
import { config } from 'dotenv';
config(); // Load environment variables

// Import all your Genkit flows here to make them available for development server
import '@/ai/flows/extract-bill-data';
import '@/ai/flows/summarize-extracted-data';
import '@/ai/flows/export-to-sheets-flow';

// You can add other development-specific configurations or initializations here if needed.
console.log('Genkit development server starting with imported flows...');
