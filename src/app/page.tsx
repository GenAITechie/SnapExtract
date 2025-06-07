
'use client';

import { useState } from 'react';
import { ImageUploader } from '@/components/snap-extract/ImageUploader';
import { DataDisplay } from '@/components/snap-extract/DataDisplay';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { extractBillData, type ExtractBillDataOutput } from '@/ai/flows/extract-bill-data';
import { summarizeExtractedData } from '@/ai/flows/summarize-extracted-data';
import { fileToDataUri } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Wand2 } from 'lucide-react';

export default function MainPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
  const [imageDataUris, setImageDataUris] = useState<string[] | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractBillDataOutput | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageSelect = async (files: File[]) => {
    setSelectedFiles(files);
    setExtractedData(null);
    setSummary(null);
    setError(null);
    setImageDataUris(null); 

    if (files.length === 0) return;

    try {
      const dataUris = await Promise.all(files.map(file => fileToDataUri(file)));
      setImageDataUris(dataUris);
    } catch (err) {
      console.error('Error converting files to data URIs:', err);
      setError('Failed to read one or more image files. Please try again.');
      toast({
        variant: 'destructive',
        title: 'Image Read Error',
        description: 'Could not process the selected image files.',
      });
    }
  };

  const handleExtract = async () => {
    if (!imageDataUris || imageDataUris.length === 0) {
      setError('Please select one or more images first.');
      toast({
        variant: 'destructive',
        title: 'No Images Selected',
        description: 'Please upload image file(s) to extract data.',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setExtractedData(null);
    setSummary(null);

    try {
      toast({
        title: 'Processing Image(s)...',
        description: `AI is extracting data from your bill(s). This may take a moment. Processing ${imageDataUris.length} image(s).`,
      });
      
      const extractionResult = await extractBillData({ billImages: imageDataUris });
      setExtractedData(extractionResult);
      
      toast({
        title: 'Data Extracted!',
        description: 'Now summarizing the results for you.',
      });

      const summaryResult = await summarizeExtractedData({
        extractedData: JSON.stringify(extractionResult),
      });
      setSummary(summaryResult.summary);
      toast({
        title: 'Summary Ready!',
        description: 'Review the extracted data and summary below.',
        variant: 'default'
      });

    } catch (err) {
      console.error('AI processing error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during AI processing.';
      setError(`Failed to extract data: ${errorMessage}`);
      toast({
        variant: 'destructive',
        title: 'Extraction Failed',
        description: `AI could not process the bill(s): ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-headline">
              <Wand2 className="mr-2 h-6 w-6 text-primary" />
              Upload & Extract Bill Data
            </CardTitle>
            <CardDescription>
              Upload one or more images of your bill(s) (e.g., .png, .jpg) and let AI extract and consolidate the details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader
              onImageSelect={handleImageSelect}
              onExtract={handleExtract}
              isExtracting={isLoading}
              selectedFileNames={selectedFiles?.map(f => f.name) || null}
              previewDataUris={imageDataUris}
            />
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Extracted Information</CardTitle>
            <CardDescription>
              Review the consolidated data extracted from your bill(s). You can then export or email it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-md flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
                <div>
                  <p className="font-semibold">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
            <DataDisplay
              data={extractedData}
              summary={summary}
              isLoading={isLoading && !extractedData && !summary} 
              error={null}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
