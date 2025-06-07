import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppHeader } from '@/components/layout/AppHeader';

export const metadata: Metadata = {
  title: 'SnapExtract',
  description: 'Extract bill data from images easily.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="flex min-h-screen flex-col bg-background">
          <AppHeader />
          <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-auto">{children}</main>
           <footer className="py-4 px-6 text-center text-sm text-muted-foreground border-t">
            SnapExtract - Streamlining your bill management.
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
