// This layout has been removed as login functionality is no longer required.
import '../globals.css'; 
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SnapExtract',
  description: 'Login removed.',
};

export default function LoginLayout({
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
      <body className="font-body antialiased bg-background">
        {children}
      </body>
    </html>
  );
}
