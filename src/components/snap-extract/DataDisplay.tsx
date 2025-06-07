'use client';

import { type ExtractBillDataOutput } from '@/ai/flows/extract-bill-data';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, CalendarDays, Building, Info, Mail, FileSpreadsheet, ClipboardCopy, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { exportToSheets, type ExportToSheetsOutput } from '@/ai/flows/export-to-sheets-flow';

interface DataDisplayProps {
  data: ExtractBillDataOutput | null;
  summary: string | null;
  isLoading: boolean;
  error: string | null;
}

const PROFILE_EMAIL_KEY = 'snapExtractProfile_email';

export function DataDisplay({ data, summary, isLoading, error }: DataDisplayProps) {
  const { toast } = useToast();
  const [appEmail, setAppEmail] = useState<string | null>(null);
  const [isExportingToSheets, setIsExportingToSheets] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem(PROFILE_EMAIL_KEY);
    setAppEmail(email);
  }, [data]); 

  const handleExportToSheets = async () => {
    if (!data) {
      toast({
        variant: 'destructive',
        title: 'No Data',
        description: 'No data to export to Sheets.',
      });
      return;
    }

    setIsExportingToSheets(true);
    toast({
      title: 'Exporting to Sheets...',
      description: 'Please wait while the data is being (simulated) sent.',
    });

    try {
      const result: ExportToSheetsOutput = await exportToSheets({
        vendor: data.vendor,
        date: data.date,
        amount: data.amount,
        summary: summary || '',
      });
      
      const isRealUrl = result.sheetUrl !== '#';

      toast({
        title: 'Export Processed (Simulated)',
        description: (
          <>
            {result.message}
            {isRealUrl && (
              <>
                <br />
                <a href={result.sheetUrl} target="_blank" rel="noopener noreferrer" className="underline text-primary hover:text-primary/80">
                  Open Target Sheet
                </a>
              </>
            )}
          </>
        ),
        duration: 10000, // Longer duration to allow clicking the link or reading message
      });
    } catch (err) {
      console.error('Error exporting to Sheets:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: `Could not export to Sheets: ${errorMessage}`,
      });
    } finally {
      setIsExportingToSheets(false);
    }
  };

  const handleEmailData = () => {
    if (!data) {
      toast({ variant: 'destructive', title: 'No Data', description: 'No data to email.' });
      return;
    }
    if (!appEmail) {
      toast({
        variant: 'destructive',
        title: 'Email Not Set',
        description: 'Please set your email in Profile to use this feature.',
      });
      return;
    }

    const subject = `Extracted Bill Data: ${data.vendor}`;
    const body = `
      Here is the extracted bill information:
      Vendor: ${data.vendor}
      Date: ${data.date}
      Amount: ${data.amount}

      Summary:
      ${summary || 'No summary available.'}
    `;
    window.location.href = `mailto:${appEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast({ title: 'Email Client Opened', description: 'Check your email client to send the data.' });
  };

  const handleCopyToClipboard = () => {
    if (!data) {
       toast({ variant: 'destructive', title: 'No Data', description: 'No data to copy.' });
      return;
    }
    const textToCopy = `
      Vendor: ${data.vendor}
      Date: ${data.date}
      Amount: ${data.amount}
      Summary: ${summary || 'No summary available.'}
    `;
    navigator.clipboard.writeText(textToCopy.trim())
      .then(() => {
        toast({ title: 'Copied to Clipboard!', description: 'Extracted data copied.'});
      })
      .catch(err => {
        toast({ variant: 'destructive', title: 'Copy Failed', description: 'Could not copy data to clipboard.' });
        console.error('Failed to copy: ', err);
      });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-1/2" />
        <Separator />
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-md flex items-start">
        <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
        <div>
          <p className="font-semibold">Extraction Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-10">
        <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Upload a bill image to see extracted data here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       {data && (
        <div className="p-3 bg-primary/10 border border-primary/20 text-primary rounded-md flex items-center">
          <CheckCircle2 className="h-5 w-5 mr-2" />
          <p className="text-sm font-medium">Data successfully extracted and summarized!</p>
        </div>
      )}
      <div className="space-y-3">
        <DataItem icon={Building} label="Vendor" value={data.vendor} />
        <DataItem icon={CalendarDays} label="Date" value={data.date} />
        <DataItem icon={DollarSign} label="Amount" value={data.amount.toString()} isCurrency />
      </div>
      
      {summary && (
        <>
          <Separator />
          <div>
            <h4 className="text-lg font-semibold mb-2 flex items-center">
              <Info className="mr-2 h-5 w-5 text-primary" />
              AI Summary
            </h4>
            <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md whitespace-pre-wrap">{summary}</p>
          </div>
        </>
      )}

      <Separator />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
        <Button variant="outline" onClick={handleCopyToClipboard} disabled={!data}>
          <ClipboardCopy className="mr-2 h-4 w-4" /> Copy Data
        </Button>
        <Button variant="outline" onClick={handleEmailData} disabled={!appEmail || !data}>
          <Mail className="mr-2 h-4 w-4" /> Email Data
        </Button>
        <Button 
          variant="accent" 
          onClick={handleExportToSheets} 
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          disabled={isExportingToSheets || !data}
        >
          {isExportingToSheets ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileSpreadsheet className="mr-2 h-4 w-4" />
          )}
          {isExportingToSheets ? 'Exporting...' : 'Export to Sheets'}
        </Button>
      </div>
       {!appEmail && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Set your email in Profile to enable Email Data feature.
          </p>
        )}
    </div>
  );
}

interface DataItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  isCurrency?: boolean;
}

function DataItem({ icon: Icon, label, value, isCurrency }: DataItemProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-dashed">
      <div className="flex items-center">
        <Icon className="h-5 w-5 mr-3 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">{label}:</span>
      </div>
      <span className="text-sm font-semibold">
        {isCurrency && '$'}{value}
      </span>
    </div>
  );
}
