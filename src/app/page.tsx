'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScanLine } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('snapExtractUser');
    if (user) {
      router.replace('/dashboard');
    }
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="items-center text-center">
          <div className="flex items-center space-x-2 mb-2">
            <ScanLine className="h-10 w-10 text-primary" />
            <CardTitle className="text-3xl font-headline">SnapExtract</CardTitle>
          </div>
          <CardDescription>Login to extract bill data from images.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
      <footer className="mt-8 text-sm text-muted-foreground">
        © {new Date().getFullYear()} SnapExtract. All rights reserved.
      </footer>
    </main>
  );
}
