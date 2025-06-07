// This layout is part of the removed login functionality.
// It should only render children to avoid HTML conflicts if still processed.
import type { Metadata } from 'next';
import '../globals.css'; // Keep for potential global styles if ever needed by children

export const metadata: Metadata = {
  title: 'SnapExtract - Login',
  description: 'Login process for SnapExtract.',
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // A layout should not render <html>, <head>, or <body> tags.
  // These are handled by the root layout.
  // It should simply return its children, possibly wrapped in a fragment or a div.
  return <>{children}</>;
}
